import React from "react";

const ActiveMedsLoaders = () => {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="mb-1 flex font-semibold text-[#4FF4FF]">
        Active Meds{" "}
        <div className="ml-1 h-[18px] w-[140px] animate-pulse rounded-full bg-[#0a5c5e]" />
      </h1>
      <div className="grid grid-cols-6 -mt-1">
        <div className="col-span-2">
          <div className="ml-1 h-[18px] w-[80px] animate-pulse rounded-full bg-[#0c6d6f]" />
        </div>
        <div className="col-span-1 truncate border-r border-gray-200 pr-1">
          <div className="ml-1 h-[18px] w-[45px] animate-pulse rounded-full bg-[#0a5c5e]" />
        </div>
        <div className="col-span-2 ml-5">
          <div className="ml-1 h-[18px] w-[85px] animate-pulse rounded-full bg-[#0a5c5e]" />
        </div>
        <div className="col-span-1 truncate">
          <div className="ml-1 h-[18px] w-[40px] animate-pulse rounded-full bg-[#0c6d6f]" />
        </div>
      </div>
      <div className="grid grid-cols-6">
        <div className="col-span-2">
          <div className="ml-1 h-[18px] w-[75px] animate-pulse rounded-full bg-[#0d7f81]" />{" "}
        </div>
        <div className="col-span-1 truncate border-r border-gray-200 pr-1">
          <div className="ml-1 h-[18px] w-[35px] animate-pulse rounded-full bg-[#0d7f81]" />
        </div>
        <div className="col-span-2 ml-5">
          <div className="ml-1 h-[18px] w-[80px] animate-pulse rounded-full bg-[#0c6d6f]" />
        </div>
        <div className="col-span-1 truncate">
          <div className="ml-1 h-[18px] w-[30px] animate-pulse rounded-full bg-[#0a5c5e]" />{" "}
        </div>
      </div>
      <div className="grid grid-cols-6">
        <div className="col-span-2">
          <div className="ml-1 h-[18px] w-[90px] animate-pulse rounded-full bg-[#0c6d6f]" />{" "}
        </div>
        <div className="col-span-1 truncate border-r border-gray-200 pr-1">
          <div className="ml-1 h-[18px] w-[40px] animate-pulse rounded-full bg-[#0c6d6f]" />
        </div>
        <div className="col-span-2 ml-5">
          <div className="ml-1 h-[18px] w-[70px] animate-pulse rounded-full bg-[#0a5c5e]" />
        </div>
        <div className="col-span-1 truncate">
          <div className="ml-1 h-[18px] w-[35px] animate-pulse rounded-full bg-[#0d7f81]" />{" "}
        </div>
      </div>
    </div>
  );
};

export default ActiveMedsLoaders;
