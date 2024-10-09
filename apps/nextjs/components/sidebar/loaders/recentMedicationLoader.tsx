import React from "react";

const RecentMedicationLoader = () => {
  return (
    <div className="flex flex-col ">
      <div className="font-semibold text-[#4FF4FF] flex">Recent Medication <div className="h-[18px] w-[120px] bg-[#0c6d6f] rounded-full animate-pulse ml-1"/></div>
      <div className="grid grid-cols-[0.5fr_1fr]">
        <div>Status:</div>
        <div className="h-[18px] w-[140px] bg-[#0d7f81] rounded-full animate-pulse ml-1"/>
      </div>
      <div className="grid grid-cols-[0.5fr_1fr]">
        <div>Medication:</div>
        <div className="h-[18px] w-[100px] bg-[#0a5c5e] rounded-full animate-pulse ml-1"/>
      </div>
      <div className="grid grid-cols-[0.5fr_1fr]">
        <div>Note:</div>
        <div className="truncate">
        <div className="h-[18px] w-[110px] bg-[#0c6d6f] rounded-full animate-pulse ml-1"/>
        </div>
      </div>
    </div>
  );
};

export default RecentMedicationLoader;
