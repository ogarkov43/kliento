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
 * Принудительно отключает вертикальный свайп закрытия через все доступные API.
 */
const disableCloseSwipe = (): void => {
  const webApp = getTelegramWebApp();
  if (typeof webApp.disableVerticalSwipes === "function") {
    webApp.disableVerticalSwipes();
  } else if (typeof webApp.enableVerticalSwipes === "function") {
    webApp.enableVerticalSwipes(false);
  }
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
    reapplySwipeProtection();
    requestAnimationFrame(reapplySwipeProtection);
    window.setTimeout(reapplySwipeProtection, 200);

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
