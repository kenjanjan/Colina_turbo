import React from "react";
import ResuableTooltip from "../reusable/tooltip";
import Image from "next/image";
import { DBRecentPRNProps } from "@/lib/interface";
import Link from "next/link";

const RecentPRN = ({
  recentPRN,
  isMedicationCollapsed,
  isPRNCollapsed,
  togglePRNCollapse,
}: DBRecentPRNProps) => {
 
  console.log(recentPRN, "recentPRN");
  return (
    <div
      className={`${isMedicationCollapsed ? "translate-x-[100%]" : isPRNCollapsed ? "" : "translate-x-[50%]"} absolute top-[55px] h-full w-full bg-[#FAFAFA] pr-5 transition-all duration-300`}
    >
      <div className="relative grid w-full grid-cols-2">
        <div
          className={`col-span-1 flex w-full flex-col pr-4 transition-all duration-300`}
        >
          <div className="flex w-full justify-between">
            <div className="font-medium">PRN</div>
            <div className="flex justify-end text-end">
              <Image
                onClick={togglePRNCollapse}
                className={`${isPRNCollapsed ? "-rotate-90" : "rotate-90"} ${recentPRN?.length > 4 ? "" : "hidden"} mr-2 cursor-pointer transition-all duration-300`}
                src="/icons/see-all-icon.svg"
                alt="dropdown"
                width={17}
                height={14}
              />
            </div>
          </div>
        </div>
      </div>
      {recentPRN ? (
        <div className="relative grid grid-flow-col grid-cols-2 grid-rows-4 transition-all duration-300">
          {recentPRN.map((medication: any, index: number) =>
           (
              medication?.medicationlogs_medicationLogsName
            ) !== null ? (
              <div
                key={index}
                className={`sub-title grid w-full grid-cols-6 gap-6 ${index > 3 ? "pl-5" : ""}`}
              >
                <div className="col-span-4 truncate pr-5">
                  <ResuableTooltip
                    text={`${medication?.medicationlogs_medicationLogsName || medication?.medicationLogsName===null && ""}`}
                  />
                </div>
                <div className="col-span-2 text-start">
                  {medication?.medicationlogs_medicationLogsDosage}
                </div>
              </div>
            ) : (
              <div className="sub-title absolute right-[35%] top-[50px] h-full w-1/2">
                no data yet
              </div>
            ),
          )}
        </div>
      ) : (
        <div className="sub-title absolute right-[35%] top-[50px] mt-5 h-full w-1/2">
          no data yet
        </div>
      )}
    </div>
  );
};

export default RecentPRN;
