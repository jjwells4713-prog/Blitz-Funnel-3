import Link from "next/link";

type Props = {
  size?: "sm" | "md";
  href?: string;
};

export default function Logo({ size = "md", href = "/" }: Props) {
  const textSize = size === "sm" ? "text-base" : "text-lg";
  const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  const content = (
    <span className="inline-flex items-center gap-2 font-semibold tracking-tight">
      <span
        aria-hidden
        className={`${iconSize} grid place-items-center rounded-md bg-gradient-to-br from-violet-500 to-violet-700 text-white shadow-[0_0_20px_-4px_rgba(124,58,237,0.8)]`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-3 w-3"
          aria-hidden
        >
          <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />
        </svg>
      </span>
      <span className={`${textSize} text-white`}>
        blitz<span className="text-violet-400">mailer</span>
      </span>
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex">
        {content}
      </Link>
    );
  }
  return content;
}
