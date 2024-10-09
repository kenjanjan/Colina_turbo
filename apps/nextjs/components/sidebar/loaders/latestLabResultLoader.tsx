import React from "react";

const LatestLabResultLoader = () => {
  return (
    <div className="flex flex-col">
      <h1 className="mb-1 font-semibold text-[#4FF4FF] flex">Lab Results <div className="h-[18px] w-[120px] bg-[#0d7f81] rounded-full animate-pulse ml-1"/></h1>
      <div className="grid grid-cols-6">
        <div className="col-span-2">Hemo A1c:</div>
        <div className="col-span-1 truncate border-r border-gray-200 pr-1">
        <div className="h-[18px] w-[45px] bg-[#0a5c5e] rounded-full animate-pulse ml-1"/>
        </div>
        <div className="col-span-2 ml-5">LDL-C:</div>
        <div className="col-span-1 truncate"><div className="h-[18px] w-[40px] bg-[#0c6d6f] rounded-full animate-pulse ml-1"/></div>
      </div>
      <div className="grid grid-cols-6">
        <div className="col-span-2">FBG: </div>
        <div className="col-span-1 truncate border-r border-gray-200 pr-1">
        <div className="h-[18px] w-[35px] bg-[#0d7f81] rounded-full animate-pulse ml-1"/>
        </div>
        <div className="col-span-2 ml-5">HDL-C:</div>
        <div className="col-span-1 truncate"><div className="h-[18px] w-[30px] bg-[#0a5c5e] rounded-full animate-pulse ml-1"/> </div>
      </div>
      <div className="grid grid-cols-6">
        <div className="col-span-2">TC: </div>
        <div className="col-span-1 truncate border-r border-gray-200 pr-1">
        <div className="h-[18px] w-[40px] bg-[#0c6d6f] rounded-full animate-pulse ml-1"/>
        </div>
        <div className="col-span-2 ml-5">TG:</div>
        <div className="col-span-1 truncate"><div className="h-[18px] w-[35px] bg-[#0d7f81] rounded-full animate-pulse ml-1"/> </div>
      </div>
    </div>
  );
};

export default LatestLabResultLoader;
