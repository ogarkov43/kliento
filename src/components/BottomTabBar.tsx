import { useEffect, useState } from "react";
import homeIcon from "@/assets/logo.svg";
import profileIcon from "@/assets/profile.svg";
import ratingIcon from "@/assets/rating.svg";
import tournamentsIcon from "@/assets/cup.svg";

type TabId = "home" | "tournaments" | "rating" | "profile";

type TabItem = {
  id: TabId;
  label: string;
  icon: string;
};

type BottomTabBarProps = {
  activeTab: TabId;
  onChange: (tab: TabId) => void;
};

type TabIconProps = {
  tab: TabItem;
  isActive: boolean;
  animationTick: number;
};

const tournamentsPrimaryPath =
  "M3.00001 3L6.54601 3.003L18.363 14.821L19.778 13.407L21.192 14.821L18.718 17.296L21.546 20.125L20.132 21.539L17.303 18.71L14.828 21.185L13.414 19.771L14.828 18.356L3.00301 6.531L3.00001 3Z";
const tournamentsSecondaryPath =
  "M7.05001 13.406L10.584 16.942L9.17101 18.356L10.586 19.771L9.17201 21.185L6.69701 18.71L3.86801 21.539L2.45401 20.125L5.28301 17.295L2.80801 14.821L4.22201 13.407L5.63601 14.82L7.04901 13.406H7.05001ZM17.457 3L21 3.003L21.002 6.526L16.949 10.578L13.413 7.043L17.457 3Z";
const ratingPrimaryPath =
  "M5.50879 2.5C3.85179 2.5 2.50879 3.843 2.50879 5.5V16.5C2.50879 18.157 3.85179 19.5 5.50879 19.5H12.0088C13.6658 19.5 15.0088 18.157 15.0088 16.5V5.5C15.0088 3.843 13.6658 2.5 12.0088 2.5H5.50879ZM8.75 6.5C9.07019 6.5 9.39062 6.61613 9.64062 6.84863C10.7496 7.87913 12.5 9.7173 12.5 11.0498C12.5 12.1268 11.6111 13 10.5146 13C10.1741 13 9.85955 12.9073 9.58105 12.7578L10.4727 14.3164C10.6032 14.6444 10.3613 15 10.0078 15H7.50195C7.15045 15 6.90768 14.6478 7.03418 14.3203L7.93262 12.75C7.65062 12.904 7.33185 13 6.98535 13C5.88885 13 5 12.1268 5 11.0498C5 9.7173 6.75038 7.87913 7.85938 6.84863C8.10963 6.61613 8.42981 6.5 8.75 6.5Z";
const ratingSecondaryPath =
  "M15.8955 4.57227C15.9665 4.87027 16.0088 5.18 16.0088 5.5V16.5C16.0088 18.7055 14.2143 20.5 12.0088 20.5H9.56934L14.9434 21.9023C15.1974 21.9688 15.4516 22 15.7021 22C17.0316 22 18.2456 21.1092 18.6006 19.7637L21.4082 9.11426C21.8317 7.50826 20.8697 5.86379 19.2617 5.44629L15.8955 4.57227Z";

const tabs: TabItem[] = [
  { id: "home", label: "Главная", icon: homeIcon },
  { id: "tournaments", label: "Турниры", icon: tournamentsIcon },
  { id: "rating", label: "Рейтинг", icon: ratingIcon },
  { id: "profile", label: "Профиль", icon: profileIcon },
];

/**
 * Иконки табов с анимацией выбранного состояния.
 */
const TabIcon = ({ tab, isActive, animationTick }: TabIconProps) => {
  const baseClassName = "h-5 w-5 object-contain transition-opacity duration-300";

  if (tab.id === "home") {
    return (
      <span className="relative block h-5 w-5">
        <img src={tab.icon} alt="" aria-hidden="true" className={`${baseClassName} opacity-45`} />
        <img
          key={`${tab.id}-${animationTick}`}
          src={tab.icon}
          alt=""
          aria-hidden="true"
          className={[
            "absolute inset-0 h-5 w-5 object-contain",
            isActive ? "tab-icon-home-fill opacity-100" : "opacity-0",
          ].join(" ")}
        />
      </span>
    );
  }

  if (tab.id === "tournaments") {
    return (
      <svg
        key={`${tab.id}-${animationTick}`}
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        aria-hidden="true"
      >
        <path
          d={tournamentsPrimaryPath}
          fill="currentColor"
          className={isActive ? "tab-icon-tournaments-primary" : "opacity-70"}
        />
        <path
          d={tournamentsSecondaryPath}
          fill="currentColor"
          className={isActive ? "tab-icon-tournaments-secondary" : "opacity-70"}
        />
      </svg>
    );
  }

  if (tab.id === "rating") {
    return (
      <svg
        key={`${tab.id}-${animationTick}`}
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        aria-hidden="true"
      >
        <path
          d={ratingSecondaryPath}
          fill="currentColor"
          className={isActive ? "tab-icon-rating-secondary" : "opacity-70"}
        />
        <path
          d={ratingPrimaryPath}
          fill="currentColor"
          className={isActive ? "tab-icon-rating-primary" : "opacity-70"}
        />
      </svg>
    );
  }

  return (
    <span className="relative block h-5 w-5 [perspective:800px]">
      <img
        key={`${tab.id}-${animationTick}`}
        src={tab.icon}
        alt=""
        aria-hidden="true"
        className={[
          "h-5 w-5 object-contain transition-opacity duration-300",
          isActive ? "tab-icon-profile-spin opacity-100" : "opacity-70",
        ].join(" ")}
      />
    </span>
  );
};

/**
 * Нижний таббар с вкладками приложения.
 */
export const BottomTabBar = ({ activeTab, onChange }: BottomTabBarProps) => {
  const activeTabIndex = tabs.findIndex((tab) => tab.id === activeTab);
  const [animationTick, setAnimationTick] = useState(0);

  useEffect(() => {
    setAnimationTick((prev) => prev + 1);
  }, [activeTab]);

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-[430px] px-3 pb-[calc(1rem+var(--tg-safe-bottom))]"
      aria-label="Навигация"
    >
      <div className="rounded-full border border-white/8 bg-[#21090C]/55 p-2 backdrop-blur-xl">
        <div className="relative">
          <span
            className="pointer-events-none absolute inset-y-0 left-0 w-1/4 rounded-full bg-[#501920] transition-transform duration-300 ease-out"
            style={{ transform: `translateX(${Math.max(activeTabIndex, 0) * 100}%)` }}
            aria-hidden="true"
          />
          <ul className="grid grid-cols-4">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;

              return (
                <li key={tab.id} className="relative z-10">
                  <button
                    type="button"
                    className={[
                      "flex w-full flex-col items-center gap-1.5 rounded-full px-1 py-3 text-[11px] font-medium transition-colors duration-300",
                      isActive ? "text-zinc-100" : "text-zinc-400",
                    ].join(" ")}
                    aria-label={tab.label}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => onChange(tab.id)}
                  >
                    <TabIcon tab={tab} isActive={isActive} animationTick={animationTick} />
                    <span>{tab.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export type { TabId };
