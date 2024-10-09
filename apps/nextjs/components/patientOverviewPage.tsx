"use client";
import Sidebar from "@/components/Sidebar";
import PatientOverviewComponent from "@/components/patientOverview";
import Footer from "@/components/footer";
import { EditProvider } from "@/app/(routes)/patient-overview/[id]/editContext";
import { useState, ReactNode } from "react";

const PatientOverviewPage = ({ children }: { children: ReactNode }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isOpenHovered, setIsOpenHovered] = useState(false);
  const [isCloseHovered, setIsCloseHovered] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed((prevState) => !prevState);
  };

  const onOpenHoverEnter = () => setIsOpenHovered(true);
  const onOpenHoverLeave = () => setIsOpenHovered(false);
  const onCloseHoverEnter = () => setIsCloseHovered(true);
  const onCloseHoverLeave = () => setIsCloseHovered(false);

  return (
    <div className="relative flex h-full w-full">
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        onCloseHoverEnter={onCloseHoverEnter}
        onCloseHoverLeave={onCloseHoverLeave}
        isCloseHovered={isCloseHovered}
      />
      {/* Close indicator when hovering over the sidebar close button */}
      <div
        className={`absolute left-[19.4%] top-[9.5%] z-50 font-semibold flex items-center justify-center rounded-[5px] bg-[#007C85] px-2 py-1 text-white transition-all duration-100 ${isCloseHovered ? "scale-100" : "scale-0"}`}
      >
        <h1>CLOSE</h1>
      </div>

      <div className="flex h-full w-full flex-col">
        <div
          className={`relative flex-grow h-full w-full overflow-y-auto transition-all duration-300 bg-white ${isCollapsed ? "px-[150px]" : "px-[40px]"}`}
        >
          <EditProvider>
            <PatientOverviewComponent
              isCollapsed={isCollapsed}
              onOpenHoverEnter={onOpenHoverEnter}
              onOpenHoverLeave={onOpenHoverLeave}
              toggleSidebar={toggleSidebar}
              isOpenHovered={isOpenHovered}
            />
            <div className="mt-4 flex w-full flex-grow items-center justify-center">
              {children}
            </div>
          </EditProvider>
        </div>
        {/* Footer should adjust its padding based on the sidebar state */}
        <Footer className={`transition-all duration-300 ${isCollapsed ? "" : "!pr-[25%]"}`} />
      </div>
    </div>
  );
};

export default PatientOverviewPage;
