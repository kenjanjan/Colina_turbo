import React from "react";

const NotesLoader = () => {
  return (
    <>
      <div>
        <h1 className="mb-1 font-semibold text-[#4FF4FF] flex">Nurse's Note <div className="h-[18px] w-[120px] bg-[#0c6d6f] rounded-full animate-pulse ml-1"/></h1>
        <div className="grid grid-cols-[0.5fr_1fr]">
          <div>Subject:</div>
          <div className="h-[18px] w-[80px] bg-[#0d7f81] rounded-full animate-pulse ml-1"/>
        </div>
        <div className="grid grid-cols-[0.5fr_1fr]">
          <div>Notes:</div>
          <div className="h-[18px] w-[150px] bg-[#0a5c5e] rounded-full animate-pulse ml-1"/>
        </div>
      </div>
      <div className="sidebar-divider" />
      <div>
        <h1 className="mb-1 font-semibold text-[#4FF4FF] flex">Incident Report <div className="h-[18px] w-[130px] bg-[#0c6d6f] rounded-full animate-pulse ml-1"/></h1>
        <div className="grid grid-cols-[0.5fr_1fr]">
          <div>Subject:</div>
          <div className="h-[18px] w-[140px] bg-[#0d7f81] rounded-full animate-pulse ml-1"/>
        </div>
        <div className="grid grid-cols-[0.5fr_1fr]">
          <div>Details:</div>
          <div className="h-[18px] w-[100px] bg-[#0a5c5e] rounded-full animate-pulse ml-1"/>
        </div>
      </div>
    </>
  );
};

export default NotesLoader;
