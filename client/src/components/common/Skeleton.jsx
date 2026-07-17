export default function Skeleton({ className = '' }) {
  return <div className={`skeleton ${className}`} />;
}

export function CardSkeleton({ count = 3 }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card-premium p-4 space-y-3">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-full" />
        </div>
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="container-site section-pad space-y-8">
      <Skeleton className="h-10 w-1/2" />
      <Skeleton className="h-4 w-2/3" />
      <div className="grid gap-6 md:grid-cols-2">
        <Skeleton className="h-72 w-full" />
        <Skeleton className="h-72 w-full" />
      </div>
    </div>
  );
}
