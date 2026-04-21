import type { CSSProperties } from "react";
import aboutTopIcon from "@/assets/about-top-icon.svg";
import supportTopIcon from "@/assets/support-top-icon.svg";

/**
 * Компактные карточки быстрых разделов на главной.
 */
export const HomeQuickCards = () => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <button
        type="button"
        className="home-card-reveal relative h-[190px] rounded-[24px] border border-[#501920] bg-[#21090C] text-left"
        style={{ "--reveal-delay": "240ms" } as CSSProperties}
        aria-label="Открыть раздел Support"
      >
        <img
          src={supportTopIcon}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute right-6 top-6 h-12 w-12 object-contain"
        />
        <p className="absolute bottom-6 left-6 font-gunterz text-[18px] uppercase tracking-tight text-[#F2F2F2]">
          Support
        </p>
      </button>

      <button
        type="button"
        className="home-card-reveal relative h-[190px] rounded-[24px] border border-[#501920] bg-[#21090C] text-left"
        style={{ "--reveal-delay": "360ms" } as CSSProperties}
        aria-label="Открыть раздел О клубе"
      >
        <img
          src={aboutTopIcon}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute right-6 top-6 h-12 w-12 object-contain"
        />
        <p className="absolute bottom-6 left-6 font-gunterz text-[18px] uppercase tracking-tight text-[#F2F2F2]">
          О клубе
        </p>
      </button>
    </div>
  );
};
