import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import ratingBg from "@/assets/rating-bg.svg";
import tournamentBg from "@/assets/tournament-bg.svg";
import { getTelegramWebApp } from "@/lib/telegramWebApp";

type HomeTournamentCardProps = {
  titleOnly?: boolean;
  lightStyle?: boolean;
  titleText?: string;
  overlayImageSrc?: string;
};

/**
 * Карточка первого турнира на главной странице.
 */
export const HomeTournamentCard = ({
  titleOnly = false,
  lightStyle = false,
  titleText = "ЗАБЕРИ СВОЕ",
  overlayImageSrc,
}: HomeTournamentCardProps) => {
  const titleWords = titleText.trim().split(/\s+/);
  const lottieSource = `${import.meta.env.BASE_URL}center.lottie`;
  const telegramUser = getTelegramWebApp().initDataUnsafe.user;
  const fallbackAvatarByUsername = telegramUser?.username
    ? `https://t.me/i/userpic/320/${telegramUser.username}.jpg`
    : undefined;
  const userAvatarUrl = telegramUser?.photo_url || fallbackAvatarByUsername;

  return (
    <article
      className={[
        "relative w-full overflow-hidden rounded-[24px] px-6 pb-6 pt-7 [aspect-ratio:1.58]",
        lightStyle ? "bg-[#93BFE4]" : "border border-[#501920] bg-[#21090C]",
      ].join(" ")}
    >
      {!titleOnly ? (
        <>
          <img
            src={tournamentBg}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover opacity-85"
          />

          <div className="pointer-events-none absolute inset-0 z-[1] -translate-y-16 translate-x-[3rem]">
            <DotLottieReact
              src={lottieSource}
              autoplay
              loop
              segment={[0, 120]}
              className="h-[125%] w-[125%]"
              renderConfig={{
                autoResize: true,
                devicePixelRatio: 2,
                quality: 100,
              }}
            />
          </div>
        </>
      ) : null}

      {titleOnly ? (
        <img
          src={ratingBg}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
        />
      ) : null}

      {titleOnly && overlayImageSrc ? (
        <img
          src={overlayImageSrc}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] h-full w-full object-cover object-right-top"
        />
      ) : null}

      {!titleOnly ? (
        <div className="absolute left-6 top-6 z-10 flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#6B2A32] px-3 py-2.5 text-[14px] font-semibold text-[#ECECEE]">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 text-[#A75B64]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 20a8 8 0 0 1 16 0" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            100 мест
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#6B2A32] px-3 py-2.5 text-[14px] font-semibold text-[#ECECEE]">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 text-[#A75B64]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            25.04 / 15:00
          </span>
        </div>
      ) : null}

      <div className={["absolute left-6 z-10", titleOnly ? "top-6" : "bottom-6"].join(" ")}>
        {!titleOnly ? (
          <p className="mb-2 font-gunterz-italic text-[13px] uppercase tracking-[0.08em] text-[#A75B64]">ТУРНИР</p>
        ) : null}
        <h2
          className={[
            "font-gunterz uppercase leading-[0.9] tracking-tight text-[#F2F2F2]",
            "text-[32px]",
          ].join(" ")}
        >
          {titleWords.map((word, index) => (
            <span key={`${word}-${index}`}>
              <span className={word === "МОНТЕ" ? "font-gunterz-italic" : undefined}>{word}</span>
              {index !== titleWords.length - 1 ? <br /> : null}
            </span>
          ))}
        </h2>
      </div>

      {titleOnly ? (
        <div className="absolute bottom-6 left-6 z-10 flex flex-col gap-1.5">
          <div className="pointer-events-none flex flex-row gap-1.5">
            {userAvatarUrl ? (
              <img
                src={userAvatarUrl}
                alt="Аватар пользователя Telegram"
                className="h-[64px] w-[64px] rounded-full bg-[#FFFFFF] object-cover"
              />
            ) : (
              <span className="h-[64px] w-[64px] rounded-full bg-[#FFFFFF]" aria-hidden="true" />
            )}
            <span className="h-[64px] w-[64px] rounded-full bg-[#FFFFFF]" />
            <span className="h-[64px] w-[64px] rounded-full bg-[#FFFFFF]" />
          </div>
          <button
            type="button"
            aria-label="Открыть турнир"
            className="flex h-[64px] w-[64px] items-center justify-center rounded-full bg-[#FFFFFF] text-[#6D95B6] backdrop-blur-md"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M4 12h16M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      ) : (
        <button
          type="button"
          aria-label="Открыть турнир"
          className="absolute bottom-6 right-6 z-10 flex h-[64px] w-[64px] items-center justify-center rounded-full bg-[#93BFE4]/75 text-[#EAF1F8] backdrop-blur-md"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path d="M4 12h16M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </article>
  );
};
