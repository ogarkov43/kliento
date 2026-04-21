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
 * Дополнительный iOS-safe lock против случайного свайпа закрытия вниз.
 * Основано на практическом workaround для Telegram WebView.
 */
const applyOverflowSwipeLock = (): void => {
  const overflow = TELEGRAM_OVERFLOW_LOCK;
  document.body.style.overflowY = "hidden";
  document.body.style.marginTop = `${overflow}px`;
  document.body.style.height = `${window.innerHeight + overflow}px`;
  document.body.style.paddingBottom = `${overflow}px`;
  window.scrollTo(0, overflow);
};

/**
 * Удерживает страницу в безопасной scroll-позиции (workaround iOS Telegram).
 */
const setupOverflowGuard = (): void => {
  const keepScroll = () => {
    if (window.scrollY < TELEGRAM_OVERFLOW_LOCK) {
      window.scrollTo(0, TELEGRAM_OVERFLOW_LOCK);
    }
  };

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
      const draggingDown = currentY - startY > 8;
      const nearTop = window.scrollY <= TELEGRAM_OVERFLOW_LOCK + 2;
      if (draggingDown && nearTop) {
        event.preventDefault();
        keepScroll();
      }
    },
    { passive: false },
  );

  document.addEventListener("touchend", keepScroll, { passive: true });
  window.addEventListener("scroll", keepScroll, { passive: true });
  window.setInterval(keepScroll, 400);
};

/**
 * Принудительно отключает вертикальный свайп закрытия через все доступные API.
 */
const disableCloseSwipe = (): void => {
  const webApp = getTelegramWebApp();
  if (typeof webApp.disableVerticalSwipes === "function") {
    webApp.disableVerticalSwipes();
  } else if (typeof webApp.enableVerticalSwipes === "function") {
    webApp.enableVerticalSwipes(false);
  }
  webApp.enableClosingConfirmation?.();
  webApp.isClosingConfirmationEnabled = true;
  setupSwipeBehavior(false);
};

/**
 * Повторно применяет защиту от свайпа и lock высоты после изменений viewport.
 */
const reapplySwipeProtection = (): void => {
  applyOverflowSwipeLock();
  disableCloseSwipe();
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
    setupOverflowGuard();
    reapplySwipeProtection();
    requestAnimationFrame(reapplySwipeProtection);
    window.setTimeout(reapplySwipeProtection, 200);
    window.setTimeout(() => {
      webApp.expand();
      reapplySwipeProtection();
    }, 600);
    window.setTimeout(() => {
      webApp.expand();
      reapplySwipeProtection();
    }, 1200);

    webApp.setHeaderColor("bg_color");
    const backgroundColor = "#21090C" as `#${string}`;
    webApp.setBackgroundColor(backgroundColor);

    webApp.onEvent("viewportChanged", (event?: { isStateStable?: boolean }) => {
      reapplySwipeProtection();
      if (event?.isStateStable) {
        webApp.expand();
      }
    });
  } catch (err) {
    console.error("[MONTE] Telegram WebApp init", err);
  }
};
