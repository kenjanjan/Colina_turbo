import React from "react";
import { formatCreatedAtDate } from "@/lib/utils";
import ResuableTooltip from "../reusable/tooltip";
import AdlsLoaders from "./loaders/adlsLoaders";

interface AdlsProps {
  recentAdls: any;
  isLoading: boolean;
}

const Adls = ({ recentAdls, isLoading }: AdlsProps) => {
  console.log(recentAdls, "adl");

  // Optional chaining to avoid undefined errors
  const adlCreatedAt = recentAdls?.adl_createdAt;
  const adlAdls = recentAdls?.adl_adls ?? "N/A";
  const adlNotes = recentAdls?.adl_notes ?? "N/A";

  return (
    <div className="sidebar-divider">
      <div className="pt-2"></div>
      {isLoading ? (
        <AdlsLoaders />
      ) : recentAdls ? (
        <div className="flex flex-col">
          <h1 className="font-semibold text-[#4FF4FF]">
            Activities of Daily Living{" "}
            <span className="text-[#FCFF9D]">
              {adlCreatedAt ? ' - ' + formatCreatedAtDate(adlCreatedAt) : "N/A"}
            </span>
          </h1>
          <div className="grid grid-cols-[0.5fr_1fr]">
            <div>ADLs: </div>
            <ResuableTooltip text={adlAdls} />
          </div>
          <div className="grid grid-cols-[0.5fr_1fr]">
            <div>Notes: </div>
            <div className="w-24 truncate">
              <ResuableTooltip text={adlNotes} />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col">
          <h1 className="font-semibold text-[#4ff4ff]">
            Activities of Daily Living
          </h1>
          <div className="grid grid-cols-[0.5fr_1fr]">
            <div>ADLs:</div>
            <div>N/A</div>
          </div>
          <div className="grid grid-cols-[0.5fr_1fr]">
            <div>Notes:</div>
            <div>N/A</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Adls;
