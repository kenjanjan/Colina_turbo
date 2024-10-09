import React from "react";
import ResuableTooltip from "../reusable/tooltip";
import Image from "next/image";
import { DBRecentMedicationProps } from "@/lib/interface";
import Link from "next/link";
import SeeAll from "../reusable/seeAll";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import UseIsTruncated from "@/lib/hooks/useIstruncated";
import { formatDate, formatTime } from "@/lib/utils";

const RecentMedication = ({
  recentMedication,
  isMedicationCollapsed,
  isPRNCollapsed,
  toggleMedicationCollapse,
  patientId,
}: DBRecentMedicationProps) => {
  const [isTruncated, textRef] = UseIsTruncated();

  console.log(recentMedication, "recentMedication");
  return (
    <>
      <div className="grid w-full grid-cols-2 bg-[#FAFAFA]">
        <div
          className={`col-span-1 flex w-full flex-col pr-4 transition-all duration-300`}
        >
          <div className="flex w-full justify-between">
            <div className="font-medium">Medication</div>
            <div className="flex justify-end text-end">
              <Image
                onClick={toggleMedicationCollapse}
                className={`${isMedicationCollapsed ? "-rotate-90" : "rotate-90"} ${recentMedication?.length > 4 ? "" : "hidden"} cursor-pointer transition-all duration-300`}
                src="/icons/see-all-icon.svg"
                alt="dropdown"
                width={17}
                height={14}
              />
            </div>
          </div>
        </div>
      </div>

      {recentMedication ? (
        <div
          className={`grid grid-flow-col grid-cols-2 grid-rows-4 transition-all duration-300`}
        >
          {recentMedication?.map((medication: any, index: number) => {
            return medication?.medicationlogs_medicationLogsName !== null ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="text-start">
                    <div
                      key={index}
                      className={`sub-title grid w-full grid-cols-3 ${index > 3 ? "pl-5" : ""}`}
                    >
                      <div className="col-span-2 truncate pr-5" ref={textRef}>
                        {medication?.medicationlogs_medicationLogsName}
                      </div>
                      <div className="col-span-1 text-start">
                        {medication?.medicationlogs_medicationLogsDosage}
                      </div>
                    </div>
                  </TooltipTrigger>

                  {isTruncated ? (
                    <TooltipContent
                      className="z-[45] max-w-[300px] overflow-visible text-wrap rounded-[2.4px] bg-[#007C85] text-[15px] text-white"
                      side="top"
                    >
                      <p>
                        Medication:{" "}
                        {medication.medicationlogs_medicationLogsName}
                      </p>
                      <p>
                        Date Taken:{" "}
                        {formatDate(
                          medication.medicationlogs_medicationLogsDate,
                        )}
                      </p>
                      <p>
                        Time Taken:{" "}
                        {formatTime(
                          medication.medicationlogs_medicationLogsTime,
                        )}
                      </p>
                      <div className="absolute bottom-[-5px] left-1/2 z-[49] h-3 w-3 -translate-x-1/2 rotate-45 transform bg-[#007C85]"></div>
                    </TooltipContent>
                  ) : (
                    <TooltipContent
                      className="z-[45] overflow-visible text-wrap rounded-[2.4px] bg-[#007C85] text-[15px] text-white"
                      side="top"
                    >
                      <p>
                        Date Taken:{" "}
                        {formatDate(
                          medication.medicationlogs_medicationLogsDate,
                        )}
                      </p>
                      <p>
                        Time Taken:{" "}
                        {formatTime(
                          medication.medicationlogs_medicationLogsTime,
                        )}
                      </p>
                      <div className="absolute bottom-[-5px] left-1/2 z-[49] h-3 w-3 -translate-x-1/2 rotate-45 transform bg-[#007C85]"></div>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            ) : (
              <div className="sub-title absolute left-[15%] top-[50%] mt-5 h-full w-1/2">
                no data yet
              </div>
            );
          })}
        </div>
      ) : (
        <div className="sub-title absolute left-[15%] top-[50%] mt-5 h-full w-1/2">
          no data yet
        </div>
      )}
      <SeeAll
        url={
          patientId ? `/patient-overview/${patientId}/medication/scheduled` : ""
        }
        className={`transition-all duration-300 ${isMedicationCollapsed ? "left-[85%]" : "left-[35%]"} ${recentMedication === undefined ? "hidden" : ""}`}
      />
    </>
  );
};

export default RecentMedication;
