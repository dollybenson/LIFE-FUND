export function ProgressBar({ percent }: { percent: number }) {
  const p = Math.max(0, Math.min(100, percent));
  return (
    <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
      <div className="h-full bg-brand-500" style={{ width: `${p}%` }} />
    </div>
  );
}
