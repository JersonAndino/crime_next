const SkeletonLoader = () => {
    return (
      <div className="animate-pulse">
        <div className="h-6 w-3/4 bg-gray-300 rounded mb-4"></div>
        <div className="h-6 w-1/2 bg-gray-300 rounded mb-4"></div>
        <div className="h-6 w-full bg-gray-300 rounded mb-4"></div>
        <div className="h-6 w-2/3 bg-gray-300 rounded mb-4"></div>
      </div>
    );
  };
  
  export default SkeletonLoader;
  