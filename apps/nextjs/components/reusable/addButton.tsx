"use client";
import React from "react";
import Image from "next/image";

const AddButton = ({ isModalOpen }: any) => {
  return (
    <>
      <button onClick={() => isModalOpen(true)} className="rounded-[5px] bg-[#1B84FF] w-[100px] h-[52px] text-white gap-2 flex justify-center items-center font-semibold hover:bg-[#2267b9]">
        <Image src="/imgs/add.svg" alt="" width={18} height={18} />
        <p className="">Add</p>
      </button>
    </>
  );
};

export default AddButton;
