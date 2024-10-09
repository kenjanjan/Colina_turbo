"use client";
import {
  updatePrescriptionOfPatient,
  createPrescriptionOfPatient,
  addPrescriptionFile,
  fetchPrescriptionFiles,
} from "@/app/api/prescription-api/prescription.api";
import { X } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ToastAction } from "../ui/toast";
import { useToast } from "../ui/use-toast";

interface Modalprops {
  isEdit: boolean;
  prescriptionData: any;
  setIsUpdated: any;
  label: string;
  isOpen: boolean;
  setErrorMessage: any;
  isModalOpen: (isOpen: boolean) => void;
  onSuccess: () => void;
  onFailed: () => void;
}

export const PrescriptionModalContent = ({
  isEdit,
  prescriptionData,
  label,
  setIsUpdated,
  isOpen,
  setErrorMessage,
  isModalOpen,
  onSuccess,
  onFailed,
}: Modalprops) => {
  const params = useParams<{
    id: any;
    tag: string;
    item: string;
  }>();
  const { toast } = useToast();
  const patientId = params.id.toUpperCase();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    prescriptionType: prescriptionData.prescriptions_prescriptionType || "",
    name: prescriptionData.prescriptions_name || "",
    frequency: prescriptionData.prescriptions_frequency || "",
    interval: prescriptionData.prescriptions_interval || "",
    dosage: prescriptionData.prescriptions_dosage || "",
    startDate: prescriptionData.prescriptions_startDate || "",
    endDate: prescriptionData.prescriptions_endDate || "",
    status: prescriptionData.prescriptions_status || "",
  });
  const [prescriptionFiles, setPrescriptionFiles] = useState<any[]>([]); //
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [fileTypes, setFileTypes] = useState<string[]>([]);
  const [numFilesCanAdd, setNumFilesCanAdd] = useState<number>(5);
  const [selectedFileNames, setSelectedFileNames] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "interval" && (!/^\d*$/.test(value) || parseInt(value) > 12)) {
      return; // Don't update state
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const toggleMaxSizeToast = (): void => {
    toast({
      variant: "destructive",
      title: "File Size Too Big!",
      description: `Total size of selected files exceeds the limit of 15MB!`,
    });
  };
  const toggleMaxFilesToast = (maxFiles: number): void => {
    toast({
      variant: "destructive",
      title: "Maximum Number of Files Exceeded!",
      description: `You can only add ${maxFiles} more file(s). Please try again.`,
    });
  };
  useEffect(() => {
    // Initialize selected file names array
    setSelectedFileNames([]);

    if (prescriptionFiles && prescriptionFiles.length > 0) {
      // Push file names to selectedFileNames array
      for (let file of prescriptionFiles) {
        // Only push the filename if it's defined
        if (file && file.filename) {
          selectedFileNames.push(file.filename);
        }
      }

      console.log(selectedFileNames, "selected file names");
      console.log(prescriptionFiles, "prescriptionFiles");
      const maxAllowedFiles = 5 - selectedFileNames.length;
      setNumFilesCanAdd(maxAllowedFiles);
      // Set selected file names
      setSelectedFileNames(selectedFileNames);
    } else {
      console.log("No files in prescriptionfiles");
      // Optionally, you can clear the selectedFileNames state here
      setSelectedFileNames([]);
    }
  }, [prescriptionFiles, setSelectedFileNames]);
  // for fetching data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchPrescriptionFiles(
          prescriptionData.prescriptions_uuid,
          router,
        );

        // Only proceed if response.data is not null or empty
        if (response.data && response.data.length > 0) {
          setPrescriptionFiles(response.data);
          console.log(response.data, "prescription.data");
          const maxAllowedFiles = 5 - prescriptionFiles.length;
          setNumFilesCanAdd(maxAllowedFiles);
          setIsLoading(false);
        }
      } catch (error: any) {
        setError(error.message);
      }
    };

    if (prescriptionData.prescriptions_uuid) {
      fetchData();
    }
  }, [prescriptionData.prescriptions_uuid]);



  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          setSelectedFileNames(newFileNames);
          console.log(selectedFileNames, "selected file names");
          console.log(prescriptionFiles, "prescriptionfiles");
        }
      });

      // Update state variables with arrays

      setSelectedFiles(newFiles);
      setFileNames(newFileNames);
      setFileTypes(newFileTypes);
    } else {
      console.warn("No files selected");
    }
  };
  const handleDropDownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);

    try {
      if (isEdit) {
        await updatePrescriptionOfPatient(
          prescriptionData.prescriptions_uuid,
          formData,
          router,
        );

        // Iterate through each selected file
        if (selectedFiles && selectedFiles.length > 0) {
          // Iterate through each selected file
          for (let i = 0; i < selectedFiles.length; i++) {
            const prescriptionFileFormData = new FormData();
            prescriptionFileFormData.append(
              "prescriptionfile",
              selectedFiles[i],
              fileNames[i],
            );

            // Add prescription file
            const addPrescriptionFiles = await addPrescriptionFile(
              prescriptionData.prescriptions_uuid,
              prescriptionFileFormData,
            );

            console.log(
              `Prescription FILE ${fileNames[i]} added successfully:`,
              addPrescriptionFiles,
            );
          }
        } else {
          console.warn("No files selected to upload");
        }
        setIsUpdated(true);
        setIsSubmitted(false);
        onSuccess();
        isModalOpen(false);
      } else {
        const prescription = await createPrescriptionOfPatient(
          patientId,
          formData,
          router,
        );
        console.log("Prescription added successfully:", prescription);

        // Iterate through each selected file
        if (selectedFiles.length > 0) {
          for (let i = 0; i < selectedFiles.length; i++) {
            const prescriptionFileFormData = new FormData();
            prescriptionFileFormData.append(
              "prescriptionfile",
              selectedFiles[i],
              fileNames[i],
            );

            // Add prescription file
            const addPrescriptionFiles = await addPrescriptionFile(
              prescription.uuid,
              prescriptionFileFormData,
            );

            console.log(
              `Prescription FILE ${fileNames[i]} added successfully:`,
              addPrescriptionFiles,
            );
          }
        } else {
          console.warn("No files selected to upload");
        }
        // Reset form data
        setFormData({
          prescriptionType: "",
          name: "",
          frequency: "",
          interval: "",
          dosage: "",
          startDate: "",
          endDate: "",
          status: "",
        });
        setSelectedFiles([]); // Reset selected files
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error adding Prescription:", error);
      setError("Failed to add Prescription");

      // Handle specific error cases
      if (error.message === "Request failed with status code 409") {
        setErrorMessage("Prescription already exists");
        onFailed();
        setIsSubmitted(false);
        isModalOpen(false);
      } else if (error.message === "Network Error") {
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
    }
  };

  console.log(prescriptionData, "prescriptionData");
  console.log(formData, "formData");
  const [isHovering, setIsHovering] = useState(false);
  const FileUploadWithHover = () => {
    const handleMouseEnter = () => {
      setIsHovering(true);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    return (
      <div
        className="relative "
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {prescriptionFiles.length === 5 && isEdit ? (
          <div className="">
            <label className="relative mt-[33px] flex h-12 w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-[#007C85] bg-[#daf3f5] text-center font-bold text-[#101828]">
              <>
                <Image
                  className="mr-1 h-7 w-7"
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
              className="relative mt-[31px] flex h-12 w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-[#007C85] bg-[#daf3f5] text-center font-bold text-[#101828]"
            >
              <>
                {selectedFileNames.length > 0 ? (
                  // If files are selected, display filein.svg
                  <Image
                    className="mr-1 h-7 w-7"
                    width={50}
                    height={50}
                    src={"/svgs/filein.svg"}
                    alt=""
                  />
                ) : (
                  // If no files are selected, display folder-add.svg
                  <Image
                    className="mr-1 h-7 w-7"
                    width={50}
                    height={50}
                    src={"/svgs/folder-add.svg"}
                    alt=""
                  />
                )}
                <div className="flex text-nowrap pb-5 text-[12px]">
                  <p className="mt-2">Upload or Attach Files or</p>
                  <p className="ml-1 mt-2 text-blue-500 underline decoration-solid">
                    Browse
                  </p>
                </div>
                <span className="absolute bottom-2 ml-10 text-[10px] font-normal text-[#667085]">
                  {selectedFileNames.length === 0 ? (
                    // Display "Maximum File Size: 10MB" if no files are attached
                    <span>Maximum File Size: 15MB</span>
                  ) : (
                    // Display the file name if one file is attached, or the number of files if more than one are attached
                    <span>
                      {selectedFiles.length < 5
                        ? // Display the file name if the number of files is less than or equal to 5
                          selectedFiles.length === 1
                          ? selectedFileNames[0]
                          : `${selectedFiles.length}/${numFilesCanAdd} files attached`
                        : // Display a message indicating that the maximum limit has been reached
                          `Maximum of 5 files added`}
                    </span>
                  )}
                </span>
              </>
            </label>
            <input
              type="file"
              id="imageUpload"
              multiple={true}
              accept=".jpeg,.jpg,.png,.pdf"
              className="hidden"
              name="file"
              onChange={(e) => handleFile(e)}
            />
            {isHovering && selectedFiles.length > 0 && (
              <div className="absolute left-0 w-[290px] rounded-md bg-[#4E4E4E] p-2 text-[13px] text-white shadow-md">
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
    );
  };
  return (
    <>
      <div className="h-auto flex-col flex relative flex-grow w-[676px]">
        {isLoading && isEdit ? (
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
              <div className="mt-5 h-[380px] md:px-8">
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
              <div className="flex h-[70px] w-full flex-col justify-start rounded-md bg-[#ffffff]">
                <div className="flex items-center justify-between">
                  <h2 className="p-title mt-7 pl-10 text-left text-[#071437]">
                    {isEdit ? "Update" : "Add"} Prescription Schedule
                  </h2>
                  <X
                    onClick={() => isModalOpen(false)}
                    className="mr-9 mt-6 flex h-6 w-6 cursor-pointer items-center text-black"
                  />
                </div>
                <p className="pb-10 pl-10 pt-2 text-sm text-gray-600">
                  Submit your log details.
                </p>
              </div>
              <div className="mb-9 pt-4">
                <div className="mt-5 max-h-[300px] w-full md:px-10">
                  <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="last-name"
                        className="text-md required-field block font-bold leading-6 text-gray-900"
                      >
                        Type
                      </label>
                      <div className="mt-2.5 flex">
                        <select
                          required
                          className="block h-12 w-full cursor-pointer rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                          name="prescriptionType"
                          value={formData.prescriptionType}
                          onChange={handleDropDownChange}
                        >
                          <option value="" disabled>
                            Select Type
                          </option>
                          <option value="ASCH">Scheduled</option>
                          <option value="PRN">PRN</option>
                        </select>
                        <Image
                          className="pointer-events-none absolute ml-[255px] mt-4"
                          width={20}
                          height={20}
                          src={"/svgs/chevron-up.svg"}
                          alt={""}
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="first-name"
                        className="text-md required-field block font-bold leading-6 text-gray-900"
                      >
                        MEDICINE NAME
                      </label>
                      <div className="mt-2.5">
                        <input
                          type="text"
                          required
                          className="block h-12 w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                          placeholder="input medicine name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div
                      className={`${formData.prescriptionType === "PRN" ? "" : "hidden"}`}
                    >
                      <label
                        htmlFor="first-name"
                        className="text-md required-field block font-bold leading-6 text-gray-900"
                      >
                        START DATE
                      </label>
                      <div className="mt-2.5">
                        <input
                          type="date"
                          required={formData.prescriptionType === "PRN"}
                          className="block h-12 w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                          placeholder="input medicine name"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div
                      className={`${formData.prescriptionType === "PRN" ? "" : "hidden"}`}
                    >
                      <label
                        htmlFor="first-name"
                        className="text-md required-field block font-bold leading-6 text-gray-900"
                      >
                        END DATE
                      </label>
                      <div className="mt-2.5">
                        <input
                          type="date"
                          required={formData.prescriptionType === "PRN"}
                          className="block h-12 w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                          placeholder="input medicine name"
                          name="endDate"
                          value={formData.endDate}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="last-name"
                        className="text-md required-field block font-bold leading-6 text-gray-900"
                      >
                        FREQUENCY
                      </label>
                      <div className="mt-2.5 flex">
                        <select
                          required
                          className="block h-12 w-full cursor-pointer rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                          name="frequency"
                          value={formData.frequency}
                          onChange={handleDropDownChange}
                        >
                          <option value="">Select Frequency</option>
                          <option value="Once Daily">Once Daily</option>
                          <option value="Twice Daily">Twice Daily</option>
                          <option value="Thrice Daily">Thrice Daily</option>
                        </select>
                        <Image
                          className="pointer-events-none absolute ml-[255px] mt-4"
                          width={20}
                          height={20}
                          src={"/svgs/chevron-up.svg"}
                          alt={""}
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="first-name"
                        className="text-md required-field block font-bold leading-6 text-gray-900"
                      >
                        INTERVAL
                      </label>
                      <div className="mt-2.5">
                        <input
                          type="text"
                          required
                          className="block h-12 w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                          placeholder="input interval"
                          name="interval"
                          value={formData.interval}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="last-name"
                        className="text-md required-field block font-bold leading-6 text-gray-900"
                      >
                        DOSAGE
                      </label>
                      <div className="mt-2.5">
                        <input
                          type="text"
                          required
                          className="placeholder:text-gray-400t block h-12 w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"
                          placeholder="input dosage"
                          name="dosage"
                          value={formData.dosage}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="status"
                        className="text-md required-field block pb-2 font-bold leading-6 text-gray-900"
                      >
                        STATUS
                      </label>
                      <div className="relative">
                        <select
                          id="status"
                          className="block h-12 w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                          name="status"
                          value={formData.status}
                          onChange={handleDropDownChange}
                          required
                        >
                          <option value="">Select Status</option>
                          <option value="active">ACTIVE</option>
                          <option value="inactive">INACTIVE</option>
                        </select>
                        {/* <
                    className="absolute top-0 right-0 mt-3 mr-3 pointer-events-none"
                    src="svgs/chevron-up.svg"
                    alt="Dropdown Arrow"
                    style={{ width: '1rem', height: '1rem' }}
                      /> */}
                        <Image
                          className="pointer-events-none absolute right-0 top-0 mr-3 mt-3"
                          width={20}
                          height={20}
                          src={"/svgs/chevron-up.svg"}
                          alt={""}
                        />
                      </div>
                    </div>
                    <div className="filehover">
                      <FileUploadWithHover />
                    </div>
                  </div>
                </div>
              </div>
              <div className="">
                <div className="mr-10 flex justify-end">
                  <button
                    onClick={() => isModalOpen(false)}
                    disabled={isSubmitted}
                    type="button"
                    className={` ${isSubmitted && "cursor-not-allowed"} mr-4 h-[45px] w-[150px] rounded-sm bg-[#F3F3F3] font-medium text-black hover:bg-[#D9D9D9]`}
                  >
                    Cancel
                  </button>
                  <button
                    disabled={isSubmitted}
                    type="submit"
                    className={` ${isSubmitted && "cursor-not-allowed"} h-[45px] w-[150px] rounded-sm bg-[#007C85] px-3 py-2 font-medium text-[#ffff] hover:bg-[#03595B]`}
                  >
                    {isEdit ? "Update" : "Submit"}
                  </button>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </>
  );
};
