import React from 'react'
import { DateTime } from "luxon";
import ResuableTooltip from '../reusable/tooltip';
import LatestLabResultLoader from './loaders/latestLabResultLoader';
interface LatestLabResultProps {
    latestLabResult:any
    isLoading:boolean
}
const formatDateTime = (dateTimeString: string) => {
    const dateTime = DateTime.fromISO(dateTimeString).setZone("local");
    if (!dateTime.isValid) {
      return "Invalid date";
    }
    return dateTime.toFormat("dd / MM / yyyy : hh:mm a");
  };
const LatestLabResult = ({latestLabResult,isLoading}:LatestLabResultProps) => {
  return (
    <>
    <div className="sidebar-divider" />
        {isLoading?(<LatestLabResultLoader/>):(
          latestLabResult.lab_results_date != null ? (
            <div className="flex flex-col">
              <h1 className="mb-1 font-semibold text-[#4FF4FF]">
                Lab Results{" "}
                <span className="text-[#FCFF9D]">
                  <span className="text-white">- </span>
                  {formatDateTime(latestLabResult.lab_results_createdAt)}
                </span>
              </h1>
              <div className="grid grid-cols-6">
                <div className="col-span-2">Hemo A1c:</div>
                <div className="col-span-1 truncate border-r border-gray-200 pr-1">
                  {latestLabResult.lab_results_hemoglobinA1c}%
                </div>
                <div className="col-span-2 ml-5">LDL-C:</div>
                <div className="col-span-1 truncate">
                  <ResuableTooltip
                    text={`${latestLabResult.lab_results_ldlCholesterol}mg/dL`}
                  />
                </div>
              </div>
              <div className="grid grid-cols-6">
                <div className="col-span-2">FBG: </div>
                <div className="col-span-1 truncate border-r border-gray-200 pr-1">
                  <ResuableTooltip
                    text={`${latestLabResult.lab_results_fastingBloodGlucose}mg/dL`}
                  />
                </div>
                <div className="col-span-2 ml-5">HDL-C:</div>
                <div className="col-span-1 truncate">
                  <ResuableTooltip
                    text={`${latestLabResult.lab_results_hdlCholesterol}mg/dL`}
                  />
                </div>
              </div>
              <div className="grid grid-cols-6">
                <div className="col-span-2">TC: </div>
                <div className="col-span-1 truncate border-r border-gray-200 pr-1">
                  <ResuableTooltip
                    text={`${latestLabResult.lab_results_totalCholesterol}mg/dL`}
                  />
                </div>
                <div className="col-span-2 ml-5">TG:</div>
                <div className="col-span-1 truncate">
                  <ResuableTooltip
                    text={`${latestLabResult.lab_results_triglycerides}mg/dL`}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              <h1 className="mb-1 font-semibold text-[#4FF4FF]">Lab Results </h1>
              <div className="grid grid-cols-6">
                <div className="col-span-2">Hemo A1c:</div>
                <div className="col-span-1 truncate border-r border-gray-200 pr-1">
                  N/A
                </div>
                <div className="col-span-2 ml-5">LDL-C:</div>
                <div className="col-span-1 truncate">N/A</div>
              </div>
              <div className="grid grid-cols-6">
                <div className="col-span-2">FBG: </div>
                <div className="col-span-1 truncate border-r border-gray-200 pr-1">
                  N/A{" "}
                </div>
                <div className="col-span-2 ml-5">HDL-C:</div>
                <div className="col-span-1 truncate">N/A </div>
              </div>
              <div className="grid grid-cols-6">
                <div className="col-span-2">TC: </div>
                <div className="col-span-1 truncate border-r border-gray-200 pr-1">
                  N/A{" "}
                </div>
                <div className="col-span-2 ml-5">TG:</div>
                <div className="col-span-1 truncate">N/A </div>
              </div>
            </div>
          )
        )}
        </>
  )
}

export default LatestLabResult