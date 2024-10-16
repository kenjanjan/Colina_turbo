"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "./ui/use-toast";
import { ToastAction } from "./ui/toast";
import DownloadPDF from "./shared/buttons/downloadpdf";
import { fetchDueMedication } from "@/app/api/medication-logs-api/due-medication-api";
import { useRouter } from "next/navigation";
import {
  downloadPdf,
  formatCreatedAtDate,
  formatCreatedAtTime,
  formatDate,
  formatTime,
} from "@/lib/utils";
import { searchPatientList } from "@/app/api/patients-api/patientList.api";
import { fetchAllAppointments } from "@/app/api/appointments-api/fetch-all-appointments.api";
import { fetchScheduledMedByPatient } from "@/app/api/medication-logs-api/scheduled-med-api";
import { fetchPRNMedByPatient } from "@/app/api/medication-logs-api/prn-med-api";
import { fetchNotesByPatient } from "@/app/api/notes-api/notes-api";
import { DateTime } from "luxon";
import { fetchVitalSignsByPatient } from "@/app/api/vital-sign-api/vital-sign-api";
import { fetchLabResultsByPatient } from "@/app/api/lab-results-api/lab-results.api";
import { fetchAllergiesByPatient } from "@/app/api/medical-history-api/allergies.api";
import { fetchSurgeriesByPatient } from "@/app/api/medical-history-api/surgeries.api";
import { fetchPrescriptionByPatient } from "@/app/api/prescription-api/prescription.api";
import { fetchFormsByPatient } from "@/app/api/forms-api/forms.api";
import { fetchAppointmentsByPatient } from "@/app/api/appointments-api/appointments.api";
import { fetchVaccinationsByPatient } from "@/app/api/vaccinations-api/vaccinations.api";
import { fetchAdlsByPatient } from "@/app/api/adls-api/adls-api";
import { string } from "zod";

const PdfDownloader = ({ props, variant, patientId }: any) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("ASC");
  const [filterStatusFromCheck, setFilterStatusFromCheck] = useState<string[]>(
    [],
  );
  const [filterTypeFromCheck, setFilterTypeFromCheck] = useState<string[]>([]);

  const handleDownloadPDF = async () => {
    setIsLoading(true);
    if (variant === "Due Medication Table") {
      try {
        const dueMedicationList = await fetchDueMedication(
          "",
          1,
          "medicationlogs.medicationLogsTime",
          sortOrder as "ASC" | "DESC",
          0,
          router,
        );

        if (dueMedicationList.data.length === 0) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "Due Med is empty",
            action: (
              <ToastAction
                altText="Try again"
                onClick={() => {
                  window.location.reload();
                }}
              >
                Try again
              </ToastAction>
            ),
          });
          setIsLoading(false);
        } else {
          let jsonFile: {
            Name: string;
            Uuid: string;
            Medication: string;
            Date: string;
            Time: string;
          }[] = dueMedicationList.data.map((d: any) => ({
            Name: d.patient_firstName + " " + d.patient_lastName,
            Uuid: d.medicationlogs_uuid,
            Medication: d.medicationlogs_medicationLogsName,
            Date: d.medicationlogs_medicationLogsDate,
            Time: d.medicationlogs_medicationLogsTime,
          }));

          downloadPdf(jsonFile, props, variant);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching due medications:", error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Failed to fetch due medications",
        });
        setIsLoading(false);
      }
    }
    if (variant === "Patient List Table") {
      try {
        const patientList = await searchPatientList(
          "",
          1,
          "firstName",
          sortOrder as "ASC" | "DESC",
          0,
          router,
        );

        console.log(patientList, "patientList");
        if (patientList.data.length === 0) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "Patient List is empty",
            action: (
              <ToastAction
                altText="Try again"
                onClick={() => {
                  window.location.reload();
                }}
              >
                Try again
              </ToastAction>
            ),
          });
          setIsLoading(false);
        } else {
          let jsonFile: {
            Uuid: string;
            Name: string;
            Age: string;
            Gender: string;
          }[] = patientList.data.map((d: any) => ({
            Uuid: d.uuid,
            Name: d.firstName + " " + d.lastName,
            Age: d.age,
            Gender: d.gender,
          }));

          downloadPdf(jsonFile, props, variant);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching due medications:", error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Failed to fetch due medications",
        });
        setIsLoading(false);
      }
    }
    if (variant === "Appointment List Table") {
      try {
        const startD = "2021-01-01";
        const endD = "2300-01-01";
        const appointmentList = await fetchAllAppointments(
          "",
          1,
          "time",
          sortOrder as "ASC" | "DESC",
          ["Scheduled"],
          startD,
          endD,
          0,
          router,
        );

        console.log(appointmentList, "appointmentList");
        if (appointmentList.data.length === 0) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "Appointment List is empty",
            action: (
              <ToastAction
                altText="Try again"
                onClick={() => {
                  window.location.reload();
                }}
              >
                Try again
              </ToastAction>
            ),
          });
          setIsLoading(false);
        } else {
          let jsonFile: {
            Name: string;
            Uuid: string;
            Date: string;
            Start_Time: any;
            End_Time: any;
            Status: string;
          }[] = appointmentList.data.map((d: any) => ({
            Name: d.patient_firstName + " " + d.patient_lastName,
            Uuid: d.appointments_uuid,
            Date: d.appointments_appointmentDate,
            Start_Time: d.appointments_appointmentTime,
            End_Time: d.appointments_appointmentEndTime,
            Status: d.appointments_appointmentStatus,
          }));

          downloadPdf(jsonFile, props, variant);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching appointmentlist:", error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Failed to fetch appointment list",
        });
        setIsLoading(false);
      }
    }
    if (variant === "Scheduled Medication Table") {
      try {
        const marList = await fetchScheduledMedByPatient(
          patientId,
          "",
          1,
          "medicationLogsDate",
          sortOrder as "ASC" | "DESC",
          filterStatusFromCheck,
          0,
          router,
        );

        console.log(marList, "marList");
        if (marList.data.length === 0) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "Scheduled List is empty",
            action: (
              <ToastAction
                altText="Try again"
                onClick={() => {
                  window.location.reload();
                }}
              >
                Try again
              </ToastAction>
            ),
          });
          setIsLoading(false);
        } else {
          let jsonFile: {
            Uuid: string;
            Date: string;
            Time: string;
            Medication: string;
            Notes: string;
            Status: string;
          }[] = marList.data.map((d: any) => ({
            Uuid: d.medicationlogs_uuid,
            Date: d.medicationlogs_medicationLogsDate,
            Time: d.medicationlogs_medicationLogsTime,
            Medication: d.medicationlogs_medicationLogsName,
            Notes: d.medicationlogs_notes,
            Status: d.medicationlogs_medicationLogStatus,
          }));

          downloadPdf(jsonFile, props, variant);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching scheduled list:", error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Failed to fetch scheduled list",
        });
        setIsLoading(false);
      }
    }
    if (variant === "PRN Medication Table") {
      try {
        const marList = await fetchPRNMedByPatient(
          patientId,
          "",
          1,
          "medicationLogsDate",
          sortOrder as "ASC" | "DESC",
          0,
          router,
        );

        console.log(marList, "marList");
        if (marList.data.length === 0) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "PRN List is empty",
            action: (
              <ToastAction
                altText="Try again"
                onClick={() => {
                  window.location.reload();
                }}
              >
                Try again
              </ToastAction>
            ),
          });
          setIsLoading(false);
        } else {
          let jsonFile: {
            Uuid: string;
            Date: string;
            Time: string;
            Medication: string;
            Notes: string;
            Status: string;
          }[] = marList.data.map((d: any) => ({
            Uuid: d.medicationlogs_uuid,
            Date: d.medicationlogs_medicationLogsDate,
            Time: d.medicationlogs_medicationLogsTime,
            Medication: d.medicationlogs_medicationLogsName,
            Notes: d.medicationlogs_notes,
            Status: d.medicationlogs_medicationLogStatus,
          }));

          downloadPdf(jsonFile, props, variant);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching PRN list:", error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Failed to fetch PRN list",
        });
        setIsLoading(false);
      }
    }
    if (
      variant === "Nurse's Note Table" ||
      variant === "Incident Report Table"
    ) {
      try {
        const type = variant === "Nurse's Note Table" ? "nn" : "ir";
        const notes = await fetchNotesByPatient(
          patientId,
          "",
          type,
          1,
          "createdAt",
          "DESC",
          0,
          router,
        );

        console.log(notes, "notes");
        if (notes.data.length === 0) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "notes is empty",
            action: (
              <ToastAction
                altText="Try again"
                onClick={() => {
                  window.location.reload();
                }}
              >
                Try again
              </ToastAction>
            ),
          });
          setIsLoading(false);
        } else {
          let jsonFile: {
            Uuid: string;
            Date: string;
            Time: string;
            Subject: string;
            Notes: string;
          }[] = notes.data.map((d: any) => ({
            Uuid: d.notes_uuid,
            Date: formatCreatedAtDate(d.notes_createdAt),
            Time: formatCreatedAtTime(d.notes_createdAt),
            Subject: d.notes_subject,
            Notes: d.notes_notes,
          }));

          downloadPdf(jsonFile, props, variant);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching notes list:", error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Failed to fetch notes list",
        });
        setIsLoading(false);
      }
    }
    if (variant === "Vital Sign Table") {
      try {
        const vitalSignList = await fetchVitalSignsByPatient(
          patientId,
          "",
          1,
          "date",
          "DESC",
          0,
          router,
        );

        console.log(vitalSignList, "vitalSignList");
        if (vitalSignList.data.length === 0) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "vitalSignList is empty",
            action: (
              <ToastAction
                altText="Try again"
                onClick={() => {
                  window.location.reload();
                }}
              >
                Try again
              </ToastAction>
            ),
          });
          setIsLoading(false);
        } else {
          let jsonFile: {
            Uuid: string;
            Date: string;
            Time: string;
            BP: string;
            HR: string;
            Temp: string;
            Resp: string;
          }[] = vitalSignList.data.map((d: any) => ({
            Uuid: d.vitalsign_uuid,
            Date: formatDate(d.vitalsign_date),
            Time: formatTime(d.vitalsign_time),
            BP: d.vitalsign_bloodPressure + "mmHg",
            HR: d.vitalsign_heartRate + "bpm",
            Temp: d.vitalsign_temperature + "°F",
            Resp: d.vitalsign_respiratoryRate + "breaths/min",
          }));

          downloadPdf(jsonFile, props, variant);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching vitalSignListt:", error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Failed to fetch vitalSignList",
        });
        setIsLoading(false);
      }
    }
    if (variant === "Laboratory Result Table") {
      try {
        const laboratoryList = await fetchLabResultsByPatient(
          patientId,
          "",
          1,
          "date",
          "DESC",
          0,
          router,
        );

        console.log(laboratoryList, "laboratoryList");
        if (laboratoryList.data.length === 0) {
          //["Uuid", "Date", "HEMO_A1c", "FBG", "TC", "LDL-C", "HDL-C", "TG"]
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "laboratoryList is empty",
            action: (
              <ToastAction
                altText="Try again"
                onClick={() => {
                  window.location.reload();
                }}
              >
                Try again
              </ToastAction>
            ),
          });
          setIsLoading(false);
        } else {
          let jsonFile: {
            Uuid: string;
            Date: string;
            HEMO_A1c: string;
            FBG: string;
            TC: string;
            LDL_C: string;
            HDL_C: string;
            TG: string;
          }[] = laboratoryList.data.map((d: any) => ({
            Uuid: d.labResults_uuid,
            Date: formatDate(d.labResults_date),
            HEMO_A1c: d.labResults_hemoglobinA1c + "%",
            FBG: d.labResults_fastingBloodGlucose + "mg/dl",
            TC: d.labResults_totalCholesterol + "mg/dl",
            LDL_C: d.labResults_ldlCholesterol + "mg/dl",
            HDL_C: d.labResults_hdlCholesterol + "mg/dl",
            TG: d.labResults_triglycerides + "mg/dl",
          }));

          downloadPdf(jsonFile, props, variant);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching laboratoryList:", error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Failed to fetch laboratoryList",
        });
        setIsLoading(false);
      }
    }
    if (variant === "Allergy Table") {
      try {
        const allergyList = await fetchAllergiesByPatient(
          patientId,
          "",
          1,
          "createdAt",
          "DESC",
          filterStatusFromCheck,
          0,
          router,
        );

        console.log(allergyList, "allergyList");
        if (allergyList.data.length === 0) {
          //["Uuid", "Date", "HEMO_A1c", "FBG", "TC", "LDL-C", "HDL-C", "TG"]
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "allergyList is empty",
            action: (
              <ToastAction
                altText="Try again"
                onClick={() => {
                  window.location.reload();
                }}
              >
                Try again
              </ToastAction>
            ),
          });
          setIsLoading(false);
        } else {
          let jsonFile: {
            // "Uuid","Date","Type","Allergen","Severity","Reaction","Notes",
            Uuid: string;
            Date: string;
            Type: string;
            Allergen: string;
            Severity: string;
            Reaction: string;
            Notes: string;
          }[] = allergyList.data.map((d: any) => ({
            Uuid: d.allergies_uuid,
            Date: formatCreatedAtDate(d.allergies_createdAt),
            Type: d.allergies_allergen,
            Allergen: d.allergies_allergen,
            Severity: d.allergies_severity,
            Reaction: d.allergies_reaction,
            Notes: d.allergies_notes,
          }));

          downloadPdf(jsonFile, props, variant);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching allergyList:", error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Failed to fetch allergyList",
        });
        setIsLoading(false);
      }
    }
    if (variant === "Surgery Table") {
      try {
        const surgeryList = await fetchSurgeriesByPatient(
          patientId,
          "",
          1,
          "dateOfSurgery",
          "DESC",
          0,
          router,
        );

        console.log(surgeryList, "surgeryList");
        if (surgeryList.data.length === 0) {
          //["Uuid", "Date", "HEMO_A1c", "FBG", "TC", "LDL-C", "HDL-C", "TG"]
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "surgeryList is empty",
            action: (
              <ToastAction
                altText="Try again"
                onClick={() => {
                  window.location.reload();
                }}
              >
                Try again
              </ToastAction>
            ),
          });
          setIsLoading(false);
        } else {
          let jsonFile: {
            //"Uuid", "Date_of_surgery", "Type", "Surgery", "Notes"
            Uuid: string;
            Date_of_surgery: string;
            Type: string;
            Surgery: string;
            Notes: string;
          }[] = surgeryList.data.map((d: any) => ({
            Uuid: d.surgeries_uuid,
            Date_of_surgery: formatDate(d.surgeries_dateOfSurgery),
            Type: d.surgeries_typeOfSurgery,
            Surgery: d.surgeries_surgery,
            Notes: d.surgeries_notes,
          }));

          downloadPdf(jsonFile, props, variant);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching surgeryList:", error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Failed to fetch surgeryList",
        });
        setIsLoading(false);
      }
    }
    if (variant === "Prescription Table") {
      try {
        const prescriptionList = await fetchPrescriptionByPatient(
          patientId,
          "",
          1,
          "name",
          "DESC",
          0,
          filterStatusFromCheck,
          router,
        );

        console.log(prescriptionList, "prescriptionList");
        if (prescriptionList.data.length === 0) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "prescriptionList is empty",
            action: (
              <ToastAction
                altText="Try again"
                onClick={() => {
                  window.location.reload();
                }}
              >
                Try again
              </ToastAction>
            ),
          });
          setIsLoading(false);
        } else {
          let jsonFile: {
            //"Uuid", "Medicine_name", "Frequency", "Interval", "Dosage", "Status"
            Uuid: string;
            Medicine_name: string;
            Frequency: string;
            Interval: string;
            Dosage: string;
            Status: string;
          }[] = prescriptionList.data.map((d: any) => ({
            Uuid: d.prescriptions_uuid,
            Medicine_name: d.prescriptions_name,
            Frequency: d.prescriptions_frequency,
            Interval: d.prescriptions_interval + "hrs",
            Dosage: d.prescriptions_dosage,
            Status: d.prescriptions_status,
          }));

          downloadPdf(jsonFile, props, variant);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching prescriptionList:", error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Failed to fetch prescriptionList",
        });
        setIsLoading(false);
      }
    }
   
    if (variant === "Forms Table" || variant === "Archived Forms Table") {
      try {
        const formsList = await fetchFormsByPatient(
          patientId,
          "",
          1,
          "dateIssued",
          "DESC",
          variant === "Forms Table" ? false : true,
          0,
          router,
        );

        console.log(formsList, "formsList");
        if (formsList.data.length === 0) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "formsList is empty",
            action: (
              <ToastAction
                altText="Try again"
                onClick={() => {
                  window.location.reload();
                }}
              >
                Try again
              </ToastAction>
            ),
          });
          setIsLoading(false);
        } else {
          let jsonFile: {
            Uuid: string;
            Name_of_document: string;
            Date_issued: string;
            Notes: string;
          }[] = formsList.data.map((d: any) => ({
            Uuid: d.forms_uuid,
            Name_of_document: d.forms_nameOfDocument,
            Date_issued: d.forms_dateIssued,
            Notes: d.forms_notes,
          }));

          downloadPdf(jsonFile, props, variant);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching formsList:", error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Failed to fetch formsList",
        });
        setIsLoading(false);
      }
    }
    if (variant === "Vaccinations Form Table") {
      try {
        const vaccinationList = await fetchVaccinationsByPatient(
          patientId,
          "",
          1,
          "dateIssued",
          "DESC",
          0,
          router,
        );

        console.log(vaccinationList, "vaccinationList");
        if (vaccinationList.data.length === 0) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "vaccinationList is empty",
            action: (
              <ToastAction
                altText="Try again"
                onClick={() => {
                  window.location.reload();
                }}
              >
                Try again
              </ToastAction>
            ),
          });
          setIsLoading(false);
        } else {
          let jsonFile: {
            Uuid: string;
            Date: string;
            Vaccinator_Name: string;
            Dosage_seq: string;
            Vacc_Manufacturer: string;
            Health_Facility: string;
          }[] = vaccinationList.data.map((d: any) => ({
            Uuid: d.vaccination_uuid,
            Date: d.vaccination_dateIssued,
            Vaccinator_Name: d.vaccination_vaccinatorName,
            Dosage_seq: d.vaccination_dosageSequence,
            Vacc_Manufacturer: d.vaccination_vaccineManufacturer,
            Health_Facility: d.vaccination_healthFacility,
          }));

          downloadPdf(jsonFile, props, variant);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching formsList:", error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Failed to fetch formsList",
        });
        setIsLoading(false);
      }
    }
    if (variant === "Appointment Table") {
      try {
        const appointmentList = await fetchAppointmentsByPatient(
          patientId,
          "",
          1,
          "appointmentDate",
          "DESC",
          filterStatusFromCheck,
          filterTypeFromCheck,
          0,
          router,
        );

        console.log(appointmentList, "appointmentList");
        if (appointmentList.data.length === 0) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "appointmentList is empty",
            action: (
              <ToastAction
                altText="Try again"
                onClick={() => {
                  window.location.reload();
                }}
              >
                Try again
              </ToastAction>
            ),
          });
          setIsLoading(false);
        } else {
          let jsonFile: {
            Uuid: string;
            Date: string;
            Time: string;
            End_time: string;
            Details: string;
            Status: string;
          }[] = appointmentList.data.map((d: any) => ({
            Uuid: d.appointments_uuid,
            Date: d.appointments_appointmentDate,
            Time: d.appointments_appointmentTime,
            End_time: d.appointments_appointmentEndTime,
            Details: d.appointments_details,
            Status: d.appointments_appointmentStatus,
          }));

          downloadPdf(jsonFile, props, variant);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching appointmentList:", error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Failed to fetch appointmentList",
        });
        setIsLoading(false);
      }
    }
    // adl
    if (variant === "ADL Table") {
      try {
        const adlsList = await fetchAdlsByPatient(
          patientId,
          "",
          1,
          "createdAt",
          "DESC",
          0,
          router,
        );

        console.log(adlsList, "adlsList");
        if (adlsList.data.length === 0) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "adlsList is empty",
            action: (
              <ToastAction
                altText="Try again"
                onClick={() => {
                  window.location.reload();
                }}
              >
                Try again
              </ToastAction>
            ),
          });
          setIsLoading(false);
        } else {
          let jsonFile: {
            Uuid: string;
            ADLs: string;
            Date: string;

            Notes: string;
          }[] = adlsList.data.map((d: any) => ({
            Uuid: d.adl_uuid,
            ADLs: d.adl_adl,
            Date: formatCreatedAtDate(d.adl_createdAt),
            Notes: d.adl_notes,
          }));

          downloadPdf(jsonFile, props, variant);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching adlsList:", error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Failed to fetch adlsList",
        });
        setIsLoading(false);
      }
    }
    //
  };

  return (
    <div onClick={handleDownloadPDF}>
      <DownloadPDF isLoading={isLoading} />
    </div>
  );
};

export default PdfDownloader;
