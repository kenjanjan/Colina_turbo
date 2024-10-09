import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const SeeAll = ({ className, url }: any) => {
  const [isSeeAllHovered, setIsSeeAllHovered] = useState(false);

  const onSeeAllHover = () => {
    setIsSeeAllHovered(true);
  };

  const onSeeAllHoverClose = () => {
    setIsSeeAllHovered(false);
  };
  return (
    <Link href={url ? url : "/"}>
      <div
        className={cn(
          `sub-title absolute bottom-3 flex hover:text-[#007C85]`,
          className,
        )}
        onMouseEnter={onSeeAllHover}
        onMouseLeave={onSeeAllHoverClose}
      >
        See All
        <Image
          src={
            isSeeAllHovered
              ? "/icons/see-all-icon-hover.svg"
              : "/icons/see-all-icon.svg"
          }
          alt="dropdown"
          width={17}
          height={14}
        />
      </div>
    </Link>
  );
};

export default SeeAll;
