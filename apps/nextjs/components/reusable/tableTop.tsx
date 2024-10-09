"use client";
import React, { useState } from "react";
import Image from "next/image";
import DropdownMenu from "../dropdown-menu";
interface Option {
  label: string;
  onClick: (label: string) => void;
}

interface TableTopProps {
  isOpenSortedBy: boolean;
  isOpenOrderedBy: boolean;
  optionsSortBy: Option[];
  optionsOrderedBy: Option[];
  term: string;  // 'term' is a string
  setTerm: (term: string) => void;  // 'setTerm' is a function that takes a string and returns void
  setCurrentPage: (page: any) => void;  // 'setCurrentPage' is a function that takes a number and returns void
}

const TableTop = ({
  isOpenSortedBy,
  isOpenOrderedBy,
  optionsSortBy,
  optionsOrderedBy,
  term,
  setTerm,
  setCurrentPage,
}: TableTopProps) => {
  return (
    <div className="flex h-[75px] w-full justify-between bg-[#F4F4F4] px-[12px] py-[14px]">
      <div className="relative flex w-full">
        <input
          className="relative h-[47px] w-[460px] rounded-[3px] border-[1.17px] border-[#E7EAEE] bg-[#fff] bg-[center] bg-no-repeat px-5 py-3 pl-10 pt-[14px] text-[15px] outline-none placeholder:text-[#64748B]"
          type="text"
          placeholder="Search by reference no. or name..."
          value={term}
          onChange={(e) => {
            setTerm(e.target.value);
            setCurrentPage(1);
          }}
      
        />
        <Image
          src="/svgs/search.svg"
          alt="Search"
          width="20"
          height="20"
          className="pointer-events-none absolute left-3 top-[50%] flex -translate-y-1/2 transform items-center justify-center"
        />
      </div>
      <div className="flex w-full items-center justify-end gap-[15px]">
        <p className="text-[15px] font-semibold text-[#191D23] opacity-[60%]">
          Order by
        </p>
        <DropdownMenu
          options={optionsOrderedBy.map(({ label, onClick }) => ({
            label,
            onClick: () => {
              onClick(label);
            },
          }))}
          open={isOpenOrderedBy}
          width={"165px"}
          label={"Select"}
        />
        <p className="text-[15px] font-semibold text-[#191D23] opacity-[60%]">
          Sort by
        </p>
        <DropdownMenu
          options={optionsSortBy.map(({ label, onClick }) => ({
            label,
            onClick: () => {
              onClick(label);
              console.log("label", label);
            },
          }))}
          open={isOpenSortedBy}
          width={"165px"}
          label={"Select"}
        />
      </div>
    </div>
  );
};

export default TableTop;
