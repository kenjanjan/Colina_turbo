"use client";
import React, { Suspense, useState } from "react";
import DBDueMedicationLoader from "../loaders/DBDueMedicationLoader";
import DBUpcomingLoader from "../loaders/DBUpcomingLoader";
import DBDueMedication from "./dbDueMedications";
import DBPatientSummary from "./dbPatientSummary";
import DBUpcomingAppointments from "./dbUpcomingAppointments";
import UserDetail from "../userDetails";
import NurseDrawer from "../nurse-drawer";

const DBBody = () => {
  const [totalDueMedication, setTotalDueMedication] = useState(0);
  const [totalDone, setTotalDone] = useState(0);
  return (
    <div className="h-screen px-[154px] py-[90px]">
      <div className="flex w-full items-center justify-between">
        <div className="h-full w-full">
          <p className="p-title mb-1 select-none">WELCOME TO DASHBOARD!</p>
          <div className="mb-4 flex select-none text-[15px] font-bold">
            Hey, <UserDetail /> -
            <p className="sub-title select-none pl-1">
              here's what's happening with your clinic today!
            </p>
          </div>
        </div>
        <NurseDrawer />
      </div>
      <div className="flex h-[95%] w-full gap-5 ">
        <div className="w-4/6 pb-3">
          <DBPatientSummary
            totalDueMedication={totalDueMedication}
            totalDone={totalDone}
          />
        </div>
        <div className="relative flex h-full w-2/6 flex-col gap-3">
          <div className="relative h-1/2 w-full">
            <Suspense fallback={<DBDueMedicationLoader />}>
              <DBDueMedication
                totalDueMedication={totalDueMedication}
                setTotalDueMedication={setTotalDueMedication}
                totalDone={totalDone}
                setTotalDone={setTotalDone}
              />
            </Suspense>
          </div>

          <Suspense fallback={<DBUpcomingLoader />}>
            <div className="relative h-1/2 w-full">
              <DBUpcomingAppointments />
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default DBBody;
