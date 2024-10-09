import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { toast as sonner } from "sonner";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import {
  addAppointmentFile,
  getCurrentAppointmentFileCountFromDatabase,
} from "@/app/api/appointments-api/appointments.api";
import { useRouter } from "next/navigation";

interface ModalProps {
  appointmentUuid: any;
  isModalOpen: (isOpen: boolean) => void;
  onClose: any;
  onSuccess: any;
}
interface AppointmentFile {
  file: any; // Assuming file property exists for the key
  filename: string;
  data: Uint8Array;
  file_uuid: string;
}

export const NofileviewAppointmentsModalContent = ({
  appointmentUuid,
  isModalOpen,
  onClose, // Receive the callback function
  onSuccess,
}: ModalProps) => {
  const { toast } = useToast();

  const [appointmentFiles, setAppointmentFiles] = useState<any[]>([]); //
  const defaultAppointmentFiles = Array.isArray(appointmentFiles)
    ? appointmentFiles
    : [];
  const [selectedFileNames, setSelectedFileNames] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [fileTypes, setFileTypes] = useState<string[]>([]);
  const router = useRouter();
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitted(true);
    e.preventDefault();
    const getUuid = appointmentUuid;

    console.log("submit clicked");
    if (selectedFiles.length === 0) {
      toggleToast();
      return;
    }
    const currentFileCount =
      await getCurrentAppointmentFileCountFromDatabase(getUuid);
    const maxAllowedFiles = 5 - currentFileCount;

    console.log("FILES TO ADD", maxAllowedFiles);

    if (selectedFiles.length > maxAllowedFiles) {
      toggleMaxFilesToast(maxAllowedFiles);
      return;
    }
    try {
      console.log(getUuid, "getUuid");
      // Iterate through each selected file
      if (selectedFiles && selectedFiles.length > 0) {
        // Iterate through each selected file
        for (let i = 0; i < selectedFiles.length; i++) {
          const appointmentFormData = new FormData();
          appointmentFormData.append(
            "appointmentfile",
            selectedFiles[i],
            fileNames[i],
          );

          const addAppointmentFiles = await addAppointmentFile(
            getUuid,
            appointmentFormData,
          );

          console.log(
            `Appointment FILE ${fileNames[i]} added successfully:`,
            addAppointmentFiles,
          );
        }
        onSuccess();
        onClose(false);
        // Call the onSuccess callback function
      } else {
        console.warn("No files selected to upload");
      }
    } catch (error) {
      console.error("Error adding Appointment:", error);
    }
    setIsSubmitted(false);
  };
  const [numFilesCanAdd, setNumFilesCanAdd] = useState<number>(5);

  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile({ target: { files } } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSubmitted(true);
    const maxAllowedFiles = 5 - appointmentFiles.length;
    setNumFilesCanAdd(maxAllowedFiles);
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
          if (files && files.length > 0) {
            // Push file names to selectedFileNames array
            if (file && file.name) {
              selectedFileNames.push(file.name);
            }

            console.log(selectedFileNames, "selected file names");
            console.log(appointmentFiles, "AppointmentFiles");

            // Set selected file names
            setSelectedFileNames(selectedFileNames);
          }
          // You can handle base64 conversion here if needed
        }
      });

      // Update state variables with arrays
      setSelectedFiles(newFiles);
      setFileNames(newFileNames);
      setFileTypes(newFileTypes);
      const maxAllowedFiles = 5 - appointmentFiles.length;
      setNumFilesCanAdd(maxAllowedFiles);
    } else {
      console.warn("No files selected");
    }
    setIsSubmitted(false);
  };
  const toggleToast = (): void => {
    setIsSubmitted(false);
    toast({
      variant: "destructive",
      title: "No File Attached!",
      description: "Please try again.",
    });
  };

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
  useEffect(() => {
    // Initialize selected file names array
    let selectedFileNames: string[] = [];

    if (appointmentFiles && appointmentFiles.length > 0) {
      // Push file names to selectedFileNames array
      for (let file of appointmentFiles) {
        // Only push the filename if it's defined
        if (file && file.filename) {
          selectedFileNames.push(file.filename);
        }
      }

      console.log(selectedFileNames, "selected file names");

      // Set selected file names
      setSelectedFileNames(selectedFileNames);
    } else {
      console.log("No files in labFiles");
      // Optionally, you can clear the selectedFileNames state here
      setSelectedFileNames([]);
    }
  }, [appointmentFiles, defaultAppointmentFiles]);
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
        className="relative flex-col justify-center"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="justify-center flex">
          <div
            className={`flex  pt-14 flex-row justify-items-center ${defaultAppointmentFiles.length === 5
              ? "cursor-not-allowed"
              : "cursor-pointer"
              }`}
          >
            <p className="flex-row flex w-full text-nowrap font-medium text-[15px] text-[#101828]">
              <Image
                src="/imgs/addfolder.svg"
                alt="addfolder"
                width={20}
                height={20}
                className="mr-1 flex self-start"
              />
              {selectedFiles.length > 0
                ? `${selectedFiles.length}/${numFilesCanAdd}selected`
                : defaultAppointmentFiles.length < 5
                  ? "Upload or Attach Files or"
                  : "Max Files Uploaded"}
              &nbsp; </p>
            <label
              htmlFor="fileupload"
              className={` ${defaultAppointmentFiles.length === 5
                ? "cursor-not-allowed"
                : "cursor-pointer"
                } flex  text-[15px] underline text-nowrap  font-medium  text-[#1B84FF]`}
            >
              Browse
            </label>

            <input
              type="file"
              id="fileupload"
              multiple={true}
              accept=".jpeg,.jpg,.png,.pdf"
              className="hidden"
              name="file"
              disabled={defaultAppointmentFiles.length === 5}
              onChange={(e) => handleFile(e)}
              max={5}
            />
            {isHovering && selectedFiles.length > 0 && (
              <div className="absolute mt-[30px] w-[220px] rounded-md bg-[#4E4E4E] p-2 text-[13px] text-white shadow-md">
                <ul>
                  {selectedFiles.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="mb-8 mt-2 justify-center flex text-[#64748B]">
          Maximum file size 50 MB.
        </div>
      </div>
    );
  };
  return (
    <div className="h-[652px] w-[767px]">
      <div className="flex w-full flex-col justify-start rounded-md bg-[#ffffff]">
        <div className="flex items-center justify-between">
          <h2 className="pt-7 pl-10 text-left text-xl font-medium text-[#071437]">
            Appointment Files Attachment
          </h2>
          <X
            size={12}
            strokeWidth={3}
            onClick={() => {
              isSubmitted ? null : isModalOpen(false);
            }}
            className={` ${isSubmitted && "cursor-not-allowed"} mr-9 mt-6 flex h-4 w-4 cursor-pointer items-center text-black`}
          />
        </div>
        {/* <p className="pl-10 pt-2 text-sm text-gray-600">
          <span>Document Files</span> - <span>View Full Screen</span>
        </p> */}
      </div>
      <form className="mt-6" onSubmit={handleSubmit}>
        <div className={`h-[456px] relative mx-8 rounded-md border-dashed border-2 ${isDragging ? 'border-[#005F63] bg-[#007C851A]' : 'border-[#007C85]'
          } z-50`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}>
          <label htmlFor="fileupload"
            className="absolute inset-0 bg-[#007C851A] bg-blend-overlay z-20"></label>

          <div className="relative flex cursor-pointer z-10">
            <div className="flex-1 flex-col">
              <div className="">
                <FileUploadWithHover />
              </div>
              <div className="flex justify-center relative z-10">
                <Image
                  src="/imgs/nodocs.svg"
                  alt="Document"
                  width={290}
                  height={267}
                  className=""
                />
              </div>
            </div>
          </div>
        </div>

        <div className="">
          <div className="mr-10 mt-10 flex justify-end">
            <button
              onClick={() => isModalOpen(false)}
              type="button"
              className={` ${isSubmitted && "cursor-not-allowed"} mr-4 h-[45px] w-[150px] rounded-sm bg-[#F3F3F3] px-3 py-2 font-medium text-black hover:bg-[#D9D9D9]`}
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
      </form>
    </div>
  );
};
export default NofileviewAppointmentsModalContent;
