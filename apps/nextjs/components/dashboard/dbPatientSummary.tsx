"use client";
import React, { useEffect, useRef, useState } from "react";
import DBPatientSelect from "./dbPatientSelect";
import DoughnutChart from "../DoughnutChart";
import { useRouter } from "next/navigation";
import { fetchPatientRecentInfo } from "@/app/api/patients-api/patientRecentInfo.api";
import ResuableTooltip from "../reusable/tooltip";
import { formatDate, formatTime } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import RecentMedication from "./recentMedication";
import RecentPRN from "./recentPRN";
import SeeAll from "../reusable/seeAll";
interface DBPatientSummaryProps {
  totalDueMedication: number;
  totalDone: number;
}

const DBPatientSummary = ({
  totalDueMedication,
  totalDone,
}: DBPatientSummaryProps) => {
  const router = useRouter();
  const [patientId, setPatientId] = React.useState("");
  const [halfWidth, setHalfWidth] = useState(0);
  const parentRef = useRef<HTMLDivElement>(null);
  const [patientRecentInfo, setPatientRecentInfo] = useState<any>();
  const [recentMedication, setRecentMedication] = useState<any>();
  const [recentPRN, setRecentPRN] = useState<any>();
  const [isMedicationCollapsed, setIsMedicationCollapsed] = useState(false);
  const [isPRNCollapsed, setIsPRNCollapsed] = useState(false);

  const toggleMedicationCollapse = () => {
    setIsMedicationCollapsed((prevState) => !prevState);
  };

  const togglePRNCollapse = () => {
    setIsPRNCollapsed((prevState) => !prevState);
  };

  const pri = patientRecentInfo!;
  const totalPatientDue = pri === undefined ? 0 : pri?.totalMedicationDue;
  const totalPatientDone = pri === undefined ? 0 : pri?.totalMedicationDone;

  console.log("totalPatientDue", totalPatientDue);
  console.log(recentPRN, "recentPRN");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchPatientRecentInfo(patientId, router);
        setPatientRecentInfo(response.data);
        setRecentMedication(response.data.recentMedication);
        setRecentPRN(response.data.recentPRN);
      } catch (error: any) {
        console.log(error);
      }
    };

    fetchData();
  }, [patientId]);
  useEffect(() => {
    if (parentRef.current) {
      const parentWidth = parentRef.current.offsetWidth;
      setHalfWidth(parentWidth / 2);
    }
  }, []);

  const severityOrder: { [key: string]: number } = {
    Severe: 1,
    Moderate: 2,
    Mild: 3,
  };

  const sortedPatientAllergies = pri?.patientAllergies
    ?.slice()
    .sort((a: any, b: any) => {
      const severityA = severityOrder[a.allergies_severity] || 4;
      const severityB = severityOrder[b.allergies_severity] || 4;
      return severityA - severityB;
    });

  return (
    <div
      className="flex h-full w-full flex-col justify-between gap-3"
      ref={parentRef}
    >
      <div className="flex h-[50px] w-1/2 pr-[6px]">
        <DBPatientSelect
          patientId={patientId}
          setPatientId={setPatientId}
          width={halfWidth}
        />
      </div>

      <div className="h-full w-full">
        <div className="grid h-4/6 w-full grid-cols-2 grid-rows-2 gap-4">
          <div className="relative h-full overflow-hidden rounded-[5px] bg-[#FAFAFA]">
            <div className="bg-[#F4E394] p-6" />
            <div className="relative h-full w-full px-5 py-3">
              <div className="flex h-full w-full flex-col gap-0.5">
                <h1 className="font-medium">Patient Details</h1>
                {pri == undefined ? (
                  <div className="sub-title absolute inset-0 -mt-5 flex h-full w-full items-center justify-center">
                    no data yet
                  </div>
                ) : (
                  <div className="sub-title flex flex-col gap-0.5">
                    <div className="grid w-full grid-cols-3">
                      <div className="col-span-1 grid">Name: </div>
                      <div className="col-span-2 grid">
                        <div className="flex">
                          <div className="max-w-[57.5%] truncate">
                            <ResuableTooltip
                              text={`${pri?.data[0]?.patient_firstName}${" "}
                            ${pri?.data[0]?.patient_middleName}${" "}
                          ${pri?.data[0]?.patient_lastName} ${" "}`}
                            />{" "}
                          </div>
                          <div className="w-3/6">
                            {" "}
                            <span className="ml-1"> - </span>
                            {pri?.data[0]?.patient_age}{" "}
                            {pri?.data[0]?.patient_gender}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3">
                      <div className="col-span-1 grid">Date of Birth: </div>
                      <div className="col-span-2 grid">
                        {formatDate(pri?.data[0]?.patient_dateOfBirth)}
                      </div>
                    </div>
                    <div className="grid grid-cols-3">
                      <div className="col-span-1 grid">Address: </div>
                      <div className="col-span-2 grid">
                        <div className="w-full truncate">
                          <ResuableTooltip
                            text={`${pri?.data[0]?.patient_address1}`}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3">
                      <div className="col-span-1 grid">Phone Number:</div>
                      <div className="col-span-2 grid">
                        {pri?.data[0]?.patient_phoneNo}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <SeeAll
              url={
                patientId
                  ? `/patient-overview/${patientId}/patient-details`
                  : ""
              }
              className={`right-[18px] ${pri === undefined ? "hidden" : ""}`}
            />
          </div>
          <div className="relative overflow-hidden rounded-[5px] bg-[#FAFAFA]">
            <div className="bg-[#F3BB93] p-6" />
            <div className="px-5 py-3">
              <h1 className="mb-[2px] flex items-center justify-between font-medium">
                Vital Signs{" "}
                <p className="sub-title">
                  {pri?.data[0]?.vsdate === null ||
                  pri?.data[0]?.vsdate === undefined ||
                  pri?.data[0]?.vsdate === "No Date" ? (
                    <></>
                  ) : (
                    <>
                      {formatDate(pri?.data[0]?.vsdate)} {pri ? "-" : ""}{" "}
                      {formatTime(pri?.data[0]?.vstime)}
                    </>
                  )}
                </p>
              </h1>

              {pri === undefined ? (
                <div className="sub-title absolute top-[50%] mt-5 flex h-full w-full justify-center">
                  no data yet
                </div>
              ) : (
                <div className="sub-title grid grid-cols-3 gap-0.5">
                  <div className="col-span-1">Blood Pressure:</div>
                  <div className="col-span-2">
                    {pri?.data[0]?.bloodPressure}
                    {pri?.data[0]?.bloodPressure == "No Blood Pressure"
                      ? ""
                      : "mmHg"}
                  </div>
                  <div className="col-span-1">Heart Rate:</div>
                  <div className="col-span-2">
                    {pri?.data[0]?.heartRate}{" "}
                    {pri?.data[0]?.heartRate == "No Heart Rate" ? "" : "bpm"}
                  </div>
                  <div className="col-span-1">Temperature:</div>
                  <div className="col-span-2">
                    {pri?.data[0]?.temperature}
                    {pri?.data[0]?.temperature == "No Temperature" ? "" : "°F"}
                  </div>
                  <div className="col-span-1">Respiratory:</div>
                  <div className="col-span-2">
                    {pri?.data[0]?.respiratoryRate}{" "}
                    {pri?.data[0]?.respiratoryRate == "No Respiratory Rate"
                      ? ""
                      : "breaths per minute"}
                  </div>
                </div>
              )}
            </div>
            <SeeAll
              url={patientId ? `patient-overview/${patientId}/vital-signs` : ""}
              className={`right-[18px] ${pri === undefined ? "hidden" : ""}`}
            />
          </div>
          <div className="relative overflow-hidden rounded-[5px] bg-[#FAFAFA]">
            <div className="bg-[#93F3B9] p-6" />
            <div className="px-5 py-3">
              <div className="absolute right-[50%] z-[4] h-[68%] w-[1px] bg-[#DDDDDD]"></div>

              <RecentMedication
                recentMedication={recentMedication}
                isMedicationCollapsed={isMedicationCollapsed}
                isPRNCollapsed={isPRNCollapsed}
                toggleMedicationCollapse={toggleMedicationCollapse}
                patientId={patientId}
              />

              <RecentPRN
                recentPRN={recentPRN}
                isMedicationCollapsed={isMedicationCollapsed}
                isPRNCollapsed={isPRNCollapsed}
                togglePRNCollapse={togglePRNCollapse}
              />
              <SeeAll
                url={
                  patientId
                    ? `patient-overview/${patientId}/medication/prorenata`
                    : ""
                }
                className={`right-[18px] transition-all duration-300 ${isMedicationCollapsed ? "translate-x-[200%]" : "" } ${recentPRN === undefined ? "hidden" : ""}`}
              />
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[5px] bg-[#FAFAFA]">
            <div className="bg-[#93F3DC] p-6" />

            <div
              className={`absolute right-[50%] z-[45] mt-4 h-[68%] w-[1px] bg-[#DDDDDD] ${pri?.patientAllergies.length > 4 ? "" : "hidden"}`}
            ></div>
            <div className="px-5 py-3">
              <div>
                <h1 className="font-medium">Allergies</h1>
              </div>

              {pri === undefined ||
              sortedPatientAllergies[0].allergens === null ? (
                <div className="sub-title absolute left-[46%] top-[50%] mt-5">
                  no data yet
                </div>
              ) : (
                <div className="grid grid-flow-col grid-cols-2 grid-rows-4 gap-0.5">
                  {sortedPatientAllergies.map(
                    (allergen: any, index: number) => (
                      <div className="col-span-1 grid grid-cols-3" key={index}>
                        <div
                          className={`sub-title col-span-2 truncate pr-5 ${index > 3 ? "pl-2" : ""}`}
                        >
                          <ResuableTooltip text={allergen.allergens} />
                        </div>
                        <div className="col-span-1">
                          <p
                            className={`${allergen.allergies_severity === "Severe" ? "text-[#EF4C6A]" : allergen.allergies_severity === "Moderate" ? "text-[#FF8522]" : "text-[#F6C000]"}`}
                          >
                            {allergen.allergies_severity}
                          </p>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              )}
            </div>
            <SeeAll
              url={
                patientId
                  ? `/patient-overview/${patientId}/medical-history/allergies`
                  : ""
              }
              className={`right-[18px] ${pri === undefined ? "hidden" : ""}`}
            />
          </div>
        </div>
        <div className="relative mt-4 h-2/6 w-full overflow-hidden rounded-[5px] bg-[#FAFAFA]">
          <div className="bg-[#93D0F3] p-6" />
          <div className="relative grid grid-cols-2">
            <div className="relative px-5">
              <h1 className="absolute w-full truncate pt-2 text-[15px] font-medium">
                {pri === undefined
                  ? "[Patient Name]"
                  : pri?.data[0]?.patient_firstName }{" "}
               - Due Medication
              </h1>
              <div className="flex h-full w-full items-center justify-center">
                <DoughnutChart
                  total={totalPatientDue}
                  totalDone={totalPatientDone}
                />
              </div>
            </div>
            <div className="relative px-5">
              <h1 className="absolute pt-2 text-[15px] font-medium">
                Total Due Medication of All Patients
              </h1>
              <div className="flex h-full w-full items-center justify-center">
                <DoughnutChart
                  total={totalDueMedication}
                  totalDone={totalDone}
                />
              </div>
            </div>
            <div
              className={`absolute right-[50%] z-[45] mt-4 h-[90%] w-[1px] bg-[#DDDDDD]`}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DBPatientSummary;
