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
