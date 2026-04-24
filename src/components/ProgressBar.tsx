type Props = {
  current: number; // 1-indexed
  total: number;
};

export default function ProgressBar({ current, total }: Props) {
  const pct = Math.max(0, Math.min(100, (current / total) * 100));

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-wider text-zinc-500">
        <span>
          Step <span className="text-zinc-300">{current}</span> of {total}
        </span>
        <span className="tabular-nums">{Math.round(pct)}%</span>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-white/5">
        <div
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={1}
          aria-valuemax={total}
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-violet-400 transition-[width] duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
