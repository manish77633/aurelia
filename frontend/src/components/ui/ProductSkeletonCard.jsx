import React from 'react';

const ProductSkeletonCard = () => (
  <div className="overflow-hidden rounded-lg border border-gray-50 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
    <div className="aspect-[4/5] sm:aspect-square animate-pulse bg-gradient-to-br from-[#f5f0e8] via-[#fbf7ef] to-[#eee4d6]" />
    <div className="flex min-h-[146px] flex-col px-3 py-3.5 pb-4 sm:px-4 sm:py-4 sm:pb-5">
      <div className="mb-2 h-3 w-16 animate-pulse rounded-full bg-[#eadfce]" />
      <div className="mb-2 h-4 w-full animate-pulse rounded-full bg-[#eee7dc]" />
      <div className="mb-2.5 h-4 w-2/3 animate-pulse rounded-full bg-[#eee7dc]" />
      <div className="mb-3 h-3 w-20 animate-pulse rounded-full bg-[#f0e8dc]" />
      <div className="mt-auto flex items-center justify-between">
        <div className="h-5 w-16 animate-pulse rounded-full bg-[#e6dccb]" />
        <div className="h-9 w-14 animate-pulse rounded-lg bg-[#ead8ba] sm:w-9 sm:rounded-full" />
      </div>
    </div>
  </div>
);

export default ProductSkeletonCard;
