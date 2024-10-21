"use client";

import { X } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import {
  updateLabResultOfPatient,
  createLabResultOfPatient,
  addLabFile,
  fetchLabOrders,
} from "@/app/api/lab-results-api/lab-results.api";
import { useParams, useRouter } from "next/navigation";
import {
  fetchLabResultFiles,
  getCurrentFileCountFromDatabase,
} from "@/app/api/lab-results-api/lab-results.api";
import { useToast } from "@/components/ui/use-toast";
interface Modalprops {
  orderUuid?: string;
  label?: string;
  isEdit: any;
  labResultData: any;
  setIsUpdated: any;
  isModalOpen: (isOpen: boolean) => void;
  onSuccess: () => void;
  appointmentData: any;
  setIsViewLabResult?: any;
}
interface LabFile {
  file: any; // Assuming file property exists for the key
  filename: string;
  data: Uint8Array;
  file_uuid: string;
}

export const LabresultsModalContent = ({
  orderUuid,
  label,
  isEdit,
  labResultData,
  setIsUpdated,
  // isOpen,
  isModalOpen,
  onSuccess,
  appointmentData,
  setIsViewLabResult,
}: Modalprops) => {
  const params = useParams<{
    id: any;
    tag: string;
    item: string;
  }>();

  const patientId = params?.id?.toUpperCase();
  const [labFiles, setLabFiles] = useState<any[]>([]); //

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    date: labResultData.labResults_date || "",
    hemoglobinA1c: labResultData.labResults_hemoglobinA1c || "",
    fastingBloodGlucose: labResultData.labResults_fastingBloodGlucose || "",
    totalCholesterol: labResultData.labResults_totalCholesterol || "",
    ldlCholesterol: labResultData.labResults_ldlCholesterol || "",
    hdlCholesterol: labResultData.labResults_hdlCholesterol || "",
    triglycerides: labResultData.labResults_triglycerides || "",
    orderUuid: orderUuid ? orderUuid : "",
  });
  let headingText = "";
  console.log(formData, "formData");
  if (isEdit) {
    headingText = "Update Laboratory Result";
  } else if (label === "ViewLabResult") {
    headingText = "Laboratory Result";
  } else {
    headingText = "Add Laboratory Result";
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "appointmentDate") {
      setDate(value);
      labResultData.date = value;
      console.log(value, "lab date");
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Define a state to track the selected filenames
  const [selectedFileNames, setSelectedFileNames] = useState<string[]>([]);

  const [selectedFiles, setSelectedLabFiles] = useState<File[]>([]);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [fileTypes, setFileTypes] = useState<string[]>([]);
  const { toast } = useToast();
  const toggleMaxSizeToast = (): void => {
    setIsSubmitted(false);
    toast({
      variant: "destructive",
      title: "File Size Too Big!",
      description: `Total size of selected files exceeds the limit of 15MB!`,
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
  const [numFilesCanAdd, setNumFilesCanAdd] = useState<number>(5);

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
          console.log(labFiles, "labFiles labFiles labFiles");
          // Set selected file names
          setSelectedFileNames(newFileNames);
          console.log(selectedFileNames, "selected file names");
          // You can handle base64 conversion here if needed
        }
      });

      // Update state variables with arrays

      setSelectedLabFiles(newFiles);
      setFileNames(newFileNames);
      setFileTypes(newFileTypes);
    } else {
      console.warn("No files selected");
    }
    setIsSubmitted(false);
  };

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);
    const getUuid = labResultData.labResults_uuid;
    if (getUuid) {
      const currentFileCount = await getCurrentFileCountFromDatabase(getUuid);
      console.log("Current file count:", currentFileCount);
      // Define the maximum allowed files based on the current count
      const maxAllowedFiles = currentFileCount === 0 ? 5 : 5 - currentFileCount;
      if (selectedFiles.length > maxAllowedFiles) {
        toggleMaxFilesToast(maxAllowedFiles);
        return;
      }
      console.log("FILES TO ADD", maxAllowedFiles);

      console.log("Lab UUID:", getUuid);
    }
    try {
      if (isEdit) {
        await updateLabResultOfPatient(
          labResultData.labResults_uuid,
          formData,
          router,
        );

        // Iterate through each selected file
        if (selectedFiles && selectedFiles.length > 0) {
          // Iterate through each selected file
          for (let i = 0; i < selectedFiles.length; i++) {
            const labFileFormData = new FormData();
            labFileFormData.append("labfile", selectedFiles[i], fileNames[i]);

            // Add lab file
            const addLabFiles = await addLabFile(
              getUuid,
              labFileFormData,
              router,
            );

            console.log(
              `Lab FILE ${fileNames[i]} added successfully:`,
              addLabFiles,
            );
          }
        } else {
          console.warn("No files selected to upload");
        }
        setIsUpdated(true);
        onSuccess();
        isModalOpen(false);
      } else {
        // Create the lab result
        const labResult = await createLabResultOfPatient(
          patientId,
          formData,
          router,
        );
        console.log("Lab Result added successfully:", labResult);
        const getUuid = labResult.uuid;
        console.log("Lab UUID:", getUuid);

        // Iterate through each selected file
        if (selectedFiles && selectedFiles.length > 0) {
          // Iterate through each selected file
          for (let i = 0; i < selectedFiles.length; i++) {
            const labFileFormData = new FormData();
            labFileFormData.append("labfile", selectedFiles[i], fileNames[i]);

            // Add lab file
            const addLabFiles = await addLabFile(
              getUuid,
              labFileFormData,
              router,
            );

            console.log(
              `Lab FILE ${fileNames[i]} added successfully:`,
              addLabFiles,
            );
          }
        } else {
          console.warn("No files selected to upload");
        }
        // Reset form data
        setFormData({
          date: "",
          hemoglobinA1c: "",
          fastingBloodGlucose: "",
          totalCholesterol: "",
          ldlCholesterol: "",
          hdlCholesterol: "",
          triglycerides: "",
          orderUuid: "",
        });
        onSuccess();
      }
    } catch (error) {
      console.error("Error adding Lab Result:", error);
      setError("Failed to add Lab Result");
    }
    setIsSubmitted(false);
  };
  //for edit files and storing num of files in the state
  useEffect(() => {
    // Initialize selected file names array
    setSelectedFileNames([]);
    if (labFiles && labFiles.length > 0) {
      // Push file names to selectedFileNames array
      for (let file of labFiles) {
        // Only push the filename if it's defined
        if (file && file.filename) {
          selectedFileNames.push(file.filename);
        }
      }

      console.log(selectedFileNames, "selected file names");
      console.log(labFiles, "labFiles labFiles labFiles");
      const maxAllowedFiles = 5 - selectedFileNames.length;
      setNumFilesCanAdd(maxAllowedFiles);
      // Set selected file names
      setSelectedFileNames(selectedFileNames);
    } else {
      // Log a message when there are no files in labFiles
      console.log("No files in labFiles");
      // Optionally, you can clear the selectedFileNames state here
      setSelectedFileNames([]);
    }
  }, [labFiles, setSelectedFileNames]);
  // for fetching data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchLabResultFiles(
          labResultData.labResults_uuid,
          router,
        );

        // Only proceed if response.data is not null or empty
        if (response.data && response.data.length > 0) {
          setLabFiles(response.data);
          console.log(response.data, "LAB.data");
          const maxAllowedFiles = 5 - labFiles.length;
          setNumFilesCanAdd(maxAllowedFiles);
          setIsLoading(false);
        }
      } catch (error: any) {
        setError(error.message);
      }
    };

    // Call fetchData and fetchFile only if `labResultData.labResults_uuid` changes and is not null
    if (labResultData.labResults_uuid) {
      fetchData();
    }
  }, [labResultData.labResults_uuid]);
  const [isHovering, setIsHovering] = useState(false);
  const FileUploadWithHover = () => {
    const handleMouseEnter = () => {
      setIsHovering(true);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    console.log(appointmentData, "appointmentData");

    return (
      <div
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {labFiles.length === 5 && isEdit ? (
          <div className="">
            <label className="relative flex w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-[#007C85] bg-[#daf3f5] text-center font-bold text-[#101828]">
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
              className="relative mt-[33px] flex h-12 w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-[#007C85] bg-[#daf3f5] text-center font-bold text-[#101828]"
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

  interface Order {
    orderuuid: string;
  }
  const [orderList, setOrderlist] = useState<Order[]>([]);
  const [term, setTerm] = useState("");
  const [isReferenceUIDChecked, setIsReferenceUIDChecked] = useState(false);
  const [isReferenceOpen, setIsReferenceOpen] = useState(false);
  const handleReferenceUIDCheckbox = () => {
    setIsReferenceUIDChecked(!isReferenceUIDChecked);
  };
  const handleReferenceSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTerm(e.target.value);
    setIsReferenceOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchLabOrders(patientId, router);
        if (response) {
          setOrderlist(response.data);
        }
      } catch (error) {}
    };
    fetchData();
  }, []);
  const filteredOrders = Array.isArray(orderList)
    ? orderList.filter((order) =>
        order.orderuuid.toLowerCase().includes(term.toLowerCase()),
      )
    : [];
  console.log(orderList, "orderliost");
  console.log(formData, "formdata");
  console.log(label, "label");
  console.log(appointmentData, "appointmentData");
  console.log(orderUuid, "orderUuid");
  return (
    <>
      <div className="min-w-[676px]">
        {isLoading && isEdit ? (
          // Loading state
          <>
            <div className="flex h-[70px] w-full flex-col justify-start rounded-md bg-[#ffffff]">
              <div className="flex items-center justify-between">
                <h2 className="p-title mt-7 pl-10 text-left text-[#071437]"></h2>
                <X
                  onClick={() => {
                    isSubmitted ? null : isModalOpen(false),
                      setIsViewLabResult(false);
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
                    {headingText}
                  </h2>
                  <X
                    onClick={() => isModalOpen(false)}
                    className="mr-9 mt-6 flex h-6 w-6 cursor-pointer items-center text-black"
                  />
                </div>
                <p className="pb-10 pl-10 pt-2 text-sm text-gray-600">
                  {isEdit ? "Update" : "Submit"} your log details.
                </p>
              </div>
              {label === "labResults" && (
                <div className="ml-10 mt-5 flex gap-1.5">
                  <input
                    id="checkbox"
                    type="checkbox"
                    onChange={handleReferenceUIDCheckbox}
                    className="cursor-pointer"
                  />
                  <label
                    htmlFor="checkbox"
                    className="sub-title cursor-pointer"
                  >
                    Link to existing order
                  </label>
                </div>
              )}
              {isReferenceUIDChecked && (
                <div className="mt-5 flex flex-col px-10">
                  <input
                    required
                    type="text"
                    value={term}
                    onChange={handleReferenceSearch}
                    placeholder="example: ORDER UID-123123123123"
                    className="block h-12 w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                  />
                  {term && isReferenceOpen && (
                    <div className="relative z-50">
                      <div className="absolute mt-2 max-h-[200px] w-full overflow-y-auto rounded-lg bg-white px-4 py-2 drop-shadow-lg">
                        <p className="sub-title !font-semibold">Select</p>
                        {filteredOrders.length > 0 ? (
                          filteredOrders.map((order: any, index) => (
                            <div
                              key={index}
                              onClick={() => {
                                setFormData((prevData) => ({
                                  ...prevData,
                                  orderUuid: order.orderuuid,
                                }));
                                setTerm(order.orderuuid);
                                setIsReferenceOpen(false);
                              }}
                              className="cursor-pointer space-x-2 font-semibold hover:text-[#03595B]"
                            >
                              <p>{order.orderuuid}</p>
                            </div>
                          ))
                        ) : (
                          <p>No matching orders found.</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div className="mb-9 pt-4">
                <div className="mt-5 md:px-10">
                  <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="first-name"
                        className="text-md required-field block font-bold leading-6 text-gray-900"
                      >
                        HEMOGLOBIN A1c
                      </label>
                      <div className="mt-2.5">
                        <input
                          value={
                            label === "ViewLabResult"
                              ? appointmentData.labresulthemoglobina1c
                              : formData.hemoglobinA1c
                          }
                          readOnly={label === "ViewLabResult"}
                          type="text"
                          onChange={handleChange}
                          required
                          name="hemoglobinA1c"
                          className="block h-12 w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                          placeholder="input hemoglobin a1c"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="last-name"
                        className="text-md required-field block font-bold leading-6 text-gray-900"
                      >
                        FASTING BLOOD GLUCOSE
                      </label>
                      <div className="mt-2.5">
                        <input
                          type="text"
                          onChange={handleChange}
                          value={
                            label === "ViewLabResult"
                              ? appointmentData.labresultfastingbloodglucose
                              : formData.fastingBloodGlucose
                          }
                          readOnly={label === "ViewLabResult"}
                          required
                          name="fastingBloodGlucose"
                          className="block h-12 w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                          placeholder="input fasting blood glucose"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="first-name"
                        className="text-md required-field block font-bold leading-6 text-gray-900"
                      >
                        TOTAL CHOLESTEROL
                      </label>
                      <div className="mt-2.5">
                        <input
                          value={
                            label === "ViewLabResult"
                              ? appointmentData.labresulttotalcholesterol
                              : formData.totalCholesterol
                          }
                          readOnly={label === "ViewLabResult"}
                          type="text"
                          required
                          name="totalCholesterol"
                          onChange={handleChange}
                          className="block h-12 w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                          placeholder="input total cholesterol"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="last-name"
                        className="text-md required-field block font-bold leading-6 text-gray-900"
                      >
                        LDL CHOLESTEROL
                      </label>
                      <div className="mt-2.5">
                        <input
                          type="text"
                          value={
                            label === "ViewLabResult"
                              ? appointmentData.labresultldlcholesterol
                              : formData.ldlCholesterol
                          }
                          readOnly={label === "ViewLabResult"}
                          required
                          name="ldlCholesterol"
                          onChange={handleChange}
                          className="placeholder:text-gray-400t block h-12 w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"
                          placeholder="input ldl cholesterol"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="first-name"
                        className="text-md required-field block font-bold leading-6 text-gray-900"
                      >
                        HDL CHOLESTEROL
                      </label>
                      <div className="mt-2.5">
                        <input
                          value={
                            label === "ViewLabResult"
                              ? appointmentData.labresulthdlcholesterol
                              : formData.hdlCholesterol
                          }
                          readOnly={label === "ViewLabResult"}
                          type="text"
                          onChange={handleChange}
                          required
                          name="hdlCholesterol"
                          className="block h-12 w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                          placeholder="input hdl cholesterol"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="last-name"
                        className="text-md required-field block font-bold leading-6 text-gray-900"
                      >
                        TRIGLYCERIDES
                      </label>
                      <div className="mt-2.5">
                        <input
                          value={
                            label === "ViewLabResult"
                              ? appointmentData.labresulttriglycerides
                              : formData.triglycerides
                          }
                          readOnly={label === "ViewLabResult"}
                          type="text"
                          name="triglycerides"
                          onChange={handleChange}
                          required
                          className="placeholder:text-gray-400t block h-12 w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"
                          placeholder="input triglycerides"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="last-name"
                        className="text-md required-field block font-bold leading-6 text-gray-900"
                      >
                        DATE
                      </label>

                      <div className="relative mt-2.5">
                        <input
                          required
                          type="date"
                          name="date"
                          value={
                            label === "ViewLabResult"
                              ? appointmentData.labresultdate
                              : formData.date
                          }
                          readOnly={label === "ViewLabResult"}
                          onChange={handleChange}
                          className="placeholder:text-gray-400t block h-12 w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"
                          placeholder="input triglycerides"
                        />
                        <Image
                          className="pointer-events-none absolute right-0 top-0 mr-3 mt-3.5"
                          width={20}
                          height={20}
                          src={"/svgs/calendark.svg"}
                          alt={""}
                        />
                      </div>
                    </div>
                    {label === "LabResultTab" && (
                      <div className="filehover">
                        <FileUploadWithHover />
                      </div>
                    )}
                    {/* {labFiles.length === 5 && isEdit ? (
                      <div className="">
                        <label className="relative h-12 w-full flex justify-center items-center rounded-md cursor-pointer text-center text-[#101828] font-bold mt-[33px] bg-[#daf3f5] border-[#007C85] border-dashed border-2">
                          <>
                            <Image
                              className="w-10 h-10 mr-1"
                              width={50}
                              height={50}
                              src={"/svgs/filein.svg"}
                              alt=""
                            />
                            <div className="flex pb-5 text-nowrap text-[12px]">
                              <p className="mt-2">Maximum Files Uploaded</p>
                            </div>
                          </>
                        </label>
                      </div>
                    ) : (
                      <div className="">
                        <label
                          htmlFor="imageUpload"
                          className="relative h-12 w-full flex justify-center items-center rounded-md cursor-pointer text-center text-[#101828] font-bold mt-[33px] bg-[#daf3f5] border-[#007C85] border-dashed border-2"
                        >
                          <>
                            {selectedFileNames.length > 0 ? (
                              // If files are selected, display filein.svg
                              <Image
                                className="w-10 h-10 mr-1"
                                width={50}
                                height={50}
                                src={"/svgs/filein.svg"}
                                alt=""
                              />
                            ) : (
                              // If no files are selected, display folder-add.svg
                              <Image
                                className="w-10 h-10 mr-1"
                                width={50}
                                height={50}
                                src={"/svgs/folder-add.svg"}
                                alt=""
                              />
                            )}
                            <div className="flex pb-5 text-nowrap text-[12px]">
                              <p className="mt-2">Upload or Attach Files or</p>
                              <p className="underline decoration-solid text-blue-500 ml-1 mt-2">
                                Browse
                              </p>
                            </div>
                            <span className="text-[10px] font-normal absolute bottom-2 text-[#667085] ml-10">
                              {selectedFileNames.length === 0 ? (
                                // Display "Maximum File Size: 10MB" if no files are attached
                                <span>Maximum File Size: 15MB</span>
                              ) : (
                                // Display the file name if one file is attached, or the number of files if more than one are attached
                                <span>
                                  {selectedFileNames.length < 5
                                    ? // Display the file name if the number of files is less than or equal to 5
                                      selectedFileNames.length === 1
                                      ? selectedFileNames[0]
                                      : `${selectedFileNames.length}/5 files attached`
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
                          accept="image/*,.pdf"
                          className="hidden"
                          name="file"
                          onChange={(e) => handleFile(e)}
                        />
                        {isHovering && (
                          <div className="absolute bg-[#4E4E4E] p-2 text-white rounded-md shadow-md bottom-[-90px] left-0">
                            <p>Minimum file size of 1 MB</p>
                            <p>Maximum file size of 100 MB</p>
                            <p>Supported formats: PNG, JPG, JPEG</p>
                          </div>
                        )}
                      </div>
                    )} */}
                  </div>
                </div>
                {label === "LabResultTab" ||
                  (label === "labResults" && (
                    <div className="pt-10">
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
                          Submit
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </form>
          </>
        )}
      </div>
    </>
  );
};
