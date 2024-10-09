import { z } from "zod";
import { cn, formatDate } from "@/lib/utils";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useParams, useRouter } from "next/navigation";
import { fetchCountryList } from "@/app/api/country-api/countryList.api";
import {
  fetchPatientDetails,
  updatePatient,
} from "@/app/api/patients-api/patientDetails.api";
import { PatientDetailsProps } from "@/lib/interface";
import patientDetailsSchema from "@/lib/schema/patientDetailsSchema";
import { toast } from "../ui/use-toast";
import { ToastAction } from "../ui/toast";
import { DateTime } from "luxon";
import { LucideLoader2 } from "lucide-react";
import { SuccessModal } from "../shared/success";
import { ErrorModal } from "../shared/error";
import { useEditContext } from "@/app/(routes)/patient-overview/[id]/editContext";

const PatientDetailsComponent: React.FC<any> = ({ patientId }) => {
  const { isEdit, isSave,saveClicked, disableEdit } = useEditContext();
  const [isDisabled, setIsDisabled] = useState(true);
  const [admissionDate, setAdmissionDate] = React.useState<Date>();
  const [reAdmissionDate, setReAdmissionDate] = React.useState<Date>();
  const [dischargeDate, setDischargeDate] = React.useState<Date>();
  const [incidentReportDate, setIncidentReportDate] = React.useState<Date>();
  const [birthDate, setBirthDate] = React.useState<Date>();
  const [formError, setFormError] = useState("");
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [patientDetails, setPatientDetails] = useState<any>([]);
  const [error, setError] = useState("");
  const [patientEditMode, setPatientEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [countryList, setCountryList] = useState<any[]>([]);
  const [submitFailed, setSubmitFailed] = useState(false);
  const [isSuccessful, setIsSuccessFul] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [canUpdate, setCanUpdate] = useState(false);
  const router = useRouter();

  const [initialFormData, setInitialFormData] = useState<PatientDetailsProps>({
    firstName: "",
    lastName: "",
    middleName: "",
    gender: "",
    age: 0,
    height: "",
    weight: "",
    mobility: "",
    dietaryRestrictions: "",
    dateOfBirth: "",
    phoneNo: "",
    address1: "",
    city: "",
    address2: "",
    state: "",
    country: "",
    zip: "",
    admissionDate: undefined,
    codeStatus: "",
    email: "",
    admissionStatus: "",
    dischargeDate: undefined,
    reAdmissionDate: undefined,
    incidentReportDate: undefined,
  });

  const [formData, setFormData] = useState<PatientDetailsProps>({
    firstName: "",
    lastName: "",
    middleName: "",
    gender: "",
    age: 0,
    height: "",
    weight: "",
    mobility: "",
    dietaryRestrictions: "",
    dateOfBirth: "",
    phoneNo: "",
    address1: "",
    city: "",
    address2: "",
    state: "",
    country: "",
    zip: "",
    admissionDate: undefined,
    codeStatus: "",
    email: "",
    admissionStatus: "",
    dischargeDate: undefined,
    reAdmissionDate: undefined,
    incidentReportDate: undefined,
  });

  console.log(canUpdate, "canUpdate");
  useEffect(() => {
    if (admissionDate) {
      const luxonDate = DateTime.fromJSDate(admissionDate);
      const formattedDate = luxonDate.toFormat("yyyy-LL-dd");

      setFormData((prevData) => ({
        ...prevData,
        admissionDate: formattedDate,
      }));
    }
    if (birthDate) {
      const luxonDate = DateTime.fromJSDate(birthDate);
      const formattedDate = luxonDate.toFormat("yyyy-LL-dd");

      setFormData((prevData) => ({
        ...prevData,
        dateOfBirth: formattedDate,
      }));
    }
  }, [admissionDate, birthDate]);

  useEffect(() => {
    if (patientDetails && patientDetails[0]) {
      setFormData((prevState) => ({
        ...prevState,
        firstName: patientDetails[0]?.firstName || "N/A",
        lastName: patientDetails[0]?.lastName || "N/A",
        middleName: patientDetails[0]?.middleName || "N/A",
        gender: patientDetails[0]?.gender || "N/A",
        age: patientDetails[0]?.age || "N/A",
        height: patientDetails[0]?.height || "N/A",
        weight: patientDetails[0]?.weight || "N/A",
        mobility: patientDetails[0]?.mobility || "N/A",
        dietaryRestrictions: patientDetails[0]?.dietaryRestrictions || "N/A",
        dateOfBirth: patientDetails[0]?.dateOfBirth || "N/A",
        phoneNo: patientDetails[0]?.phoneNo || "N/A",
        address1: patientDetails[0]?.address1 || "N/A",
        city: patientDetails[0]?.city || "N/A",
        address2: patientDetails[0]?.address2 || "N/A",
        state: patientDetails[0]?.state || "N/A",
        country: patientDetails[0]?.country || "N/A",
        zip: patientDetails[0]?.zip || "N/A",
        admissionDate: patientDetails[0]?.admissionDate || "N/A",
        codeStatus: patientDetails[0]?.codeStatus || "N/A",
        email: patientDetails[0]?.email || "N/A",
        admissionStatus: patientDetails[0]?.admissionStatus || "Admitted",
      }));
      setInitialFormData((prevState) => ({
        ...prevState,
        firstName: patientDetails[0]?.firstName || "N/A",
        lastName: patientDetails[0]?.lastName || "N/A",
        middleName: patientDetails[0]?.middleName || "N/A",
        gender: patientDetails[0]?.gender || "N/A",
        age: patientDetails[0]?.age || "N/A",
        height: patientDetails[0]?.height || "N/A",
        weight: patientDetails[0]?.weight || "N/A",
        mobility: patientDetails[0]?.mobility || "N/A",
        dietaryRestrictions: patientDetails[0]?.dietaryRestrictions || "N/A",
        dateOfBirth: patientDetails[0]?.dateOfBirth || "N/A",
        phoneNo: patientDetails[0]?.phoneNo || "N/A",
        address1: patientDetails[0]?.address1 || "N/A",
        city: patientDetails[0]?.city || "N/A",
        address2: patientDetails[0]?.address2 || "N/A",
        state: patientDetails[0]?.state || "N/A",
        country: patientDetails[0]?.country || "N/A",
        zip: patientDetails[0]?.zip || "N/A",
        admissionDate: patientDetails[0]?.admissionDate || "N/A",
        codeStatus: patientDetails[0]?.codeStatus || "N/A",
        email: patientDetails[0]?.email || "N/A",
        admissionStatus: patientDetails[0]?.admissionStatus || "Admitted",
      }));
      setAdmissionDate(new Date(patientDetails[0]?.admissionDate));
      setReAdmissionDate(new Date(patientDetails[0]?.reAdmissionDate));
      setDischargeDate(new Date(patientDetails[0]?.dischargeDate));
      setIncidentReportDate(new Date(patientDetails[0]?.incidentReportDate));
      setBirthDate(new Date(patientDetails[0]?.dateOfBirth));
    }
  }, [patientDetails]);

  const handleGenderChange = (gender: string) => {
    setFormData((prevData) => ({
      ...prevData,
      gender: gender,
    }));
    setCanUpdate(true);
  };

  const handleCodeStatusChange = (codeStatus: string) => {
    setFormData((prevData) => ({
      ...prevData,
      codeStatus: codeStatus,
    }));
    setCanUpdate(true);
  };

  const handleAdmissionStatusChange = (admissionStatus: string) => {
    setFormData((prevData) => ({
      ...prevData,
      admissionStatus: admissionStatus,
    }));
    setCanUpdate(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    if (name === "age" && !/^\d*$/.test(value)) {
      return; // Don't update state
    }
    if (name === "dateOfBirth") {
      const calculateAge = (dateOfBirth: string): number => {
        if (!dateOfBirth) {
          return 0;
        }
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
          age--;
        }
        return age;
      };

      setFormData((prevData) => ({
        ...prevData,
        dateOfBirth: value,
        age: calculateAge(value),
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
    setCanUpdate(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsSuccessFul(false);
        const response = await fetchPatientDetails(patientId, router);
        setPatientDetails(response.data);
        setIsLoading(false);
      } catch (error: any) {
        setFormError(error.message);
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
    setCanUpdate(true);
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

  const toggleEdit = () => {
    setIsDisabled((prevState) => !prevState);
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (!birthDate || !admissionDate) {
      setFormError("Date is required");
      setSubmitFailed(true);
      return;
    }
    try {
      patientDetailsSchema.parse(formData);
      setFormError(""); // Clear any previous errors

      try {
        await updatePatient(patientId, formData, router);
        setIsSubmitted(false);
        setIsDisabled(true);
        onSuccess();
        
        return;
      } catch (error: any) {
        console.error("Error updating patient:", error);
        setError(error.message);
        onError();
      }
      setIsSubmitted(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Validation failed", error.errors); // Log validation errors
        toast({
          variant: "destructive",
          title: "Validation failed. Please check your input.",
          description: error.errors[0]?.message,
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

        setSubmitFailed(true);
      } else {
        console.error("An unexpected error occurred", error);
      }
    }
    
    setIsSubmitted(false);
    setCanUpdate(false);
    saveClicked();
  };

  const onSuccess = () => {
    setIsSuccessOpen(true);
    saveClicked();
  };
  const onError = () => {
    setIsErrorOpen(true);
  };
  const today = new Date();
  const disableFutureDates = (date: Date) => date > today;

  const handleCancel = () => {
    setFormData(initialFormData);
    setIsDisabled(true);
  };
  return (
    <form
      onSubmit={handleFormSubmit}
      className="flex h-full w-full flex-col gap-8 rounded-[5px] border-[1.77px] border-[#D0D5DD] py-8"
    >
      <div className="flex gap-5 px-5">
        <Image
          src={"/icons/patient-icon.svg"}
          alt="patient-icon"
          height={17}
          width={14}
        />
        <h1 className="text-[20px] font-semibold">Patient Details</h1>
      </div>
      <div className="grid w-full grid-cols-4 gap-x-32 gap-y-8 px-14">
        <div className="flex flex-col ">
          <label className="font-semibold text-[#64748B]">First Name</label>
          <input
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            disabled={isDisabled}
            type="text"
            className={cn(
              `h-[45px] w-full rounded-[3px] border-[1px] border-[#D0D5DD] bg-[#F4F4F4] px-5`,
              { "border-0 bg-white px-0 font-semibold": isDisabled },
            )}
          />
        </div>
        <div className="flex flex-col ">
          <label className="font-semibold text-[#64748B]">Middle Name</label>
          <input
            name="middleName"
            value={formData.middleName}
            onChange={handleChange}
            disabled={isDisabled}
            type="text"
            className={cn(
              `h-[45px] w-full rounded-[3px] border-[1px] border-[#D0D5DD] bg-[#F4F4F4] px-5`,
              { "border-0 bg-white px-0 font-semibold": isDisabled },
            )}
          />
        </div>
        <div className="flex flex-col ">
          <label className="font-semibold text-[#64748B]">Last Name</label>
          <input
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            disabled={isDisabled}
            type="text"
            className={cn(
              `h-[45px] w-full rounded-[3px] border-[1px] border-[#D0D5DD] bg-[#F4F4F4] px-5`,
              { "border-0 bg-white px-0 font-semibold": isDisabled },
            )}
          />
        </div>
        <div className="relative flex flex-col ">
          <label className="font-semibold text-[#64748B]">Gender</label>
          <select
            id="status"
            name="gender"
            disabled={isDisabled}
            className={cn(
              `h-[45px] w-full cursor-pointer rounded-[3px] border-[1px] border-[#D0D5DD] bg-[#F4F4F4] px-5`,
              {
                "border-0 bg-white px-0 font-semibold opacity-100": isDisabled,
              },
            )}
            value={formData.gender}
            onChange={(e) => handleGenderChange(e.target.value)}
          >
            <option value="" disabled>
              select gender
            </option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <Image
            className={`${isDisabled ? "hidden" : ""} pointer-events-none absolute bottom-3 right-2`}
            width={20}
            height={20}
            src={"/icons/dropdown-icon.svg"}
            alt={""}
          />
        </div>

        <div className="flex flex-col ">
          <label className="font-semibold text-[#64748B]">Date of Birth</label>
          <Popover>
            <PopoverTrigger asChild>
              <button
                disabled={isDisabled}
                className={cn(
                  "relative h-[45px] w-full justify-start rounded-[3px] border-[1px] border-[#D0D5DD] bg-[#F4F4F4] px-5 !text-start",
                  !birthDate && "text-muted-foreground",
                  { "border-0 bg-white px-0 font-semibold": isDisabled },
                )}
              >
                {birthDate ? format(birthDate, "PPP") : <span>MM/dd/yyyy</span>}
                <Image
                  src={"/icons/patient-details-calendar.svg"}
                  alt="calendar"
                  width={18}
                  height={18}
                  className={`${isDisabled ? "hidden" : ""} absolute bottom-3 right-5`}
                />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={birthDate}
                onSelect={setBirthDate}
                initialFocus
                disabledDates={disableFutureDates}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex flex-col ">
          <label className="font-semibold text-[#64748B]">Age</label>
          <input
            name="age"
            value={formData.age}
            onChange={handleChange}
            disabled={isDisabled}
            type="text"
            className={cn(
              `h-[45px] w-full rounded-[3px] border-[1px] border-[#D0D5DD] bg-[#F4F4F4] px-5`,
              { "border-0 bg-white px-0 font-semibold": isDisabled },
            )}
          />
        </div>
        <div className="flex flex-col ">
          <label className="font-semibold text-[#64748B]">Height</label>
          <input
            name="height"
            value={formData.height}
            onChange={handleChange}
            disabled={isDisabled}
            type="text"
            className={cn(
              `h-[45px] w-full rounded-[3px] border-[1px] border-[#D0D5DD] bg-[#F4F4F4] px-5`,
              { "border-0 bg-white px-0 font-semibold": isDisabled },
            )}
          />
        </div>
        <div className="flex flex-col ">
          <label className="font-semibold text-[#64748B]">Weight</label>
          <input
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            disabled={isDisabled}
            type="text"
            className={cn(
              `h-[45px] w-full rounded-[3px] border-[1px] border-[#D0D5DD] bg-[#F4F4F4] px-5`,
              { "border-0 bg-white px-0 font-semibold": isDisabled },
            )}
          />
        </div>
        <div className="flex flex-col ">
          <label className="font-semibold text-[#64748B]">Mobility</label>
          <input
            name="mobility"
            value={formData.mobility}
            onChange={handleChange}
            disabled={isDisabled}
            type="text"
            className={cn(
              `h-[45px] w-full rounded-[3px] border-[1px] border-[#D0D5DD] bg-[#F4F4F4] px-5`,
              { "border-0 bg-white px-0 font-semibold": isDisabled },
            )}
          />
        </div>
        <div className="flex flex-col ">
          <label className="font-semibold text-[#64748B]">
            Dietary Restrictions
          </label>
          <input
            name="dietaryRestrictions"
            value={formData.dietaryRestrictions}
            onChange={handleChange}
            disabled={isDisabled}
            type="text"
            className={cn(
              `h-[45px] w-full rounded-[3px] border-[1px] border-[#D0D5DD] bg-[#F4F4F4] px-5`,
              { "border-0 bg-white px-0 font-semibold": isDisabled },
            )}
          />
        </div>
        <div className="flex flex-col ">
          <label className="font-semibold text-[#64748B]">Phone Number</label>
          <input
            name="phoneNo"
            value={formData.phoneNo}
            onChange={handleChange}
            disabled={isDisabled}
            type="text"
            className={cn(
              `h-[45px] w-full rounded-[3px] border-[1px] border-[#D0D5DD] bg-[#F4F4F4] px-5`,
              { "border-0 bg-white px-0 font-semibold": isDisabled },
            )}
          />
        </div>
        <div className="flex flex-col ">
          <label className="font-semibold text-[#64748B]">Email</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isDisabled}
            type="email"
            className={cn(
              `h-[45px] w-full rounded-[3px] border-[1px] border-[#D0D5DD] bg-[#F4F4F4] px-5`,
              { "border-0 bg-white px-0 font-semibold": isDisabled },
            )}
          />
        </div>
        <div className="flex flex-col ">
          <label className="font-semibold text-[#64748B]">Address Line 1</label>
          <input
            name="address1"
            value={formData.address1}
            onChange={handleChange}
            disabled={isDisabled}
            type="text"
            className={cn(
              `h-[45px] w-full rounded-[3px] border-[1px] border-[#D0D5DD] bg-[#F4F4F4] px-5`,
              { "border-0 bg-white px-0 font-semibold": isDisabled },
            )}
          />
        </div>
        <div className="flex flex-col ">
          <label className="font-semibold text-[#64748B]">Address Line 2</label>
          <input
            name="address2"
            value={formData.address2}
            onChange={handleChange}
            disabled={isDisabled}
            type="text"
            className={cn(
              `h-[45px] w-full rounded-[3px] border-[1px] border-[#D0D5DD] bg-[#F4F4F4] px-5`,
              { "border-0 bg-white px-0 font-semibold": isDisabled },
            )}
          />
        </div>
        <div className="flex flex-col ">
          <label className="font-semibold text-[#64748B]">Country</label>
          <select
            name="country"
            value={formData.country}
            onChange={(e) => handleCountryChange(e.target.value)}
            disabled={isDisabled}
            className={cn(
              `h-[45px] w-full rounded-[3px] border-[1px] border-[#D0D5DD] bg-[#F4F4F4] px-5`,
              {
                "border-0 bg-white px-0 font-semibold opacity-100": isDisabled,
              },
            )}
          >
            <option value="" disabled>
              Select Country
            </option>
            {countryList.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col ">
          <label className="font-semibold text-[#64748B]">City</label>
          <input
            name="city"
            value={formData.city}
            onChange={handleChange}
            disabled={isDisabled}
            type="text"
            className={cn(
              `h-[45px] w-full rounded-[3px] border-[1px] border-[#D0D5DD] bg-[#F4F4F4] px-5`,
              { "border-0 bg-white px-0 font-semibold": isDisabled },
            )}
          />
        </div>

        <div className="flex flex-col ">
          <label className="font-semibold text-[#64748B]">State</label>
          <input
            name="state"
            value={formData.state}
            onChange={handleChange}
            disabled={isDisabled}
            type="text"
            className={cn(
              `h-[45px] w-full rounded-[3px] border-[1px] border-[#D0D5DD] bg-[#F4F4F4] px-5`,
              { "border-0 bg-white px-0 font-semibold": isDisabled },
            )}
          />
        </div>

        <div className="flex flex-col ">
          <label className="font-semibold text-[#64748B]">Zip</label>
          <input
            name="zip"
            value={formData.zip}
            onChange={handleChange}
            disabled={isDisabled}
            type="text"
            className={cn(
              `h-[45px] w-full rounded-[3px] border-[1px] border-[#D0D5DD] bg-[#F4F4F4] px-5`,
              { "border-0 bg-white px-0 font-semibold": isDisabled },
            )}
          />
        </div>
        <div className="relative flex flex-col ">
          <label className="font-semibold text-[#64748B]">Code Status</label>

          <select
            id="status"
            disabled={isDisabled}
            name="codeStatus"
            className={cn(
              "relative h-[45px] w-full justify-start rounded-[3px] border-[1px] border-[#D0D5DD] bg-[#F4F4F4] px-5 !text-start",

              {
                "border-0 bg-white px-0 font-semibold opacity-100": isDisabled,
                "text-[#DB3956]": formData.codeStatus === "DNR",
                "text-[#1B84FF]": formData.codeStatus === "FULL CODE",
              },
            )}
            value={formData.codeStatus}
            onChange={(e) => handleCodeStatusChange(e.target.value)}
          >
            <option className="!text-black" value="" disabled>
              select status
            </option>
            <option value="DNR" className="text-[#DB3956]">
              DNR
            </option>
            <option value="FULL CODE" className="text-[#1B84FF]">
              FULL CODE
            </option>
          </select>
          <Image
            className={`${isDisabled ? "hidden" : ""} pointer-events-none absolute bottom-3 right-2`}
            width={20}
            height={20}
            src={"/icons/dropdown-icon.svg"}
            alt={""}
          />
        </div>
        <div className="relative flex flex-col ">
          <label className="font-semibold text-[#64748B]">Admission Date</label>

          <button
            disabled
            className={cn(
              "relative h-[45px] w-full justify-start rounded-[3px] border-[1px] border-[#D0D5DD] bg-[#F4F4F4] px-5 !text-start",
              !admissionDate && "text-muted-foreground",
              { "border-0 bg-white px-0 font-semibold": isDisabled },
            )}
          >
            {admissionDate ? (
              format(admissionDate, "PPP")
            ) : (
              <span>MM/dd/yyyy</span>
            )}
            <Image
              src={"/icons/patient-details-calendar.svg"}
              alt="calendar"
              width={18}
              height={18}
              className={`${isDisabled ? "hidden" : ""} absolute bottom-3 right-5`}
            />
          </button>
        </div>
        <div className="relative flex flex-col ">
          <label className="font-semibold text-[#64748B]">
            Admission Status
          </label>

          <select
            id="status"
            disabled={isDisabled}
            name="admissionStatus"
            className={cn(
              "relative h-[45px] w-full justify-start rounded-[3px] border-[1px] border-[#D0D5DD] bg-[#F4F4F4] px-5 !text-start",

              {
                "border-0 bg-white px-0 font-semibold opacity-100": isDisabled,
              },
            )}
            value={formData.codeStatus}
            onChange={(e) => handleAdmissionStatusChange(e.target.value)}
          >
            <option className="!text-black" value="">
              {formData.admissionStatus}
            </option>
            <option value="Discharge">Discharge</option>
            <option value="Re-admission">Re-admission</option>
            <option value="Incident Report">Incident Report</option>
          </select>
          <Image
            className={`${isDisabled ? "hidden" : ""} pointer-events-none absolute bottom-3 right-2`}
            width={20}
            height={20}
            src={"/icons/dropdown-icon.svg"}
            alt={""}
          />
        </div>
        <div
          className={cn("relative flex flex-col ", {
            hidden: formData.admissionStatus === "Admitted",
          })}
        >
          <label className="font-semibold text-[#64748B]">
            {formData.admissionStatus === "Discharge"
              ? "Discharge"
              : formData.admissionStatus === "Re-admission"
                ? "Re-admission"
                : "Incident Report"}
          </label>

          <button
            disabled
            className={cn(
              "relative h-[45px] w-full justify-start rounded-[3px] border-[1px] border-[#D0D5DD] bg-[#F4F4F4] px-5 !text-start",
              !admissionDate && "text-muted-foreground",
              { "border-0 bg-white px-0 font-semibold": isDisabled },
            )}
          >
            {formData.admissionStatus === "Discharge" && dischargeDate ? (
              format(dischargeDate, "PPP")
            ) : formData.admissionStatus === "Re-admission" &&
              reAdmissionDate ? (
              format(reAdmissionDate, "PPP")
            ) : (
              <span>MM/dd/yyyy</span>
            )}

            <Image
              src={"/icons/patient-details-calendar.svg"}
              alt="calendar"
              width={18}
              height={18}
              className={`${isDisabled ? "hidden" : ""} absolute bottom-3 right-5`}
            />
          </button>
        </div>
      </div>
      <div className="flex justify-end gap-5 pr-[53px] font-medium">
        <button
          type="button"
          onClick={() => {
            toggleEdit(), setCanUpdate(false), handleCancel();
          }}
          className={`${isDisabled ? "hidden" : ""} rounded-[2.8px] bg-[#F3F3F3] p-3 px-8 hover:bg-[#E7EAEE]`}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={toggleEdit}
          className={`${!isDisabled && "hidden"} flex gap-1 rounded-[2.8px] bg-[#1B84FF] p-3 px-8 text-white hover:bg-[#2267B9]`}
        >
          Edit
        </button>
        <button
          type="submit"
          disabled={isSubmitted || !canUpdate}
          className={`${isDisabled && "hidden"} ${isSubmitted || (!canUpdate && "cursor-not-allowed")} flex gap-1 rounded-[2.8px] bg-[#1B84FF] p-3 px-8 text-white hover:bg-[#2267B9]`}
        >
          <LucideLoader2
            className={`animate-spin ${isSubmitted ? "" : "hidden"}`}
            width={16}
          />
          {isSubmitted ? "Saving..." : "Save Changes"}
        </button>
      </div>
      {isSuccessOpen && (
        <SuccessModal
          label="Success"
          isAlertOpen={isSuccessOpen}
          toggleModal={setIsSuccessOpen}
          isUpdated={true}
          setIsUpdated={setIsSuccessOpen}
        />
      )}
      {isErrorOpen && (
        <ErrorModal
          label="Error"
          isAlertOpen={isErrorOpen}
          toggleModal={setIsErrorOpen}
          isEdit={false}
          errorMessage={error}
        />
      )}
    </form>
  );
};

export default PatientDetailsComponent;
