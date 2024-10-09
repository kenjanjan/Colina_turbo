import { createNotesOfPatient } from "@/app/api/notes-api/notes-api";
import { X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ToastAction } from "../ui/toast";
import { useToast } from "../ui/use-toast";

interface Modalprops {
  isModalOpen: (isOpen: boolean) => void;
  label: string;
  uuid: string;
  name: string;
  isOpen: boolean;
  isView: boolean;
  onSuccess: () => void;
  PatientNotesData: any;
}

export const IncidentreportModalContent = ({
  label,
  isOpen,
  uuid,
  name,
  isView,
  isModalOpen,
  PatientNotesData,
  onSuccess,
}: Modalprops) => {
  const params = useParams<{
    id: any;
    tag: string;
    item: string;
  }>();
  const { toast } = useToast();
  const patientId = params.id ? params.id.toUpperCase() : uuid.toUpperCase();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [titleLabel, setTitleLabel] = useState(label);
  const [formData, setFormData] = useState({
    subject: PatientNotesData.notes_subject || "",
    notes: PatientNotesData.notes_notes || "",
    type: "ir",
  });
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
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitted(true);
    if (!isView){

      try {
        const notes = await createNotesOfPatient(patientId, formData, router);
      console.log("notesadded successfully:", notes);

      // Reset the form data after successful submission
      setFormData({
        subject: "",
        notes: "",
        type: "ir",
      });

      onSuccess();
      isModalOpen(false);
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
      console.error("Error adding note:", error);
      setError("Failed to add note");
    }
    setIsSubmitted(false);
  }
  isModalOpen(false);

  };
  console.log(formData, "formData");
  return (
    <div className="h-[542px] w-[676px] rounded-md bg-[#FFFFFF]">
      <form className="" onSubmit={handleSubmit}>
        <div className="flex h-[70px] w-full flex-col justify-start rounded-md bg-[#ffffff]">
          <div className="flex items-center justify-between">
            <h2 className="p-title mt-7 pl-10 text-left text-[#071437]">
              {label}
              {" - "}
              <span className="text-gray-500"> Incident Report</span>
            </h2>
            <X
              onClick={() => isModalOpen(false)}
              className="mr-9 mt-6 flex h-6 w-6 items-center text-black"
            />
          </div>
          <p className="pb-10 pl-10 pt-2 text-sm text-gray-600">
            Submit your Report.
          </p>
        </div>
        <div className="mb-9 pt-4">
          <div className="mt-5 h-[600px] max-h-[370px] md:px-10">
            <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label
                  htmlFor="company"
                  className="text-md required-field block font-bold leading-6 text-gray-900"
                >
                  SUBJECT
                </label>
                <div className="mt-2.5">
                  <input
                    type="text"
                    disabled={isView}
                    className="block h-12 w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    placeholder="input subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="message"
                  className="text-md required-field block font-bold leading-6 text-gray-900"
                >
                  DETAILS OF INCIDENT
                </label>
                <div className="mt-2.5">
                  <textarea
                    rows={4}
                    disabled={isView}
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    placeholder="input incident"
                    style={{ resize: "none" }}
                    required
                    name="notes"
                    value={formData.notes}
                    onChange={handleTextChange}
                  />
                </div>
              </div>
              {/* <div className="sm:col-span-2">
                <label
                  htmlFor="company"
                  className="block text-md font-bold leading-6 text-gray-900 required-field"
                >
                  REPORTED BY
                </label>
                <div className="mt-2.5">
                  <input
                    type="text"
                    className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    placeholder="input who report"
                  />
                </div>
              </div> */}
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
                {isView ? "OK" : "Submit"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
