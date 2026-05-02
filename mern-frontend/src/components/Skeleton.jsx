export function PageSkeleton({ rows = 3 }) {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="skel h-8 w-56" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="surface p-5">
            <div className="skel h-3 w-20" />
            <div className="skel h-7 w-24 mt-3" />
          </div>
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="surface p-5">
          <div className="skel h-4 w-1/3" />
          <div className="skel h-3 w-2/3 mt-3" />
          <div className="skel h-3 w-1/2 mt-2" />
        </div>
      ))}
    </div>
  );
}
