import React from "react";

const LoadingIndicator = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
      <div className="relative flex justify-center items-center">
        <div>Loading...</div>
      </div>
    </div>
  );
};

export default LoadingIndicator;
