import { useEffect, useState } from "react";
import { getTelegramWebApp, isTelegramMiniAppEnvironment } from "@/lib/telegramWebApp";

/**
 * Возвращает URL аватара пользователя Telegram с повторной синхронизацией после init.
 */
export const useTelegramUserPhotoUrl = (): string | null => {
  const readPhotoUrl = (): string | null => {
    const user = getTelegramWebApp().initDataUnsafe.user;
    const raw = user?.photo_url?.trim();
    if (raw) {
      return raw;
    }
    if (user?.username) {
      return `https://t.me/i/userpic/320/${user.username}.jpg`;
    }
    if (user?.id) {
      return `https://t.me/i/userpic/320/${user.id}.jpg`;
    }
    return null;
  };

  const [photoUrl, setPhotoUrl] = useState<string | null>(() => readPhotoUrl());

  useEffect(() => {
    setPhotoUrl(readPhotoUrl());
    if (!isTelegramMiniAppEnvironment()) {
      return () => undefined;
    }

    const webApp = getTelegramWebApp();
    const sync = () => {
      setPhotoUrl(readPhotoUrl());
    };

    const intervalId = window.setInterval(sync, 800);
    window.setTimeout(() => {
      window.clearInterval(intervalId);
    }, 6000);

    webApp.onEvent("viewportChanged", sync);
    document.addEventListener("visibilitychange", sync);

    return () => {
      window.clearInterval(intervalId);
      webApp.offEvent("viewportChanged", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return photoUrl;
};
