export function NewsCardSkeleton({ variant = 'horizontal', isHeadline = false }) {
  const containerClassName = variant === 'vertical'
    ? "flex flex-col gap-4 py-4 border-b border-gray-100 animate-pulse"
    : "flex gap-12 py-4 border-b border-gray-100 animate-pulse"

  return (
    <article className={containerClassName}>
      <div className={variant === "vertical" 
        ? "w-full h-48 bg-gray-200 rounded-xl" 
        : `${isHeadline ? "w-1/2 h-80" : "w-80 h-48"} bg-gray-200 rounded-xl`} 
      />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 bg-gray-200 rounded-full" />
          <div className="w-32 h-4 bg-gray-200 rounded" />
        </div>
        <div className={`h-6 bg-gray-200 rounded mb-4 ${isHeadline ? "w-3/4" : "w-2/3"}`} />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
        </div>
      </div>
    </article>
  )
} 