"use client";

import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  fetchPatientDetails,
  updatePatient,
} from "@/app/api/patients-api/patientDetails.api";
import { fetchCountryList } from "@/app/api/country-api/countryList.api";
import { set } from "date-fns";
import { useEditContext } from "../editContext"; // Assuming you've exported EditContext from your context file
import { tree } from "next/dist/build/templates/app-page";
import EmergencyContacts from "@/components/patient-details/emergencyContacts";
import PatientDetailsComponent from "@/components/patient-details/patientDetailsComponent";
export default function PatientDetails({}) {
  const { toggleEdit, saveClicked, cancelClicked } = useEditContext();
  if (typeof window === "undefined") {
  }

  const [patientDetails, setPatientDetails] = useState<any>([]);
  const [patientEditMode, setPatientEditMode] = useState(false);
  const [emergencyEditMode, setEmergencyEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [countryList, setCountryList] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [isSuccessful, setIsSuccessFul] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const router = useRouter();
  const params = useParams<{
    id: any;
    tag: string;
    item: string;
  }>();

  const patientId = params.id.toUpperCase();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    gender: "",
    age: "",
    dateOfBirth: "",
    phoneNo: "",
    address1: "",
    city: "",
    address2: "",
    state: "",
    country: "",
    zip: "",
    admissionDate: "",
    codeStatus: "",
    email: "",
  });

  useEffect(() => {
    if (patientDetails && patientDetails[0]) {
      setFormData((prevState) => ({
        ...prevState,
        firstName: patientDetails[0]?.firstName || "",
        lastName: patientDetails[0]?.lastName || "",
        middleName: patientDetails[0]?.middleName || "",
        gender: patientDetails[0]?.gender || "",
        age: patientDetails[0]?.age || "",
        dateOfBirth: patientDetails[0]?.dateOfBirth || "",
        phoneNo: patientDetails[0]?.phoneNo || "",
        address1: patientDetails[0]?.address1 || "",
        city: patientDetails[0]?.city || "",
        address2: patientDetails[0]?.address2 || "",
        state: patientDetails[0]?.state || "",
        country: patientDetails[0]?.country || "",
        zip: patientDetails[0]?.zip || "",
        admissionDate: patientDetails[0]?.admissionDate || "",
        codeStatus: patientDetails[0]?.codeStatus || "",
        email: patientDetails[0]?.email || "",
      }));
    }
  }, [patientDetails]);

  const handleGenderChange = (gender: string) => {
    setFormData((prevData) => ({
      ...prevData,
      gender: gender,
    }));
  };

  const handleCodeStatusChange = (codeStatus: string) => {
    setFormData((prevData) => ({
      ...prevData,
      codeStatus: codeStatus,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePatientEditClick = () => {
    // window.history.pushState(null, "", "#edit");
    setPatientEditMode(!patientEditMode);
    toggleEdit();
  };
  const handlePatientCancelClick = () => {
    // window.history.pushState(null, "", "#edit");
    setPatientEditMode(!patientEditMode);
    toggleEdit();
    cancelClicked();
  };

  const handleEmergencyEditClick = () => {
    setEmergencyEditMode(!emergencyEditMode);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsSuccessFul(false);
        const response = await fetchPatientDetails(patientId, router);
        setPatientDetails(response.data);
        setIsLoading(false);
      } catch (error: any) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isSuccessful]);

  const handleCountryChange = (countryId: string) => {
    setFormData((prevData) => ({
      ...prevData,
      country: countryId,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const countries = await fetchCountryList(router);
        setCountryList(countries);
      } catch (error) {
        console.error("Error fetching country list:");
      }
    };

    fetchData();
  }, [patientEditMode]);

  const handleSubmit = async () => {
    setIsSubmitted(true);
    saveClicked();
    try {
      await updatePatient(patientId, formData, router);
      setIsSuccessFul(true);
      setPatientEditMode(false);
      // window.history.pushState(null, "", "#saved");
      setIsSubmitted(false);
      return;
    } catch (error) {
      console.error("Error adding allergy:", error);
      setError("Failed to add allergy");
    }
    setIsSubmitted(false);
  };

  if (isLoading) {
    return (
      <div className="container flex h-full w-full items-center justify-center">
        <Image
          src="/imgs/colina-logo-animation.gif"
          alt="logo"
          width={100}
          height={100}
        />
      </div>
    );
  }

  console.log(patientDetails, "patientDetails");
  console.log(formData, "formData");
  return (
    <div className="w-full h-full flex flex-col gap-5 mt-2 pb-16">
      <PatientDetailsComponent patientId={patientId} />
      <EmergencyContacts patientId={patientId} />
    </div>
  );
}
