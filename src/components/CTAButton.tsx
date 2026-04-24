import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  href?: string;
  children?: ReactNode;
  size?: "md" | "lg";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
};

const BASE =
  "group relative inline-flex items-center justify-center gap-2 rounded-xl " +
  "bg-violet-600 px-6 font-medium text-white " +
  "shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_12px_40px_-10px_rgba(124,58,237,0.7)] " +
  "transition-all duration-200 ease-out " +
  "hover:bg-violet-500 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_18px_50px_-8px_rgba(124,58,237,0.9)] " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink " +
  "active:translate-y-px " +
  "disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-violet-600";

const SIZES = {
  md: "h-12 text-[15px]",
  lg: "h-14 text-base sm:text-[17px]",
} as const;

export default function CTAButton({
  href = "/apply",
  children = (
    <>
      Book a Free Strategy Call
      <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5">
        →
      </span>
    </>
  ),
  size = "lg",
  className = "",
  onClick,
  type = "button",
  disabled,
}: Props) {
  const cls = `${BASE} ${SIZES[size]} ${className}`;

  // If we get a click handler, type=submit, or no href, render a button.
  if (onClick || type === "submit" || !href) {
    return (
      <button type={type} onClick={onClick} disabled={disabled} className={cls}>
        {children}
      </button>
    );
  }

  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
