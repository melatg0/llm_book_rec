import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  lines?: number;
}

export const LoadingSkeleton = ({ 
  className, 
  width, 
  height, 
  variant = 'rectangular',
  lines = 1 
}: LoadingSkeletonProps) => {
  const baseClasses = "animate-skeleton bg-muted rounded";
  
  if (variant === 'text') {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              baseClasses,
              "h-4",
              index === lines - 1 ? "w-3/4" : "w-full",
              className
            )}
            style={{
              width: width || undefined,
              height: height || undefined,
              animationDelay: `${index * 0.1}s`
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'circular') {
    return (
      <div
        className={cn(baseClasses, "rounded-full", className)}
        style={{
          width: width || height || "40px",
          height: height || width || "40px"
        }}
      />
    );
  }

  if (variant === 'card') {
    return (
      <div className={cn("space-y-3", className)}>
        <div
          className={cn(baseClasses, "aspect-[3/4]")}
          style={{ width: width || "100%" }}
        />
        <div className="space-y-2">
          <div className={cn(baseClasses, "h-4 w-3/4")} />
          <div className={cn(baseClasses, "h-3 w-1/2")} />
          <div className={cn(baseClasses, "h-3 w-2/3")} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(baseClasses, className)}
      style={{
        width: width || "100%",
        height: height || "20px"
      }}
    />
  );
};

// Book card skeleton specifically for book loading states
export const BookCardSkeleton = ({ className }: { className?: string }) => {
  return (
    <div className={cn("p-4", className)}>
      <div className="bg-card border border-border/50 rounded-lg overflow-hidden">
        <div className="aspect-[3/4] bg-muted animate-skeleton" />
        <div className="p-4 space-y-3">
          <div className="space-y-2">
            <div className="h-5 bg-muted animate-skeleton rounded w-3/4" />
            <div className="h-4 bg-muted animate-skeleton rounded w-1/2" />
          </div>
          
          <div className="space-y-2">
            <div className="h-4 bg-muted animate-skeleton rounded w-full" />
            <div className="h-4 bg-muted animate-skeleton rounded w-2/3" />
          </div>
          
          <div className="flex gap-2">
            <div className="h-6 bg-muted animate-skeleton rounded w-16" />
            <div className="h-6 bg-muted animate-skeleton rounded w-20" />
          </div>
          
          <div className="space-y-1">
            <div className="h-3 bg-muted animate-skeleton rounded w-1/3" />
            <div className="h-3 bg-muted animate-skeleton rounded w-1/4" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Grid skeleton for multiple items
export const GridSkeleton = ({ 
  items = 6, 
  columns = 3, 
  className 
}: { 
  items?: number; 
  columns?: number; 
  className?: string; 
}) => {
  return (
    <div 
      className={cn(
        "grid gap-4",
        columns === 1 && "grid-cols-1",
        columns === 2 && "grid-cols-1 md:grid-cols-2",
        columns === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        columns === 4 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      {Array.from({ length: items }).map((_, index) => (
        <BookCardSkeleton key={index} />
      ))}
    </div>
  );
};
