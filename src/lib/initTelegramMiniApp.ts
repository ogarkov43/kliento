import { getTelegramWebApp, isTelegramMiniAppEnvironment } from "@/lib/telegramWebApp";

type TelegramSwipeBehaviorMessage = {
  eventType: "web_app_setup_swipe_behavior";
  eventData: {
    allow_vertical_swipe: boolean;
  };
};

type WindowWithTelegramProxy = Window & {
  TelegramWebviewProxy?: {
    postEvent: (eventType: string, eventData?: string) => void;
  };
};

const TELEGRAM_OVERFLOW_LOCK = 100;

/**
 * Отключает вертикальный свайп закрытия Mini App для новых клиентов.
 */
const setupSwipeBehavior = (allowVerticalSwipe: boolean): void => {
  const message: TelegramSwipeBehaviorMessage = {
    eventType: "web_app_setup_swipe_behavior",
    eventData: { allow_vertical_swipe: allowVerticalSwipe },
  };

  const payload = JSON.stringify(message.eventData);
  const proxyWindow = window as WindowWithTelegramProxy;

  proxyWindow.TelegramWebviewProxy?.postEvent(message.eventType, payload);

  if (window.parent !== window) {
    window.parent.postMessage(JSON.stringify(message), "https://web.telegram.org");
    window.parent.postMessage(JSON.stringify(message), "*");
  }
};

/**
 * Принудительно отключает вертикальный свайп закрытия через все доступные API.
 */
const disableCloseSwipe = (): void => {
  const webApp = getTelegramWebApp();
  webApp.disableVerticalSwipes?.();
  setupSwipeBehavior(false);
};

/**
 * Дополнительный iOS-safe lock против случайного свайпа закрытия вниз.
 * Основано на практическом workaround для Telegram WebView.
 */
const applyOverflowSwipeLock = (): void => {
  const overflow = TELEGRAM_OVERFLOW_LOCK;
  document.documentElement.style.overflowY = "hidden";
  document.documentElement.style.height = `${window.innerHeight + overflow}px`;
  document.body.style.overflowY = "hidden";
  document.body.style.marginTop = `${overflow}px`;
  document.body.style.height = `${window.innerHeight + overflow}px`;
  document.body.style.paddingBottom = `${overflow}px`;
  window.scrollTo(0, overflow);
};

/**
 * Удерживает scroll на "безопасной" позиции, чтобы свайп вниз не схлопывал WebView.
 */
const keepScrollLocked = (): void => {
  if (window.scrollY < TELEGRAM_OVERFLOW_LOCK) {
    window.scrollTo(0, TELEGRAM_OVERFLOW_LOCK);
  }
};

/**
 * Блокирует резкий свайп вниз на верхней границе WebView.
 */
const setupTouchSwipeGuard = (): void => {
  let startY = 0;

  document.addEventListener(
    "touchstart",
    (event) => {
      startY = event.touches[0]?.clientY ?? 0;
    },
    { passive: true },
  );

  document.addEventListener(
    "touchmove",
    (event) => {
      const currentY = event.touches[0]?.clientY ?? startY;
      const deltaY = currentY - startY;
      const nearTop = window.scrollY <= TELEGRAM_OVERFLOW_LOCK + 2;
      if (deltaY > 8 && nearTop) {
        event.preventDefault();
        keepScrollLocked();
      }
    },
    { passive: false },
  );

  window.addEventListener("scroll", keepScrollLocked, { passive: true });
  document.addEventListener("touchend", keepScrollLocked, { passive: true });
};

/**
 * Инициализация Telegram Mini App: готовность, разворот, базовые UX-настройки.
 */
export const initTelegramMiniApp = (): void => {
  if (!isTelegramMiniAppEnvironment()) {
    return;
  }

  const webApp = getTelegramWebApp();

  try {
    webApp.ready();
    webApp.expand();
    // На части клиентов Telegram повторный expand нужен для стабильного fullscreen.
    requestAnimationFrame(() => {
      webApp.expand();
    });
    window.setTimeout(() => {
      webApp.expand();
    }, 120);
    disableCloseSwipe();
    requestAnimationFrame(disableCloseSwipe);
    window.setTimeout(disableCloseSwipe, 250);
    webApp.onEvent("viewportChanged", disableCloseSwipe);
    applyOverflowSwipeLock();
    requestAnimationFrame(applyOverflowSwipeLock);
    window.setTimeout(applyOverflowSwipeLock, 250);
    webApp.onEvent("viewportChanged", applyOverflowSwipeLock);
    window.addEventListener("resize", applyOverflowSwipeLock, { passive: true });
    keepScrollLocked();
    requestAnimationFrame(keepScrollLocked);
    window.setTimeout(keepScrollLocked, 250);
    setupTouchSwipeGuard();

    webApp.setHeaderColor("bg_color");
    const backgroundColor = "#21090C" as `#${string}`;
    webApp.setBackgroundColor(backgroundColor);
  } catch (err) {
    console.error("[MONTE] Telegram WebApp init", err);
  }
};
