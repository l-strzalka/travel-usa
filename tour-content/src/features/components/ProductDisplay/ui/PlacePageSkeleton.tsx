// tour-content/src/components/ui/PlacePageSkeleton.tsx


export const PlacePageSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
      <div className="h-10 bg-gray-200 rounded w-2/3 mb-4"></div>
      <div className="h-6 bg-gray-200 rounded w-1/4 mb-8"></div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-96 bg-gray-200 rounded-2xl w-full"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="h-80 bg-gray-200 rounded-2xl w-full"></div>
        </div>
      </div>
    </div>
  );
};