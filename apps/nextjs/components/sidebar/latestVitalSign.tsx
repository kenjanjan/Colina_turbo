import { formatDate, formatTime } from "@/lib/utils";
import React from "react";
import ResuableTooltip from "../reusable/tooltip";
import LatestVitalSignLoader from "./loaders/latestVitalSignLoader";
interface LatestVitalSignProps {
    latestVitalSign:any
    isLoading: boolean
}
const LatestVitalSign = ({latestVitalSign,isLoading}:LatestVitalSignProps) => {
  return (
    <>
      <div className="sidebar-divider" />
      {isLoading?(<LatestVitalSignLoader/>):(
        latestVitalSign.vitalsign_bloodPressure != null ? (
          <div className="flex flex-col">
            <h1 className="mb-1 font-semibold text-[#4FF4FF]">
              Vital Sign{" "}
              <span className="text-[#FCFF9D]">
                <span className="text-white">-</span>{" "}
                {formatDate(latestVitalSign.vitalsign_date)} :{" "}
                {formatTime(latestVitalSign.vitalsign_time)}
              </span>
            </h1>
            <div className="grid grid-cols-6">
              <div className="col-span-2">BP (mmHg):</div>
              <div className="col-span-1 truncate border-r border-gray-200 pr-1">
                {latestVitalSign.vitalsign_bloodPressure}
              </div>
              <div className="col-span-2 ml-5">Temp (°F):</div>
              <div className="col-span-1">
                {latestVitalSign.vitalsign_temperature}
              </div>
            </div>
            <div className="grid grid-cols-6">
              <div className="col-span-2">HR (bpm): </div>
              <div className="col-span-1 truncate border-r border-gray-200 pr-1">
                {latestVitalSign.vitalsign_heartRate}
              </div>
              <div className="col-span-2 ml-5">Resp:</div>
              <div className="col-span-1 truncate">
                <ResuableTooltip
                  text={`${latestVitalSign.vitalsign_respiratoryRate}`}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            <h1 className="mb-1 font-semibold text-[#4FF4FF]">Vital Sign </h1>
            <div className="grid grid-cols-6">
              <div className="col-span-2">BP (mmHg):</div>
              <div className="col-span-1 truncate border-r border-gray-200 pr-1">
                N/A
              </div>
              <div className="col-span-2 ml-5">Temp (°F):</div>
              <div className="col-span-1">N/A</div>
            </div>
            <div className="grid grid-cols-6">
              <div className="col-span-2">HR (bpm): </div>
              <div className="col-span-1 truncate border-r border-gray-200 pr-1">
                N/A
              </div>
              <div className="col-span-2 ml-5">Resp:</div>
              <div className="col-span-1 truncate">N/A</div>
            </div>
          </div>
        )
      )}
    </>
  );
};

export default LatestVitalSign;
