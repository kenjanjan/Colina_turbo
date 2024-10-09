import React from "react";
import ResuableTooltip from "../reusable/tooltip";
import ActiveMedsLoaders from "./loaders/activeMedsLoaders";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import UseIsTruncated from "@/lib/hooks/useIstruncated";

interface ActiveMedsProps {
  activeMeds: any[];
  isLoading: boolean;
}

const ActiveMeds: React.FC<ActiveMedsProps> = ({ activeMeds, isLoading }) => {
  const [isTruncated, textRef] = UseIsTruncated();
  console.log(activeMeds, "activemeds");

  return (
    <>
      <div className="sidebar-divider" />
      <div className="flex flex-col">
        {isLoading ? (
          <ActiveMedsLoaders />
        ) : activeMeds.length > 0 ? (
          <div>
            <h1 className="mb-1 font-semibold text-[#4FF4FF]">Active Meds</h1>
            <div className="grid grid-flow-col grid-cols-2 grid-rows-3">
              {activeMeds.map((med, index) => {
                return (
                  <TooltipProvider key={index}>
                    <Tooltip>
                      <TooltipTrigger className="text-start">
                        <div
                          className={`col-span-1 grid grid-cols-3 ${
                            activeMeds.length > 3 && index < 3
                              ? "border-r border-gray-300"
                              : ""
                          } `}
                        >
                          <div
                            ref={textRef}
                            className={`col-span-2 truncate ${
                              index > 2 ? "ml-5" : ""
                            }`}
                          >
                            {med.prescriptions_name}
                          </div>
                          <div className="col-span-1">
                            {med.prescriptions_dosage}
                          </div>
                        </div>
                      </TooltipTrigger>
                      {isTruncated ? (
                        <TooltipContent
                          className="z-[45] max-w-[300px] overflow-visible text-wrap rounded-[2.4px] bg-[#007C85] text-[15px] text-white"
                          side="top"
                        >
                          <p>Medication: {med.prescriptions_name}</p>
                          <p>Frequency: {med.prescriptions_frequency}</p>
                          <p>Interval: {med.prescriptions_interval} hours</p>
                          <div className="absolute bottom-[-5px] left-1/2 z-[49] h-3 w-3 -translate-x-1/2 rotate-45 transform bg-[#007C85]"></div>
                        </TooltipContent>
                      ) : (
                        <TooltipContent
                          className="z-[45] overflow-visible text-wrap rounded-[2.4px] bg-[#007C85] text-[15px] text-white"
                          side="top"
                        >
                          <p>Frequency: {med.prescriptions_frequency}</p>
                          <p>Interval: {med.prescriptions_interval} hours</p>
                          <div className="absolute bottom-[-5px] left-1/2 z-[49] h-3 w-3 -translate-x-1/2 rotate-45 transform bg-[#007C85]"></div>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
          <h1 className="mb-1 font-semibold text-[#4FF4FF]"> Active Meds</h1>
          <div>N/A</div>
          
          {/* <div className="grid grid-cols-6">
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
              </div> */}
   
          </div>
        )}
      </div>
    </>
  );
};

export default ActiveMeds;
