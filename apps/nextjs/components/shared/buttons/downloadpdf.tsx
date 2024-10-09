"use client";
import React from "react";
import Image from "next/image";
import { LucideLoader2 } from "lucide-react";

const DownloadPDF = ({ isLoading }: any) => {
  return (
    <button
      disabled={isLoading}
      className={`${isLoading ? "cursor-not-allowed" : ""} group flex h-[52px] w-[227.72px] items-center justify-center gap-[10px] rounded-[5px] border-[1.76px] border-[#D0D5DD] text-center text-[15px] font-bold hover:border-[#007C85] hover:bg-[#007C85] hover:text-white`}
    >
      <div className="group invert">
        {isLoading ? (
          <LucideLoader2 size={18} className="animate-spin invert" />
        ) : (
          <Image
            src="/imgs/downloadpdf-white.svg"
            alt="Custom Icon"
            className="h-[18px] w-[18px] group-hover:invert"
            width={18}
            height={18}
          />
        )}
      </div>
      {isLoading ? "Generating PDF..." : "Generate PDF"}
    </button>
  );
};

export default DownloadPDF;
