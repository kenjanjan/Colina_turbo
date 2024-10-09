import React from 'react'

const LatestVitalSignLoader = () => {
  return (
    <div className="flex flex-col">
          <h1 className="mb-1 font-semibold text-[#4FF4FF] flex">Vital Sign <div className="h-[18px] w-[150px] bg-[#0a5c5e] rounded-full animate-pulse ml-1"/></h1>
          <div className="grid grid-cols-6">
            <div className="col-span-2">BP (mmHg):</div>
            <div className="col-span-1 truncate border-r border-gray-200 pr-1">
            <div className="h-[18px] w-[40px] bg-[#0c6d6f] rounded-full animate-pulse ml-1"/>
            </div>
            <div className="col-span-2 ml-5">Temp (°F):</div>
            <div className="col-span-1"><div className="h-[18px] w-[45px] bg-[#0d7f81] rounded-full animate-pulse ml-1"/></div>
          </div>
          <div className="grid grid-cols-6">
            <div className="col-span-2">HR (bpm): </div>
            <div className="col-span-1 truncate border-r border-gray-200 pr-1">
            <div className="h-[18px] w-[35px] bg-[#0a5c5e] rounded-full animate-pulse ml-1"/>
            </div>
            <div className="col-span-2 ml-5">Resp:</div>
            <div className="col-span-1 truncate"><div className="h-[18px] w-[40px] bg-[#0c6d6f] rounded-full animate-pulse ml-1"/></div>
          </div>
        </div>
  )
}

export default LatestVitalSignLoader