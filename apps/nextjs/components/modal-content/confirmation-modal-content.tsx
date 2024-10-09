import React, { useEffect, useState } from "react";

interface Modalprops {
  uuid: string;
  setConfirm: (isConfirm: boolean) => void;
  label: string;
  handleFunction: (uuid: string) => void;
  isSubmitted?: boolean;
}
export const ConfirmationModal = ({
  uuid,
  setConfirm,
  label,
  handleFunction,
  isSubmitted,
}: Modalprops) => {
  return (
    <div>
      <div className="h-[146px] w-[600px] max-w-lg rounded-md bg-white">
        <div className="flex items-center justify-center pb-6 pt-6">
          <h2 className="text-[20px] font-semibold text-[#667085]">
            {`Are you sure to ${
              label === "Archived"
                ? "archive"
                : label === "Delete"
                  ? "delete"
                  : label === "Restore"
                    ? "restore"
                    : ""
            } this?`}{" "}
          </h2>
        </div>
        <div className="flex items-center justify-center gap-2">
          <button
            disabled={isSubmitted}
            onClick={() => {
              setConfirm(false);
            }}
            type="button"
            className={` ${isSubmitted && "cursor-not-allowed"} h-[45px] w-[160px] rounded-sm bg-[#F3F3F3] font-medium text-black hover:bg-[#D9D9D9]`}
          >
            No
          </button>
          <button
            disabled={isSubmitted}
            onClick={() => {
              label === "Archived"
                ? handleFunction(uuid)
                : label === "Delete"
                  ? handleFunction(uuid)
                  : label === "Restore"
                    ? handleFunction(uuid)
                    : null;
            }}
            type="button"
            className={` ${isSubmitted && "cursor-not-allowed"} h-[45px] w-[160px] rounded-sm bg-[#007C85] px-3 py-2 font-medium text-[#ffff] hover:bg-[#03595B]`}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};
