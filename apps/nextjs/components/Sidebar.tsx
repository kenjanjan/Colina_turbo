"use client";
import { cn, formatDate, formatTime } from "@/lib/utils";
import Image from "next/image";
import ResuableTooltip from "./reusable/tooltip";
import { fetchPatientLatestReport } from "@/app/api/patients-api/patientRecentInfo.api";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DateTime } from "luxon";
import {
  SideBarProps,
  RecentMedicationProps,
  LatestVitalSignProps,
  LatestLabResultProps,
  LatestNotesProps,
  PatientInfoProps,
  ActiveMedsProps,
  LatestAdlsProps,
} from "@/lib/interface";

import RecentMedication from "./sidebar/recentMedication";
import RecentPRN from "./sidebar/recentPRN";
import LatestVitalSign from "./sidebar/latestVitalSign";
import LatestLabResult from "./sidebar/latestLabResult";
import ActiveMeds from "./sidebar/activeMeds";
import Notes from "./sidebar/notes";
import Adls from "./sidebar/adls";

const Sidebar = ({
  isCollapsed,
  setIsCollapsed,
  onCloseHoverLeave,
  onCloseHoverEnter,
  isCloseHovered,
}: SideBarProps) => {
  const router = useRouter();
  const params = useParams<{
    id: any;
    tag: string;
    item: string;
  }>();
  const patientId = params.id.toUpperCase();
  const [isLoading, setIsLoading] = useState(true);
  const [recentMedication, setRecentMedication] =
    useState<RecentMedicationProps>({
      medicationlogs_notes: "",
      medicationlogs_medicationLogStatus: "",
      medicationlogs_medicationLogsName: "",
      medicationlogs_medicationLogsDate: "1111-11-11",
      medicationlogs_medicationLogsTime: "00:00",
    });
  const [recentPRN, setRecentPRN] = useState<RecentMedicationProps>({
    medicationlogs_notes: "",
    medicationlogs_medicationLogStatus: "",
    medicationlogs_medicationLogsName: "",
    medicationlogs_medicationLogsDate: "1111-11-11",
    medicationlogs_medicationLogsTime: "00:00",
  });
  const [latestVitalSign, setLatestVitalSign] = useState<LatestVitalSignProps>({
    vitalsign_bloodPressure: "",
    vitalsign_date: "1111-11-11",
    vitalsign_time: "00:00",
    vitalsign_heartRate: "",
    vitalsign_respiratoryRate: "",
    vitalsign_temperature: "",
  });
  const [latestLabResult, setLatestLabResult] = useState<LatestLabResultProps>({
    lab_results_date: "",
    lab_results_fastingBloodGlucose: "",
    lab_results_hdlCholesterol: "",
    lab_results_hemoglobinA1c: "",
    lab_results_ldlCholesterol: "",
    lab_results_totalCholesterol: "",
    lab_results_triglycerides: "",
    lab_results_createdAt: "1111-11-11T00:00:00.000Z",
  });
  const [latestNotes, setLatestNotes] = useState<LatestNotesProps>({
    notes_createdAt: "1111-11-11T00:00:00.000Z",
    notes_notes: "",
    notes_subject: "",
  });
  const [latestIncidentReport, setLatestIncidentReport] =
    useState<LatestNotesProps>({
      notes_createdAt: "1111-11-11T00:00:00.000Z",
      notes_notes: "",
      notes_subject: "",
    });

  const [adl, setLatestAdl] = useState<LatestAdlsProps>({
    adl_date: "",
    adl_time: "",
    adl_adls: "",
    adl_notes: "",
    adl_createdAt: "",
  });

  const [activeMeds, setActiveMeds] = useState<ActiveMedsProps[]>([]); // Corrected initialization

  const [patientInfo, setPatientInfo] = useState<PatientInfoProps>({
    patient_admissionDate: "",
  });
  const toggleSidebar = () => {
    setIsCollapsed((prevState) => !prevState);
  };

  useEffect(() => {
    const fetchData = async () => {
      const latestReport = await fetchPatientLatestReport(patientId, router);
      setRecentMedication(latestReport.data.recentMedication);
      setRecentPRN(latestReport.data.recentPRN);
      setLatestVitalSign(latestReport.data.latestVitalSign);
      setLatestLabResult(latestReport.data.latestLabResult);
      setLatestNotes(latestReport.data.latestNotes);
      setLatestIncidentReport(latestReport.data.latestIncidentReport);
      setLatestAdl(latestReport.data.latestAdls);
      setActiveMeds(latestReport.data.activeMeds);
      setPatientInfo(latestReport.data.data[0]);
      setIsLoading(false);
      console.log(latestReport.data, "latestReport");
    };
    fetchData();
  }, []);

  return (
    <aside
      className={cn(
        "transition-width relative h-screen w-[23%] overflow-hidden bg-[#06393A] pt-[90px] text-white duration-300",
        { "w-0 opacity-0": isCollapsed },
      )}
    >
      <div
        className={`px-5 transition-all ${isCollapsed ? "-translate-x-[200px]" : ""}`}
      >
        <div className="flex justify-between">
          <h1 className="text-[20px] font-semibold">Latest Report</h1>
          <Image
            onClick={toggleSidebar}
            onMouseEnter={onCloseHoverEnter}
            onMouseLeave={onCloseHoverLeave}
            src={`${isCloseHovered ? "/icons/sidebar-close-hover.svg" : "/icons/sidebar-close.svg"}`}
            alt="sidebar-close"
            width={20}
            height={20}
            className={`cursor-pointer text-[20px] text-white ${isCollapsed ? "translate-x-60 rotate-180" : ""} transition-all duration-300`}
          />
        </div>
        <div className="sidebar-divider" />
        <h1 className="flex items-center font-semibold text-[#FCFF9D]">
          Admission Date:{" "}
          {isLoading ? (
            <div className="ml-1 h-[18px] w-[100px] animate-pulse rounded-full bg-[#0a5c5e]"></div>
          ) : patientInfo?.patient_admissionDate ? (
            formatDate(patientInfo.patient_admissionDate)
          ) : (
            "00 / 00 / 00"
          )}
        </h1>

        <RecentMedication
          recentMedication={recentMedication}
          isLoading={isLoading}
        />

        <RecentPRN recentPRN={recentPRN} isLoading={isLoading} />

        <LatestVitalSign
          latestVitalSign={latestVitalSign}
          isLoading={isLoading}
        />

        <LatestLabResult
          latestLabResult={latestLabResult}
          isLoading={isLoading}
        />

        <ActiveMeds activeMeds={activeMeds} isLoading={isLoading} />

        {/* <Notes
          latestNotes={latestNotes}
          latestIncidentReport={latestIncidentReport}
          isLoading={isLoading}
        /> */}

        <Adls recentAdls={adl} isLoading={isLoading} />
      </div>
    </aside>
  );
};

export default Sidebar;
