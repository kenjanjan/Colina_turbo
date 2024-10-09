import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import React from "react";

const Footer = ({className}:any) => {
  const pathname = usePathname();
  const pathParts = pathname.split("/");
  const baseRoute = pathParts[1] || ""; // Get the first part after the base URL
  console.log(baseRoute, "baseRoute");
  return (
    <div className={cn(`${baseRoute==="login"?"":"fixed"} flex w-full items-center justify-between h-[40px] bg-[#FAFAFA] lg:px-[150px] md:px-0 text-[12px] font-semibold min-h-[40px] bottom-0`,className)}>
      <div className=" cursor-pointer text-[#191D2399]">
        Powered by Jairosoft Inc.
      </div>
      <div className="">© All Copyright 2024 ColinaHealth </div>
      <div className="flex gap-2 text-[#191D2399]">
        <p className="cursor-pointer">Terms of Use</p>
        <span>|</span>
        <span className="cursor-pointer">Privacy Policy</span>
      </div>
    </div>
  );
};

export default Footer;
