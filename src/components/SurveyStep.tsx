"use client";

import { useEffect, useRef } from "react";

type Props = {
  questionNumber: number;
  question: string;
  subtext?: string;
  options: string[];
  selected?: string;
  onSelect: (value: string) => void;
  onBack?: () => void;
};

export default function SurveyStep({
  questionNumber,
  question,
  subtext,
  options,
  selected,
  onSelect,
  onBack,
}: Props) {
  // Focus the first option on mount for keyboard flow; also re-focus when question changes.
  const firstBtnRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    firstBtnRef.current?.focus({ preventScroll: true });
  }, [questionNumber]);

  return (
    <div className="animate-fade-up">
      <div className="mb-6 flex items-center gap-3">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-white/10 px-3 text-sm text-zinc-300 transition hover:border-white/20 hover:text-white"
            aria-label="Go back to previous question"
          >
            <span aria-hidden>←</span> Back
          </button>
        ) : (
          <span className="h-9" aria-hidden />
        )}
        <span className="text-xs uppercase tracking-wider text-violet-400/80">
          Question {questionNumber}
        </span>
      </div>

      <h1 className="text-balance text-2xl font-semibold leading-tight text-white sm:text-3xl md:text-4xl">
        {question}
      </h1>
      {subtext ? (
        <p className="mt-3 text-sm text-zinc-400 sm:text-base">{subtext}</p>
      ) : null}

      <div className="mt-8 grid gap-3">
        {options.map((opt, i) => {
          const isSelected = selected === opt;
          return (
            <button
              key={opt}
              ref={i === 0 ? firstBtnRef : undefined}
              type="button"
              onClick={() => onSelect(opt)}
              aria-pressed={isSelected}
              className={[
                "group relative flex min-h-[56px] w-full items-center justify-between gap-4 rounded-xl border px-5 py-4 text-left",
                "transition-all duration-200 ease-out",
                isSelected
                  ? "border-violet-500/60 bg-violet-500/10 shadow-[0_0_0_1px_rgba(124,58,237,0.5),0_10px_40px_-10px_rgba(124,58,237,0.6)]"
                  : "border-white/10 bg-white/[0.02] hover:border-violet-400/40 hover:bg-white/[0.04]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink",
              ].join(" ")}
            >
              <span className="text-[15px] font-medium text-white sm:text-base">
                {opt}
              </span>
              <span
                aria-hidden
                className={[
                  "inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border transition",
                  isSelected
                    ? "border-violet-400 bg-violet-500 text-white"
                    : "border-white/15 text-transparent group-hover:border-violet-400/60",
                ].join(" ")}
              >
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-3.5 w-3.5"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0l-3.5-3.5a1 1 0 111.4-1.4l2.8 2.8 6.8-6.8a1 1 0 011.4 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
