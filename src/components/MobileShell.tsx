import type { ReactNode } from "react";

type MobileShellProps = {
  children: ReactNode;
};

/**
 * Оболочка «только телефон»: на десктопе контент в узкой колонке с фоном вокруг.
 */
export const MobileShell = ({ children }: MobileShellProps) => {
  return (
    <div
      className="flex min-h-dvh justify-center bg-zinc-950"
      style={{ backgroundColor: "#21090C" }}
    >
      <div
        className="relative flex w-full max-w-[430px] flex-col bg-zinc-950 ring-1 ring-white/5"
        style={{ backgroundColor: "#21090C" }}
        role="application"
        aria-label="МОНТЕ"
      >
        {children}
      </div>
    </div>
  );
};
