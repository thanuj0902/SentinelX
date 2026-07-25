export default function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`glass-card rounded-xl p-5 animate-pulse ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="h-3 bg-navy-700 rounded w-1/3" />
        <div className="h-3 bg-navy-700 rounded w-16" />
      </div>
      <div className="h-8 bg-navy-700 rounded w-1/2 mb-2" />
      <div className="h-3 bg-navy-700 rounded w-2/3" />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="glass-card rounded-xl p-4 flex items-center gap-4 animate-pulse">
          <div className="w-10 h-10 rounded-full bg-navy-700" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-navy-700 rounded w-1/3" />
            <div className="h-2 bg-navy-700 rounded w-2/3" />
          </div>
          <div className="h-6 w-16 bg-navy-700 rounded" />
        </div>
      ))}
    </div>
  );
}
