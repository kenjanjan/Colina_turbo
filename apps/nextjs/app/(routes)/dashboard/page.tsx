import React, { Suspense, useEffect, useState } from "react";
import NurseDrawer from "@/components/nurse-drawer";
import { SuccessModal } from "@/components/shared/success";
import DBDueMedication from "@/components/dashboard/dbDueMedications";
import DBUpcomingAppointments from "@/components/dashboard/dbUpcomingAppointments";
import DBDueMedicationLoader from "@/components/loaders/DBDueMedicationLoader";
import DBUpcomingLoader from "@/components/loaders/DBUpcomingLoader";
import UserDetail from "@/components/userDetails";
import DBUserDetailLoader from "@/components/loaders/DBUserDetailLoader";
import DBPatientSummary from "@/components/dashboard/dbPatientSummary";
import DBBody from "@/components/dashboard/dbBody";

const Dashboard = () => {
  return (
    <div className="relative h-screen w-full ">
      <DBBody />
    </div>
  );
};

export default Dashboard;
