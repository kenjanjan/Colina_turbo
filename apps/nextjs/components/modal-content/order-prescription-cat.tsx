import Image from "next/image";
import { useEffect, useState } from "react";
import { toast, useToast } from "../ui/use-toast";
import { cn } from "@/lib/utils";
import {
  addPrescriptionFile,
  createPrescriptionOfPatient,
} from "@/app/api/prescription-api/prescription.api";
import { useParams, useRouter } from "next/navigation";
import { ToastAction } from "../ui/toast";

const PrescriptionOrderCategory = ({
  data,
  tab,
  setIsOrder,
  isModalOpen,
  setIsOrderModalOpen,
  isPrn,
  setIsPrn,
  appointmentId = "",
  onSuccess,
  onFailed,
  setErrorMessage,
}: {
  data?: any;
  tab?: string;
  setIsOrder?: any;
  isModalOpen?: any;
  setIsOrderModalOpen?: any;
  isPrn?: boolean;
  setIsPrn?: any;
  appointmentId?: string;
  onSuccess: () => void;
  onFailed: () => void;
  setErrorMessage?: any;
}) => {
  const params = useParams<{
    id: any;
    tag: string;
    item: string;
  }>();
  const { toast } = useToast();
  const patientId = params.id.toUpperCase();
  const router = useRouter();
  const [formFiles, setFormFiles] = useState<any[]>([]); //
  const [selectedFileNames, setSelectedFileNames] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [numFilesCanAdd, setNumFilesCanAdd] = useState<number>(5);
  const [error, setError] = useState<string>("");
  console.log(appointmentId, "appointmentId");
  const [selectedFiles, setSelectedFormFiles] = useState<File[]>([]);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [fileTypes, setFileTypes] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    prescriptionType: "",
    name: "",
    frequency: "",
    interval: "",
    dosage: "",
    dateIssued: "",
    startDate: "",
    endDate: "",
    status: "",
  });

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      prescriptionType: isPrn ? "PRN" : "ASCH",
    }));
  }, [isPrn]);

  console.log(formData, "formData");

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
          console.log(formFiles, "formFiles formFiles formFiles");
          // Set selected file names
          setSelectedFileNames(newFileNames);
          console.log(selectedFileNames, "selected file names");
          // You can handle base64 conversion here if needed
        }
      });

      // Update state variables with arrays

      setSelectedFormFiles(newFiles);
      setFileNames(newFileNames);
      setFileTypes(newFileTypes);
    } else {
      console.warn("No files selected");
    }
    setIsSubmitted(false);
  };

  const parseDate = (dateString: any) => {
    const dateObj = new Date(dateString);
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0"); // Adding 1 because getMonth() is zero-indexed
    const day = dateObj.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);

    try {
      const prescription = await createPrescriptionOfPatient(
        patientId,
        formData,
        appointmentId,
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
        dateIssued: "",
        startDate: "",
        endDate: "",
        status: "",
      });
      setSelectedFileNames([]); // Reset selected files
      setIsOrderModalOpen(false);
      onSuccess();
    } catch (error: any) {
      console.error("Error adding Prescription:", error);
      setError("Failed to add Prescription");

      // Handle specific error cases
      if (error.message === "Request failed with status code 409") {
        setErrorMessage("Prescription already exists");
        setIsOrderModalOpen(false);
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
  const handleDropDownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      {!isPrn && (
        <p
          className="sub-title mb-2 ml-auto w-fit cursor-pointer text-end"
          onClick={() => {
            setIsPrn(true);
          }}
        >
          Go to Prescription PRN
        </p>
      )}
      {isPrn && (
        <p
          className="sub-title mb-2 ml-auto w-fit cursor-pointer"
          onClick={() => {
            setIsPrn(false);
          }}
        >
          Go to Prescription Scheduled
        </p>
      )}
      <div className="grid grid-cols-2 gap-x-5 gap-y-2">
        <div className="flex w-full flex-col gap-2">
          <h1 className="required-field text-[20px] font-medium">
            Medicine Name
          </h1>
          <div className="relative flex">
            <input
              type="text"
              required
              readOnly={tab ? tab.length > 0 : false}
              className="block h-12 w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
              placeholder="input medicine name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="flex w-full flex-col gap-2">
          <h1 className="required-field text-[20px] font-medium">Frequency</h1>
          <div className="flex relative">
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
              className="pointer-events-none absolute right-0 top-0 mr-3 mt-3"
              width={20}
              height={20}
              src={"/svgs/chevron-up.svg"}
              alt={""}
            />
          </div>
        </div>
        <div className="flex w-full flex-col gap-2">
          <h1 className="required-field text-[20px] font-medium">Interval</h1>
          <div className="relative flex">
            <input
              type="text"
              required
              readOnly={tab ? tab.length > 0 : false}
              className="block h-12 w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
              placeholder="input interval"
              name="interval"
              value={formData.interval}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="flex w-full flex-col gap-2">
          <h1 className="required-field text-[20px] font-medium">Dosage</h1>
          <div className="relative flex">
            <input
              type="text"
              required
              readOnly={tab ? tab.length > 0 : false}
              className="block h-12 w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
              placeholder="input dosage"
              name="dosage"
              value={formData.dosage}
              onChange={handleChange}
            />
          </div>
        </div>
        {!isPrn && (
          <div className="flex w-full flex-col gap-2">
            <h1 className="required-field text-[20px] font-medium">
              Date Issued
            </h1>
            <div className="relative flex">
              <input
                required
                type="date"
                readOnly={tab ? tab.length > 0 : false}
                className="block h-12 w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                name="dateIssued"
                value={parseDate(formData.dateIssued)}
                onChange={handleChange}
              />
              <Image
                className="pointer-events-none absolute right-0 top-0 mr-3 mt-3"
                width={20}
                height={20}
                src={"/svgs/calendark.svg"}
                alt={""}
              />
            </div>
          </div>
        )}

        <div className="flex w-full flex-col gap-2">
          <h1 className="required-field text-[20px] font-medium">Status</h1>
          <div className="relative">
            <select
              required
              value={formData.status}
              name="status"
              onChange={handleDropDownChange}
              disabled={tab ? tab.length > 0 : false}
              className="block h-12 w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
            >
              <option value="">Select Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <Image
              className="pointer-events-none absolute right-0 top-0 mr-3 mt-3"
              width={20}
              height={20}
              src={"/svgs/chevron-up.svg"}
              alt={""}
            />
          </div>
        </div>
        {formFiles.length === 5 ? (
          <div></div>
        ) : (
          <div className={cn("col-span-2 mt-5", { "col-span-1": isPrn })}>
            <label
              htmlFor="imageUpload"
              className={cn(
                "relative flex h-[99px] w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-[#007C85] bg-[#daf3f5] text-center font-medium text-[#101828]",
                { "h-[62px]": isPrn },
              )}
            >
              <div className="flex flex-col items-center justify-center">
                <div className="flex">
                  {selectedFileNames.length > 0 ? (
                    // If files are selected, display filein.svg
                    <Image
                      className="mr-1"
                      width={21.51}
                      height={20}
                      src={"/svgs/filein.svg"}
                      alt=""
                    />
                  ) : (
                    // If no files are selected, display folder-add.svg
                    <Image
                      className="mr-1"
                      width={21.51}
                      height={20}
                      src={"/svgs/folder-add.svg"}
                      alt=""
                    />
                  )}
                  <div className="flex">
                    <p className="mt-2 text-[15px] font-medium">
                      Upload or Attach Files or{" "}
                      <span className="ml-1 mt-2 text-[15px] font-medium text-blue-500 underline decoration-solid">
                        Browse
                      </span>
                    </p>
                  </div>
                </div>
                <span className="w-[200px] truncate text-[10px] font-normal text-[#667085]">
                  {selectedFileNames.length === 0 ? (
                    // Display "Maximum File Size: 10MB" if no files are attached
                    <span className="sub-title">Maximum File Size: 15MB</span>
                  ) : (
                    // Display the file name if one file is attached, or the number of files if more than one are attached
                    <span className="">
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
              </div>
            </label>
            <input
              type="file"
              id="imageUpload"
              multiple={true}
              accept="image/*,.pdf"
              className="hidden"
              disabled={tab ? tab.length > 0 : false}
              name="file"
              onChange={(e) => handleFile(e)}
            />
          </div>
        )}
      </div>

      {isPrn && (
        <div>
          <hr className="my-5 flex" />
          <div className="grid grid-cols-7 gap-x-5">
            <div className="sub-title col-span-1">Duration:</div>
            <div className="col-span-3">
              <div className="flex w-full flex-col gap-2">
                <h1 className="required-field text-[20px] font-medium">
                  Start Date
                </h1>
                <div className="relative flex">
                  <input
                    required
                    type="date"
                    readOnly={tab ? tab.length > 0 : false}
                    className="block h-12 w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    name="startDate"
                    value={parseDate(formData.startDate)}
                    onChange={handleChange}
                  />
                  <Image
                    className="pointer-events-none absolute right-0 top-0 mr-3 mt-3"
                    width={20}
                    height={20}
                    src={"/svgs/calendark.svg"}
                    alt={""}
                  />
                </div>
              </div>
            </div>
            <div className="col-span-3">
              <div className="flex w-full flex-col gap-2">
                <h1 className="required-field text-[20px] font-medium">
                  End Date
                </h1>
                <div className="relative flex">
                  <input
                    required
                    type="date"
                    readOnly={tab ? tab.length > 0 : false}
                    className="block h-12 w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    name="endDate"
                    value={parseDate(formData.endDate)}
                    onChange={handleChange}
                  />
                  <Image
                    className="pointer-events-none absolute right-0 top-0 mr-3 mt-3"
                    width={20}
                    height={20}
                    src={"/svgs/calendark.svg"}
                    alt={""}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-5 flex w-full justify-end">
        <button
          onClick={() => {
            if (setIsOrder) {
              setIsOrder(false);
            } else {
              isModalOpen(false);
            }
            setIsOrderModalOpen ? setIsOrderModalOpen(false) : null;
          }}
          disabled={isSubmitted}
          type="button"
          className={` ${isSubmitted && "cursor-not-allowed"} mr-4 h-[45px] w-[150px] rounded-sm bg-[#F3F3F3] font-medium text-black hover:bg-[#D9D9D9]`}
        >
          Cancel
        </button>
        <button
          disabled={isSubmitted}
          type="submit"
          className={`${isSubmitted && "cursor-not-allowed"} h-[45px] w-[150px] rounded-sm bg-[#007C85] px-3 py-2 font-medium text-[#ffff] hover:bg-[#03595B]`}
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default PrescriptionOrderCategory;
