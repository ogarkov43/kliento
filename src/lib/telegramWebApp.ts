type TelegramUser = {
  first_name?: string;
  username?: string;
  photo_url?: string;
};

type TelegramThemeParams = {
  bg_color?: string;
  text_color?: string;
  hint_color?: string;
};

type TelegramWebAppLike = {
  ready: () => void;
  expand: () => void;
  disableVerticalSwipes?: () => void;
  isVersionAtLeast: (version: string) => boolean;
  setHeaderColor: (color: "bg_color" | "secondary_bg_color" | `#${string}`) => void;
  setBackgroundColor: (color: "bg_color" | "secondary_bg_color" | `#${string}`) => void;
  onEvent: (eventType: string, callback: () => void) => void;
  offEvent: (eventType: string, callback: () => void) => void;
  colorScheme: "light" | "dark";
  themeParams: TelegramThemeParams;
  viewportStableHeight: number;
  isExpanded: boolean;
  initDataUnsafe: { user?: TelegramUser };
};

type WindowWithTelegram = Window & {
  Telegram?: { WebApp?: Partial<TelegramWebAppLike> };
};

const fallbackThemeParams: TelegramThemeParams = {
  bg_color: "#21090C",
  text_color: "#fafafa",
  hint_color: "#a1a1aa",
};

/**
 * Возвращает Telegram WebApp или безопасный fallback для обычного браузера.
 */
export const getTelegramWebApp = (): TelegramWebAppLike => {
  const windowWebApp = (window as WindowWithTelegram).Telegram?.WebApp;

  return {
    ready: () => undefined,
    expand: () => undefined,
    disableVerticalSwipes: () => undefined,
    isVersionAtLeast: () => false,
    setHeaderColor: () => undefined,
    setBackgroundColor: () => undefined,
    onEvent: () => undefined,
    offEvent: () => undefined,
    colorScheme: "dark",
    themeParams: {
      ...fallbackThemeParams,
      ...(windowWebApp?.themeParams ?? {}),
    },
    viewportStableHeight: windowWebApp?.viewportStableHeight ?? window.innerHeight,
    isExpanded: windowWebApp?.isExpanded ?? true,
    initDataUnsafe: windowWebApp?.initDataUnsafe ?? {},
    ...windowWebApp,
  };
};

/**
 * Проверяет, запущено ли приложение внутри Telegram Mini App.
 */
export const isTelegramMiniAppEnvironment = (): boolean => {
  return Boolean((window as WindowWithTelegram).Telegram?.WebApp);
};

