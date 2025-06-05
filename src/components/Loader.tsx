import React from "react";

const Loader: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen py-10 z-50 bg-[#0a0233]">
      <div className="w-25 h-25 border-4 border-blue-500 border-12 border-dashed rounded-full animate-spin" />
    </div>
  );
};

export default Loader;
