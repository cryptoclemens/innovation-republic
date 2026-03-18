export default function MatchSkeleton() {
  return (
    <div
      className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800 sm:p-5"
      role="status"
      aria-label="Loading result"
    >
      <div className="flex gap-3 sm:gap-4">
        <div className="flex min-w-[56px] flex-col items-center sm:min-w-[68px]">
          <div className="h-9 w-12 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-700" />
        </div>
        <div className="min-w-0 flex-1 space-y-3">
          <div className="h-5 w-1/3 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-12 w-full rounded bg-slate-100 dark:bg-slate-700" />
          <div className="flex gap-3">
            <div className="h-3 w-20 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-3 w-16 rounded bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
