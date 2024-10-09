import React from "react";
import { cn } from "@/lib/utils";

interface detailsProps {
  className?: string; // Make className optional
}

const Details = ({ className = '' }: detailsProps) => {
  // Determine the hover class based on the passed className
  const hoverClasses = className.includes('bg-[#FDF5F7]') || className.includes('bg-[#FFFDF7]')
    ? 'hover:!text-black hover:!bg-[#FFFFFF]'
    : 'hover:!text-white hover:!bg-[#007C85]';

  const buttonClasses = cn(
    "w-[95px] h-[40px] rounded",
    "!bg-[#E7EAEE]",
    "text-[15px]",
    hoverClasses, // Apply the hover classes conditionally
    className // Apply any additional classes passed via props
  );
  return (
    <button className={buttonClasses}>
      <span className="mt-1 flex items-center justify-center">Details</span>
    </button>
  );
};

export default Details;
