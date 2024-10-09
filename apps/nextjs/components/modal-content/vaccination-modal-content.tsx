"use client";

import { X } from "lucide-react";
import React, { use, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { ToastAction } from "../ui/toast";
import { useToast } from "../ui/use-toast";
import { cn } from "@/lib/utils";
import {
  addVaccinationFile,
  createVaccinationOfPatient,
  fetchVaccinationFiles,
  getCurrentFileCountFromDatabase,
  updateVaccinationsOfPatient,
} from "@/app/api/vaccinations-api/vaccinations.api";
import { set } from "date-fns";
interface Modalprops {
  isView: boolean;
  vaccinationData: any;
  label: string;
  isOpen: boolean;
  isModalOpen: (isOpen: boolean) => void;
  onSuccess: () => void;
}

export const VaccinationModalContent = ({
  isView,
  vaccinationData,
  label,
  isOpen,
  isModalOpen,
  onSuccess,
}: Modalprops) => {
  const router = useRouter();
  const params = useParams<{
    id: any;
    tag: string;
    item: string;
  }>();
  const patientId = params.id.toUpperCase();
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState("");

  const [selectedStatus, setSelectedStatus] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [error, setError] = useState<string | null>(null);
  const [charactersFull, setCharactersFull] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isReschedule, setIsReschedule] = useState<boolean>(false);
  const selectRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [fileTypes, setFileTypes] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [numFilesCanAdd, setNumFilesCanAdd] = useState<number>(5);
  const [selectedFileNames, setSelectedFileNames] = useState<string[]>([]);
  const [vaccinationFiles, setVaccinationFiles] = useState<any[]>([]); //
  const toggleMaxSizeToast = (): void => {
    setIsSubmitted(false);
    toast({
      variant: "destructive",
      title: "File Size Too Big!",
      description: `Total size of selected files exceeds the limit of 15MB!`,
    });
  };
  const toggleNoFileAttached = (): void => {
    setIsSubmitted(false);
    toast({
      variant: "destructive",
      title: "No File Attached!",
      description: `Please insert a document to submit form!`,
    });
  };
  const toggleMaxFilesToast = (maxFiles: number): void => {
    setIsSubmitted(false);
    toast({
      variant: "destructive",
      title: "Maximum Number of Files Exceeded!",
      description: `You can only add ${maxFiles} more file(s). Please try again.`,
    });
  };
  const [isHovering, setIsHovering] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchVaccinationFiles(
          vaccinationData.vaccination_uuid,
          router,
        );

        // Only proceed if response.data is not null or empty
        if (response.data && response.data.length > 0) {
          setVaccinationFiles(response.data);
          console.log(response.data, "VACCINATION FILES.data");
          const maxAllowedFiles = 5 - vaccinationFiles.length;
          setNumFilesCanAdd(maxAllowedFiles);
          setIsLoading(false);
        }
      } catch (error: any) {
        setError(error.message);
      }
    };

    if (vaccinationData.vaccination_uuid) {
      fetchData();
    }
  }, [vaccinationData.vaccination_uuid]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSubmitted(true);
    const files = e.target.files;
    const MAX_FILE_SIZE_MB = 15;
    if (files) {
      const totalSize = Array.from(files).reduce(
        (acc, file) => acc + file.size,
        0,
      );
      const totalSizeMB = totalSize / (1024 * 1024); // Convert bytes to MB

      if (totalSizeMB > MAX_FILE_SIZE_MB) {
        toggleMaxSizeToast();
        e.target.value = ""; // Clear the input field
      }
      if (files.length > numFilesCanAdd) {
        toggleMaxFilesToast(numFilesCanAdd);
        e.target.value = ""; // Clear the input field
      }
    }

    if (files && files.length > 0) {
      const newFiles: File[] = [];
      const newFileNames: string[] = [];
      const newFileTypes: string[] = [];

      Array.from(files).forEach((file) => {
        if (file) {
          // Add file, name, and type to arrays
          newFiles.push(file);
          newFileNames.push(file.name);
          newFileTypes.push(file.type.split("/")[1]);
          console.log(
            vaccinationFiles,
            "vaccinationFiles vaccinationFiles vaccinationFiles",
          );
          // Set selected file names
          setSelectedFileNames(newFileNames);
          console.log(selectedFileNames, "selected file names");
          // You can handle base64 conversion here if needed
        }
      });

      // Update state variables with arrays

      setSelectedFiles(newFiles);
      setFileNames(newFileNames);
      setFileTypes(newFileTypes);
    } else {
      console.warn("No files selected");
    }
    setIsSubmitted(false);
  };
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

  const handleDropdownClick = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };
  const handleOthersDropdownClick = () => {
    setSelectedType("");
    setIsDropdownOpen((prevState) => !prevState);
  };
  const handleTextChange = (e: any) => {
    setFormData((prevData) => ({
      ...prevData,
      details: e.target.value,
    }));
  };

  useEffect(() => {
    if (selectRef.current) {
      selectRef.current.focus();
    }
  }, [selectedType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const formatDate = (createdAt: string | number | Date) => {
    // Create a new Date object from the provided createdAt date string
    const date = new Date(createdAt);

    // Get the month, day, and year
    const month = date.toLocaleString("default", { month: "short" });
    const day = date.getDate();
    const year = date.getFullYear();

    const formattedDate = `${month} ${day}, ${year}`;

    return formattedDate;
  };
  const [formData, setFormData] = useState({
    vaccinatorName: vaccinationData.vaccination_vaccinatorName,
    dosageSequence: vaccinationData.vaccination_dosageSequence,
    vaccineManufacturer: vaccinationData.vaccination_vaccineManufacturer,
    healthFacility: vaccinationData.vaccination_healthFacility,
    dateIssued: vaccinationData.vaccination_dateIssued,
  });
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitted(true);
    const getUuid = vaccinationData.vaccination_uuid;
    if (selectedFiles.length === 0) {
      if (!isView) {
        toggleNoFileAttached();
      } else {
        isModalOpen(false);
      }
    } else {
      if (getUuid) {
        const currentFileCount = await getCurrentFileCountFromDatabase(getUuid);
        console.log("Current file count:", currentFileCount);
        // Define the maximum allowed files based on the current count
        const maxAllowedFiles =
          currentFileCount === 0 ? 5 : 5 - currentFileCount;
        if (selectedFiles.length > maxAllowedFiles) {
          toggleMaxFilesToast(maxAllowedFiles);
          return;
        }
        console.log("FILES TO ADD", maxAllowedFiles);

        console.log("Lab UUID:", getUuid);
      }
      try {
        if (isEditable || isView) {
          await updateVaccinationsOfPatient(
            vaccinationData.vaccination_uuid,
            formData,
            router,
          );
          isModalOpen(false);
          return;
        } else {
          console.log("vaccination adding");
          console.log(formData, "formdata");
          const vaccination = await createVaccinationOfPatient(
            patientId,
            formData,
            router,
          );
          const getUuid = vaccination.uuid;
          // Iterate through each selected file
          if (selectedFiles && selectedFiles.length > 0) {
            // Iterate through each selected file
            for (let i = 0; i < selectedFiles.length; i++) {
              const vaccinationFormData = new FormData();
              vaccinationFormData.append(
                "vaccinationfile",
                selectedFiles[i],
                fileNames[i],
              );

              // Add lab file
              const addLabFiles = await addVaccinationFile(
                getUuid,
                vaccinationFormData,
                router,
              );

              console.log(
                `Vacc FILE ${fileNames[i]} added successfully:`,
                addLabFiles,
              );
            }
            onSuccess();
          } else {
            console.warn("No files selected to upload");
          }
          onSuccess();
          isModalOpen(false);
          // Reset the form data after successful submission
          setFormData({
            vaccinatorName: "",
            dosageSequence: "",
            vaccineManufacturer: "",
            healthFacility: "",
            dateIssued: "",
          });
        }
      } catch (error: any) {
        if (error.message == "Network Error") {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: error.message,
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
        }
        console.error("Error adding vaccination:", error);
        setError("Failed to add Prescription");
      }
    }
  };
  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };
  function getImageSrc(isEditable: boolean, isHovered: boolean) {
    if (isEditable) {
      return isHovered
        ? "/icons/edit-icon-white.svg"
        : "/icons/edit-icon-blue.svg";
    } else {
      return "/icons/edit-icon.svg";
    }
    setIsSubmitted(false);
  }
  const [isLoading, setIsLoading] = useState<boolean>(true);

  console.log(formData, "formdata");
  return (
    <div className={`h-[530px] w-[767px] rounded-md bg-[#FFFFFF]`}>
      {isLoading && isView ? (
        // Loading state

        <>
          <div className="flex h-[70px] w-full flex-col justify-start rounded-md bg-[#ffffff]">
            <div className="flex items-center justify-between">
              <h2 className="p-title mt-7 pl-10 text-left text-[#071437]"></h2>
              <X
                onClick={() => {
                  isSubmitted ? null : isModalOpen(false);
                }}
                className={` ${isSubmitted && "cursor-not-allowed"} mr-9 mt-6 flex h-6 w-6 cursor-pointer items-center text-black`}
              />
            </div>
            <p className="pb-10 pl-10 pt-2 text-sm text-gray-600"></p>
          </div>
          <div className="mb-9 pt-4">
            <div className="mt-5 h-[280px] md:px-8">
              <div className="flex h-full w-full items-center justify-center">
                <Image
                  src="/imgs/colina-logo-animation.gif"
                  alt="logo"
                  width={100}
                  height={100}
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <form className="" onSubmit={handleSubmit}>
            <div className="flex w-full flex-col justify-start bg-[#ffffff]">
              <div className="flex items-center justify-between">
                <h2 className="p-title ml-10 mt-7 text-left text-[#071437]">
                  {isView
                    ? "View Vaccination Details"
                    : "Add Vaccination Details"}
                </h2>
                <X
                  onClick={() => {
                    isSubmitted ? null : isModalOpen(false);
                  }}
                  className={` ${isSubmitted && "cursor-not-allowed"} mr-9 mt-6 flex h-6 w-6 cursor-pointer items-center text-black`}
                />
              </div>
              <div className="ml-10 mt-2 text-start text-sm text-gray-600">
                {isView ? (
                  <div className="flex items-start justify-start text-start">
                    <p className="text-start text-[15px] text-[#64748B]">
                      Vaccination Details
                    </p>
                  </div>
                ) : (
                  <div className="flex items-start justify-start text-start">
                    <p className="text-start text-[15px] text-[#64748B]">
                      Submit your log details
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-8 px-10">
              <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                <div className="">
                  <label
                    htmlFor="vaccinatorName"
                    className="required-field mb-3 block text-xl font-medium leading-6"
                  >
                    Date Issued
                  </label>
                  <div className="relative mt-2.5">
                    <input
                      type="date"
                      className={cn(
                        "border-1 relative block h-12 w-full rounded-[3px] border border-[#D0D5DD] px-3.5 py-2 placeholder:text-gray-400 sm:text-sm sm:leading-6",
                        {
                          "sub-title bg-white": isView,
                        },
                      )}
                      placeholder="Select date"
                      name="dateIssued"
                      value={formData.dateIssued}
                      onChange={handleChange}
                      required
                      disabled={!isEditable && isView}
                    />
                    <Image
                      className="pointer-events-none absolute right-0 top-0 mr-3 mt-3.5"
                      width={20}
                      height={20}
                      src={
                        isView
                          ? "/svgs/calendar-disabled.svg"
                          : "/svgs/calendark.svg"
                      }
                      alt={""}
                    />
                  </div>
                </div>
                <div className="">
                  <label
                    htmlFor="vaccinatorName"
                    className="required-field mb-3 block text-xl font-medium leading-6"
                  >
                    Vaccinator Name
                  </label>

                  <input
                    type="text"
                    required
                    className={cn(
                      "border-1 relative block h-12 w-full rounded-[3px] border border-[#D0D5DD] px-3.5 py-2 placeholder:text-gray-400 sm:text-sm sm:leading-6",
                      {
                        "sub-title bg-white": isView,
                      },
                    )}
                    placeholder="input name of vaccinator"
                    name="vaccinatorName"
                    value={formData.vaccinatorName}
                    onChange={handleChange}
                    disabled={!isEditable && isView}
                  />
                </div>

                <div className="">
                  <label
                    htmlFor="dosageSequence"
                    className="required-field mb-3 block text-xl font-medium leading-6"
                  >
                    Dosage Sequence
                  </label>

                  <div className="relative">
                    <select
                      id="dosageSequence"
                      className={cn(
                        "border-1 block h-12 w-full rounded-[3px] border border-[#D0D5DD] px-3.5 py-2 placeholder:text-gray-400 sm:text-sm sm:leading-6",
                        {
                          "sub-title bg-white": isView,
                        },
                      )}
                      name="dosageSequence"
                      value={formData.dosageSequence}
                      onChange={handleSelectChange}
                      disabled={!isEditable && isView}
                    >
                      <option className="text-gray-400" value="">
                        Select Dosage Sequence
                      </option>
                      <option value="1st Dose">1st Dose</option>
                      <option value="2nd Dose">2nd Dose</option>
                      <option value="3rd Dose">3rd Dose</option>
                    </select>
                    <Image
                      className="pointer-events-none absolute right-0 top-0 mr-3 mt-3"
                      width={20}
                      height={20}
                      src={
                        isView
                          ? "/svgs/disabled-chevron-up.svg"
                          : "/svgs/chevron-up.svg"
                      }
                      alt={""}
                    />
                  </div>
                </div>

                <div className="">
                  <label
                    htmlFor="vaccineManufacturer"
                    className="required-field mb-3 block text-xl font-medium leading-6"
                  >
                    Vaccine Manufacturer
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      className={cn(
                        "border-1 block h-12 w-full rounded-[3px] border border-[#D0D5DD] px-3.5 py-2 placeholder:text-gray-400 sm:text-sm sm:leading-6",
                        {
                          "sub-title bg-white": isView,
                        },
                      )}
                      placeholder="input vaccination manufacturer"
                      name="vaccineManufacturer"
                      value={formData.vaccineManufacturer}
                      onChange={handleChange}
                      disabled={!isEditable && isView}
                    />
                  </div>
                </div>
                <div className="">
                  <label
                    htmlFor="healthFacility"
                    className="required-field mb-3 block text-xl font-medium leading-6"
                  >
                    Health Facility
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      className={cn(
                        "border-1 block h-12 w-full rounded-[3px] border border-[#D0D5DD] px-3.5 py-2 placeholder:text-gray-400 sm:text-sm sm:leading-6",
                        {
                          "sub-title bg-white": isView,
                        },
                      )}
                      placeholder="input health facility"
                      name="healthFacility"
                      onChange={handleChange}
                      value={formData.healthFacility}
                      disabled={!isEditable && isView}
                    />
                  </div>
                </div>

                <div
                  className="flex-1 self-end"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="filehover">
                    <div className="relative">
                      {vaccinationFiles.length === 5 ? (
                        <div className="">
                          <label className="relative flex w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-[#007C85] bg-[#daf3f5] text-center font-bold text-[#101828]">
                            <>
                              <Image
                                className="mr-3 h-6 w-6"
                                width={50}
                                height={50}
                                src={"/svgs/filein.svg"}
                                alt=""
                              />
                              <div className="flex text-nowrap pb-5 text-[12px]">
                                <p className="mt-2">Maximum Files Uploaded</p>
                              </div>
                            </>
                          </label>
                        </div>
                      ) : (
                        <div className="">
                          <label
                            htmlFor="imageUpload"
                            className="relative flex h-[62px] cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-[#007C85] bg-[#007C851A] text-center font-normal text-[#101828]"
                          >
                            <>
                              <div className="flex flex-row">
                                {selectedFileNames.length > 0 ? (
                                  // If files are selected, display filein.svg
                                  <Image
                                    className="mr-3 h-7 w-7"
                                    width={50}
                                    height={50}
                                    src={"/svgs/filein.svg"}
                                    alt=""
                                  />
                                ) : (
                                  // If no files are selected, display folder-add.svg
                                  <Image
                                    className="mr-3 mt-[4.5px] h-6 w-6"
                                    width={20}
                                    height={20}
                                    src={"/svgs/folder-add.svg"}
                                    alt=""
                                  />
                                )}
                                {isView ? (
                                  <p className="mt-2 font-medium">
                                    Files Attached
                                  </p>
                                ) : (
                                  <p className="mt-2 font-medium">
                                    Upload or Attach Files or{" "}
                                    <span className="ml-1 mt-2 text-[15px] font-medium text-blue-500 underline decoration-solid">
                                      Browse
                                    </span>
                                  </p>
                                )}
                              </div>

                              {selectedFileNames.length === 0 && !isView ? (
                                // Display "Maximum File Size: 10MB" if no files are attached
                                <span className="text-[15px] font-normal text-[#64748B]">
                                  Maximum File Size: 50MB
                                </span>
                              ) : (
                                // Display the file name if one file is attached, or the number of files if more than one are attached

                                <>
                                  {!isView && (
                                    <span className="text-[#64748B] ">
                                      {selectedFiles.length < 5
                                        ? // Display the file name if the number of files is less than or equal to 5
                                          selectedFiles.length === 1
                                          ? selectedFileNames[0]
                                          : `${selectedFiles.length}/${numFilesCanAdd} files attached`
                                        : // Display a message indicating that the maximum limit has been reached
                                          `Maximum of 5 files added`}
                                    </span>
                                  )}
                                </>
                              )}
                              {isView && (
                                <span className="ml-9 text-[#64748B] truncate w-[250px]">
                                  {vaccinationFiles.length < 5
                                    ? // Display the file name if the number of files is less than or equal to 5
                                      vaccinationFiles.length === 1
                                      ? vaccinationFiles[0].filename
                                      : `${vaccinationFiles.length}/${numFilesCanAdd} files attached`
                                    : // Display a message indicating that the maximum limit has been reached
                                      `Maximum of 5 files added`}
                                </span>
                              )}
                            </>
                          </label>
                          <input
                            type="file"
                            id="imageUpload"
                            multiple={true}
                            accept="image/jpg,image/png,.pdf"
                            className="hidden"
                            name="file"
                            disabled={isView}
                            onChange={(e) => handleFile(e)}
                          />
                          {isHovering &&
                            selectedFiles.length > 0 &&
                            !isView && (
                              <div className="absolute left-0 w-[339px] rounded-md bg-[#4E4E4E] p-2 text-[13px] text-white shadow-md">
                                <ul>
                                  {selectedFiles.map((file, index) => (
                                    <li key={index}>{file.name}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mr-10 mt-10 flex justify-end self-end">
              <button
                onClick={() => isModalOpen(false)}
                disabled={isSubmitted}
                type="button"
                className={` ${isSubmitted && "cursor-not-allowed"} ${isView && "hidden"} mr-4 h-[45px] w-[150px] rounded-sm bg-[#F3F3F3] font-medium text-black hover:bg-[#D9D9D9]`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`${
                  isSubmitted ? "cursor-not-allowed" : "cursor-pointer"
                } h-[45px] w-[150px] rounded-sm bg-[#007C85] px-3 py-2 font-medium text-[#ffff] hover:bg-[#03595B]`}
              >
                {isView ? "OK" : "Submit"}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};
