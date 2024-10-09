import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  createFormsOfPatient,
  fetchFormsByPatient,
  addFormFile,
  deleteFormFiles,
  updateFormsOfPatient,
} from "@/app/api/forms-api/forms.api";
import { toast, useToast } from "@/components/ui/use-toast";
interface Modalprops {
  isEdit: any;
  formAddData: any;
  isModalOpen: (isOpen: boolean) => void;
  onSuccess: () => void;
}
interface FormFile {
  file: any; // Assuming file property exists for the key
  filename: string;
  data: Uint8Array;
  file_uuid: string;
}

function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>): void {
  throw new Error("Function not implemented.");
}

export const FormsModalContent = ({
  isModalOpen,
  onSuccess,
  formAddData,
  isEdit,
}: Modalprops) => {
  const router = useRouter();
  const params = useParams<{
    id: any;
    tag: string;
    item: string;
  }>();

  const [fileNames, setFileNames] = useState<string[]>([]);
  const [fileTypes, setFileTypes] = useState<string[]>([]);
  const [selectedFiles, setSelectedFormFiles] = useState<File[]>([]);
  const [numFilesCanAdd, setNumFilesCanAdd] = useState<number>(5);
  const [selectedFileNames, setSelectedFileNames] = useState<string[]>([]);
  const [formFiles, setFormFiles] = useState<any[]>([]); //
  const patientId = params.id.toUpperCase();
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    dateIssued: "",
    nameOfDocument: "",
    notes: "",
  });

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

  const toggleMaxFilesToast = (maxFiles: number): void => {
    setIsSubmitted(false);
    toast({
      variant: "destructive",
      title: "Maximum Number of Files Exceeded!",
      description: `You can only add ${maxFiles} more file(s). Please try again.`,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleModalOpen = (isOpen: boolean) => {
    // Rename the function
    setIsOpen(isOpen);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
  };

  // de
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitted(true);
    e.preventDefault();
    console.log(
      "SUBMITTING FORM DATA",
      selectedFileNames,
      selectedFiles.length,
    );
    if (selectedFiles.length === 0) {
      toggleNoFileAttached();
    } else {
      try {
        // Create the form result
        const forms = await createFormsOfPatient(patientId, formData, router);
        console.log("Form Result added successfully:", forms);
        const getUuid = forms.uuid;
        console.log("Form UUID:", getUuid);

        // Iterate through each selected file
        if (selectedFiles && selectedFiles.length > 0) {
          // Iterate through each selected file
          for (let i = 0; i < selectedFiles.length; i++) {
            const formFileFormData = new FormData();
            formFileFormData.append("formfile", selectedFiles[i], fileNames[i]);

            // Add form file
            const addFormFiles = await addFormFile(
              getUuid,
              formFileFormData,
              router,
            );

            console.log(
              `Form FILE ${fileNames[i]} added successfully:`,
              addFormFiles,
            );
          }
        } else {
          console.warn("No files selected to upload");
        }
        // Reset form data
        setFormData({
          nameOfDocument: "",
          dateIssued: "",
          notes: "",
        });
        onSuccess();
      } catch (error) {
        console.error("Error adding Form Result:", error);
        setError("Failed to add Form Result");
      } finally {
        isModalOpen(false);
      }
      setIsSubmitted(false);
    }
  };
  // de

  console.log(formData, "formData");

  return (
    <div className="h-[621px] w-[676px] overflow-hidden rounded-md bg-[#FFFFFF]">
      <form onSubmit={handleSubmit}>
        <div className="flex h-[70px] w-full flex-col justify-start rounded-md bg-[#ffffff]">
          <div className="mt-7 flex items-center justify-between px-[40px]">
            <p className="p-title">Add Form Details</p>
            <X
              onClick={() => {
                isSubmitted ? null : isModalOpen(false);
              }}
              className={` ${isSubmitted && "cursor-not-allowed"} mt-2 flex h-7 w-7 cursor-pointer items-center text-black`}
            />
          </div>
          {/* <div className="items-center flex justify-between">
            <p className="font-semibold text-[20px] text-left  pl-10 mt-7">
              Add Form Details
            </p>
            <X
              onClick={() => {
                isSubmitted ? null : isModalOpen(false);
              }}
              className={`
              ${isSubmitted && " cursor-not-allowed"}
              w-7 h-7 text-black flex items-center mt-2 cursor-pointer`}
            />
          </div>
          <p className="text-[15px] pl-10 text-[#667085] pb-10 pt-2">
            Generate PDF once your done.
          </p> */}
        </div>
        <div className="mb-9 pt-4">
          <div className="mt-5 h-[600px] max-h-[375px] md:px-10">
            <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="required-field text-[15px] font-medium">
                  NAME OF DOCUMENT
                </label>
                <div className="mt-2.5">
                  <input
                    type="text"
                    className="block h-12 w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    placeholder="Input name of document"
                    name="nameOfDocument"
                    value={formData.nameOfDocument}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="company"
                  className="required-field text-[15px] font-medium"
                >
                  DATE ISSUED
                </label>
                <div className="relative mt-2.5">
                  <input
                    type="date"
                    className="block h-12 w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    placeholder="Select date"
                    name="dateIssued"
                    value={formData.dateIssued}
                    onChange={handleChange}
                    required
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
              <div className="sm:col-span-2">
                <label
                  htmlFor="message"
                  className="required-field text-[15px] font-medium"
                >
                  NOTES
                </label>
                <div className="mt-2.5">
                  <textarea
                    rows={4}
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    placeholder="Input notes"
                    style={{ resize: "none" }}
                    name="notes"
                    value={formData.notes}
                    onChange={handleTextChange}
                    required
                  />
                </div>
              </div>

              {formFiles.length === 5 ? (
                <div></div>
              ) : (
                <div className="">
                  <label
                    htmlFor="imageUpload"
                    className="relative flex h-[70px] w-[600px] cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-[#007C85] bg-[#daf3f5] text-center font-medium text-[#101828]"
                  >
                    <>
                      {selectedFileNames.length > 0 ? (
                        // If files are selected, display filein.svg
                        <Image
                          className="mr-1 h-10 w-10"
                          width={50}
                          height={50}
                          src={"/svgs/filein.svg"}
                          alt=""
                        />
                      ) : (
                        // If no files are selected, display folder-add.svg
                        <Image
                          className="mr-1 h-10 w-10"
                          width={50}
                          height={50}
                          src={"/svgs/folder-add.svg"}
                          alt=""
                        />
                      )}
                      <div className="flex pb-5">
                        <p className="mt-2 text-[20px] font-medium">
                          Upload or Attach Files or{" "}
                          <span className="ml-1 mt-2 text-[20px] font-medium text-blue-500 underline decoration-solid">
                            Browse
                          </span>
                        </p>
                      </div>
                      <span className="absolute bottom-2 ml-10 text-[10px] font-normal text-[#667085]">
                        {selectedFileNames.length === 0 ? (
                          // Display "Maximum File Size: 10MB" if no files are attached
                          <span className="text-[15px] font-medium">
                            Maximum File Size: 15MB
                          </span>
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
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="pt-10">
          <div className="mr-10 flex justify-end">
            <button
              onClick={() => isModalOpen(false)}
              disabled={isSubmitted}
              type="button"
              className={` ${isSubmitted && "cursor-not-allowed"} mr-4 h-[50px] w-[200px] rounded-sm bg-[#F3F3F3] font-medium text-black hover:bg-[#D9D9D9]`}
            >
              Cancel
            </button>
            <button
              disabled={isSubmitted}
              type="submit"
              className={` ${isSubmitted && "cursor-not-allowed"} h-[50px] w-[170px] rounded-sm bg-[#007C85] px-3 py-2 font-medium text-[#ffff] hover:bg-[#03595B]`}
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
