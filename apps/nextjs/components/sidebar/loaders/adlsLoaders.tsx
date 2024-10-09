import React from "react";
const AdlsLoaders = () => {
  return (
    <div className="flex flex-col">
      <h1 className="flex font-semibold text-[#4FF4FF]">
        Activities of Daily Living{" "}
        <div className="ml-1 h-[18px] w-[120px] animate-pulse rounded-full bg-[#0d7f81]" />
      </h1>
      <div className="grid grid-cols-[0.5fr_1fr]">
        <div>ADLs:</div>
        <div className="ml-1 h-[18px] w-[130px] animate-pulse rounded-full bg-[#0a5c5e]"></div>
      </div>
      <div className="grid grid-cols-[0.5fr_1fr]">
        <div>Notes:</div>
        <div className="ml-1 h-[18px] w-[130px] animate-pulse rounded-full bg-[#0a5c5e]"></div>
      </div>
    </div>
  );
};
export default AdlsLoaders;
