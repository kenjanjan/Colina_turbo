import { createAdlsOfPatient, updateAdlsOfPatient } from "@/app/api/adls-api/adls-api";
import { cn } from "@/lib/utils";
import { LucideLoader2 } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
interface Modalprops {
  isEdit?: boolean;
  adls?: any;
  label?: string;
  isOpen?: boolean;
  setErrorMessage?: any;
  setIsUpdated: any;
  isModalOpen: (isOpen: boolean) => void;
  onSuccess: () => void;
  onFailed: () => void;
}
const ADLModal = ({ isModalOpen, adls, onSuccess, onFailed, setIsUpdated, isEdit }: Modalprops) => {
  const params = useParams<{
    id: any;
    tag: string;
    item: string;
  }>();
  const router = useRouter();
  const patientId = params.id.toUpperCase();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    patientUuid: patientId,
    adls: adls?.adls_adls || "", 
    notes: adls?.adls_notes || "", 
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTextChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      notes: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);
    try {
      if (isEdit) {
        await updateAdlsOfPatient(
          adls.adls_uuid,
          formData,
          router
        );
        setIsUpdated(true);
        onSuccess();
        isModalOpen(false);
        return;
      } else {
      // Call the API to create the ADLS
      const createdAdls = await createAdlsOfPatient(
        patientId,
        formData,
        router,
      );
      console.log("createdAdls", createdAdls);
      setIsSubmitted(false);
      onSuccess();
      isModalOpen(false);
    }
  } catch (error) {
      console.error("Error creating ADLS:", error);
      setIsSubmitted(false);
      onFailed();
    }
  };
console.log(adls,'adls')
  console.log("formData", formData);
  return (
    <div className="relative h-[488px] w-[767px] overflow-hidden rounded-[7.69px] bg-white px-[42px] py-[26px]">
      <div className="flex justify-between">
        <div className="flex flex-col gap-3">
          <h1 className="text-[20px] font-medium">
          {isEdit ? "Update" : "Add"} Activities of Daily Living Log
          </h1>
          <p className="sub-title">Submit your log details.</p>
        </div>
        <div>
          <Image
            onClick={() => {
              isSubmitted ? null : isModalOpen(false);
            }}
            src="/icons/close-modal.svg"
            alt="close-modal"
            width={12}
            height={12}
            className={` ${isSubmitted && "!cursor-not-allowed"} cursor-pointer pt-3 text-black`}
          />
        </div>
      </div>
      <form
        className="mt-8 flex h-full flex-col justify-between"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-grow flex-col gap-5">
          <div className="flex flex-col gap-2">
            <h1 className="required-field text-[20px] font-medium">ADLs</h1>
            <input
              disabled={isSubmitted}
              value={isEdit?adls.adl_adls:formData.adls}
              onChange={handleInputChange}
              required
              name="adls"
              type="text"
              placeholder="input ADLs"
              className="h-[48px] w-full rounded-[3px] border border-[#D0D5DD] px-5 outline-none placeholder:text-[#64748B]"
            />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="required-field text-[20px] font-medium">Notes</h1>
            <textarea
              disabled={isSubmitted}
              required
              maxLength={200}
              onChange={handleTextChange}
              value={isEdit?adls.adl_notes:formData.notes}
              placeholder="input Notes"
              className={cn(
                "h-[98px] max-h-[98px] min-h-[48px] w-full text-wrap break-words rounded-[3px] border border-[#D0D5DD] px-5 py-3 outline-none placeholder:text-[#64748B]",
                {
                  "border-[#DB3956] !text-[#DB3956]":
                    formData.notes.length === 200,
                },
              )}
            />
            <h1
              className={cn("sub-title w-full text-end", {
                "!text-[#DB3956]": formData.notes.length === 200,
              })}
            >
              {formData.notes.length}/200 Characters
            </h1>
          </div>
        </div>
        <div className="absolute bottom-0 right-10 mb-9 mt-auto flex justify-end gap-4">
          <button
            onClick={() => isModalOpen(false)}
            disabled={isSubmitted}
            type="button"
            className={` ${isSubmitted && "cursor-not-allowed"} h-[45px] w-[140.24px] rounded-sm bg-[#F3F3F3] font-medium text-black hover:bg-[#D9D9D9]`}
          >
            Cancel
          </button>
          <button
            disabled={isSubmitted}
            type="submit"
            className={` ${isSubmitted && "cursor-not-allowed"} h-[45px] w-[140.24px] rounded-sm bg-[#007C85] font-medium text-[#ffff] hover:bg-[#03595B]`}
          >
            <div className="flex w-full items-center justify-center gap-2">
              {isSubmitted && (
                <LucideLoader2 size={20} className="animate-spin" />
              )}
              {isEdit ? isSubmitted ? "Updating..." : "Update" : isSubmitted ? "Submitting..." : "Submit"}
             
            </div>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ADLModal;
