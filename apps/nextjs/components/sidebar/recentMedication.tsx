import { formatDate, formatTime } from "@/lib/utils";
import React from "react";
import ResuableTooltip from "../reusable/tooltip";
import RecentMedicationLoader from "./loaders/recentMedicationLoader";

interface RecentMedicationProps {
  recentMedication: any;
  isLoading: boolean;
}
const RecentMedication = ({
  recentMedication,
  isLoading,
}: RecentMedicationProps) => {
  return (
    <>
      <div className="sidebar-divider" />
      {isLoading ? (
        <RecentMedicationLoader />
      ) : recentMedication.medicationlogs_medicationLogsName != null ? (
        <div className="flex flex-col">
          <h1 className="font-semibold text-[#4FF4FF]">
            Recent Medication{" "}
            <span className="text-[#FCFF9D]">
              <span className="text-white">-</span>{" "}
              {formatDate(recentMedication.medicationlogs_medicationLogsDate)} :{" "}
              {formatTime(recentMedication.medicationlogs_medicationLogsTime)}
            </span>
          </h1>
          <div className="grid grid-cols-[0.5fr_1fr]">
            <div>Status:</div>
            <div
              className={`w-fit rounded-[5px] ${recentMedication.medicationlogs_medicationLogStatus == "Given" ? "bg-[#1EBC10]" : recentMedication.medicationlogs_medicationLogStatus == "Refused" ? "bg-[#FF5B78]" : "bg-[#DEB216]"} px-2 py-0.5 text-[12px]`}
            >
              {recentMedication.medicationlogs_medicationLogStatus}
            </div>
          </div>
          <div className="grid grid-cols-[0.5fr_1fr]">
            <div>Medication:</div>
            <div className="truncate">
              <ResuableTooltip
                text={`${recentMedication.medicationlogs_medicationLogsName}`}
              />
            </div>
          </div>
          <div className="grid grid-cols-[0.5fr_1fr]">
            <div>Note:</div>
            <div className="truncate">
              <ResuableTooltip
                text={`${recentMedication.medicationlogs_notes}`}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col">
          <h1 className="font-semibold text-[#4FF4FF]">Recent Medication </h1>
          <div className="grid grid-cols-[0.5fr_1fr]">
            <div>Status:</div>
            <div className="">N/A</div>
          </div>
          <div className="grid grid-cols-[0.5fr_1fr]">
            <div>Medication:</div>
            <div>N/A</div>
          </div>
          <div className="grid grid-cols-[0.5fr_1fr]">
            <div>Note:</div>
            <div className="truncate">
            <ResuableTooltip
                text={`${recentMedication.medicationlogs_notes}`}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RecentMedication;
