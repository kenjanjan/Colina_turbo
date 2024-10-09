import { formatDate, formatTime } from "@/lib/utils";
import React from "react";
import ResuableTooltip from "../reusable/tooltip";
import RecentPRNLoader from "./loaders/recentPRNLoader";
interface RecentPRNProps {
  recentPRN: any;
  isLoading: boolean
}
const RecentPRN = ({ recentPRN,isLoading }: RecentPRNProps) => {
  return (
    <>
      <div className="sidebar-divider" />
      {isLoading? (
        <RecentPRNLoader/>
      ):(
        recentPRN.medicationlogs_medicationLogsName != null ? (
          <div className="flex flex-col">
            <h1 className="font-semibold text-[#4FF4FF]">
              PRN{" "}
              <span className="text-[#FCFF9D]">
                <span className="text-white">-</span>{" "}
                {formatDate(recentPRN.medicationlogs_medicationLogsDate)} :{" "}
                {formatTime(recentPRN.medicationlogs_medicationLogsTime)}
              </span>
            </h1>
            <div className="grid grid-cols-[0.5fr_1fr]">
              <div>Status:</div>
              <div
                className={`w-fit rounded-[5px] ${recentPRN.medicationlogs_medicationLogStatus == "Given" ? "bg-[#1EBC10]" : recentPRN.medicationlogs_medicationLogStatus == "Refused" ? "bg-[#FF5B78]" : "bg-[#DEB216]"} px-2 py-0.5 text-[12px]`}
              >
                {recentPRN.medicationlogs_medicationLogStatus}
              </div>
            </div>
            <div className="grid grid-cols-[0.5fr_1fr]">
              <div>Medication:</div>
              <div>
                <ResuableTooltip
                  text={`${recentPRN.medicationlogs_medicationLogsName}`}
                />
              </div>
            </div>
            <div className="grid grid-cols-[0.5fr_1fr]">
              <div>Note:</div>
              <div className="truncate">
                <ResuableTooltip text={`${recentPRN.medicationlogs_notes}`} />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            <h1 className="font-semibold text-[#4FF4FF]">PRN </h1>
            <div className="grid grid-cols-[0.5fr_1fr]">
              <div>Status:</div>
              <div className="">N/A</div>
            </div>
            <div className="grid grid-cols-[0.5fr_1fr]">
              <div>Medication</div>
              <div>N/A</div>
            </div>
            <div className="grid grid-cols-[0.5fr_1fr]">
              <div>Note:</div>
              <div className="truncate">
                <h1>N/A</h1>
              </div>
            </div>
          </div>
        )
      )}
    </>
  );
};

export default RecentPRN;
