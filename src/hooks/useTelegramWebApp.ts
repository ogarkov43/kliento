import { useEffect, useState } from "react";
import { getTelegramWebApp, isTelegramMiniAppEnvironment } from "@/lib/telegramWebApp";

type TelegramWebAppUi = {
  colorScheme: "light" | "dark";
  themeParams: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
  };
  viewportStableHeight: number;
  isExpanded: boolean;
};

const readWebAppUi = (): TelegramWebAppUi => {
  const webApp = getTelegramWebApp();
  return {
    colorScheme: webApp.colorScheme,
    themeParams: webApp.themeParams,
    viewportStableHeight: webApp.viewportStableHeight,
    isExpanded: webApp.isExpanded,
  };
};

/**
 * Подписка на изменения темы/viewport Telegram WebApp для реактивного UI.
 */
export const useTelegramWebApp = () => {
  const [ui, setUi] = useState<TelegramWebAppUi>(() => readWebAppUi());

  useEffect(() => {
    if (!isTelegramMiniAppEnvironment()) {
      setUi(readWebAppUi());
      return () => undefined;
    }

    const webApp = getTelegramWebApp();
    const handleUpdate = () => {
      setUi(readWebAppUi());
    };

    try {
      webApp.onEvent("themeChanged", handleUpdate);
      webApp.onEvent("viewportChanged", handleUpdate);
      handleUpdate();
    } catch {
      /* вне Telegram WebView подписка может быть недоступна */
    }

    return () => {
      try {
        webApp.offEvent("themeChanged", handleUpdate);
        webApp.offEvent("viewportChanged", handleUpdate);
      } catch {
        /* noop */
      }
    };
  }, []);

  return ui;
};
