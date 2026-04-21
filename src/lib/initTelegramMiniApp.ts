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
  }
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

    if (webApp.isVersionAtLeast("6.1")) {
      webApp.disableVerticalSwipes?.();
    }
    if (webApp.isVersionAtLeast("7.7")) {
      setupSwipeBehavior(false);
    }

    webApp.setHeaderColor("bg_color");
    const backgroundColor = "#21090C" as `#${string}`;
    webApp.setBackgroundColor(backgroundColor);
  } catch (err) {
    console.error("[MONTE] Telegram WebApp init", err);
  }
};
