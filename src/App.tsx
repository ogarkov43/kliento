import type { CSSProperties } from "react";
import { useState } from "react";
import logo from "@/assets/logo.svg";
import ratingOverlay from "@/assets/rating-overlay.webp";
import { BottomTabBar, type TabId } from "@/components/BottomTabBar";
import { HomeQuickCards } from "@/components/HomeQuickCards";
import { HomeTournamentCard } from "@/components/HomeTournamentCard";
import { MobileShell } from "@/components/MobileShell";
import { useTelegramWebApp } from "@/hooks/useTelegramWebApp";

/**
 * Возвращает контрастный цвет текста для фона.
 */
const getReadableTextColor = (background: string, candidate: string): string => {
  const normalizeHex = (value: string): string | null => {
    if (!value.startsWith("#")) return null;
    const pure = value.slice(1);
    if (pure.length === 3) {
      return `#${pure
        .split("")
        .map((char) => `${char}${char}`)
        .join("")}`;
    }
    if (pure.length === 6) return `#${pure}`;
    return null;
  };

  const toRgb = (hex: string): [number, number, number] => {
    const safe = normalizeHex(hex) ?? "#000000";
    const r = Number.parseInt(safe.slice(1, 3), 16);
    const g = Number.parseInt(safe.slice(3, 5), 16);
    const b = Number.parseInt(safe.slice(5, 7), 16);
    return [r, g, b];
  };

  const toLuminance = (hex: string): number => {
    const [r, g, b] = toRgb(hex).map((channel) => {
      const value = channel / 255;
      return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const bg = normalizeHex(background) ?? "#0a0a0b";
  const text = normalizeHex(candidate) ?? "#fafafa";
  const bgLum = toLuminance(bg);
  const textLum = toLuminance(text);
  const contrast = (Math.max(bgLum, textLum) + 0.05) / (Math.min(bgLum, textLum) + 0.05);

  if (contrast >= 4.5) return text;
  return bgLum > 0.5 ? "#111111" : "#fafafa";
};

/**
 * Корневой экран: пустое состояние клуба MONTE, готово к будущим модулям.
 */
const App = () => {
  const { themeParams } = useTelegramWebApp();
  const bg = "#21090C";
  const text = getReadableTextColor(bg, themeParams.text_color || "#fafafa");
  const [activeTab, setActiveTab] = useState<TabId>("home");

  return (
    <MobileShell>
      <main
        className="flex min-h-dvh flex-col px-5 pt-[calc(1.25rem+var(--tg-safe-top))]"
        style={{ backgroundColor: bg, color: text }}
      >
        <header className="mb-4 mt-0 flex justify-center">
          <img src={logo} alt="МОНТЕ" className="h-auto w-[42px]" />
        </header>

        <section className="-mx-2 mt-0 flex flex-1 flex-col">
          {activeTab === "home" ? (
            <div className="flex flex-col gap-2 pb-[calc(7rem+var(--tg-safe-bottom))]">
              <div className="home-card-reveal" style={{ "--reveal-delay": "0ms" } as CSSProperties}>
                <HomeTournamentCard />
              </div>
              <div className="home-card-reveal" style={{ "--reveal-delay": "120ms" } as CSSProperties}>
                <HomeTournamentCard
                  titleOnly
                  lightStyle
                  titleText="РЕЙТИНГ МОНТЕ"
                  overlayImageSrc={ratingOverlay}
                />
              </div>
              <HomeQuickCards />
            </div>
          ) : null}
        </section>

        <BottomTabBar activeTab={activeTab} onChange={setActiveTab} />
      </main>
    </MobileShell>
  );
};

export default App;
