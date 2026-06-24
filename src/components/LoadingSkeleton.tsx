import React from "react";

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse space-y-4">
      <div className="aspect-square w-full rounded-2xl bg-slate-200" />
      <div className="space-y-2">
        <div className="h-3 w-1/4 rounded bg-slate-200" />
        <div className="h-4 w-3/4 rounded bg-slate-200" />
        <div className="h-3 w-1/3 rounded bg-slate-200" />
        <div className="h-4 w-1/5 rounded bg-slate-200" />
      </div>
    </div>
  );
};

export const CategoryCardSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse rounded-2xl aspect-3/4 bg-slate-200" />
  );
};

export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8">
      {Array.from({ length: count }).map((_, idx) => (
        <ProductCardSkeleton key={idx} />
      ))}
    </div>
  );
};

export const ProductDetailsSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-square w-full rounded-2xl bg-slate-200" />
          <div className="flex gap-4">
            <div className="h-20 w-20 rounded-lg bg-slate-200" />
            <div className="h-20 w-20 rounded-lg bg-slate-200" />
            <div className="h-20 w-20 rounded-lg bg-slate-200" />
          </div>
        </div>
        {/* Info */}
        <div className="space-y-6">
          <div className="h-4 w-1/6 rounded bg-slate-200" />
          <div className="h-8 w-2/3 rounded bg-slate-200" />
          <div className="h-4 w-1/4 rounded bg-slate-200" />
          <div className="h-6 w-1/5 rounded bg-slate-200" />
          <div className="h-16 w-full rounded bg-slate-200" />
          <div className="space-y-2">
            <div className="h-4 w-1/4 rounded bg-slate-200" />
            <div className="flex gap-2">
              <div className="h-8 w-8 rounded-full bg-slate-200" />
              <div className="h-8 w-8 rounded-full bg-slate-200" />
            </div>
          </div>
          <div className="h-12 w-full rounded-full bg-slate-200" />
        </div>
      </div>
    </div>
  );
};
