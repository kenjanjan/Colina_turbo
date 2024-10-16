import { createInitialLabOrder } from "@/app/api/lab-results-api/lab-results.api";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useToast } from "../ui/use-toast";
interface LaboratoryOrderCategoryProps {
  setIsOrder?: (value: boolean) => void;
  isModalOpen: (value: boolean) => void;
  setIsOrderModalOpen: (value: boolean) => void;
  appointmentId?: string;
  onSuccess: () => void;
  onFailed: () => void;
  setErrorMessage: (message: string) => void;
  isSubmitted?: boolean;
}
const LaboratoryOrderCategory = ({
  setIsOrder,
  isModalOpen,
  setIsOrderModalOpen,
  appointmentId,
  onSuccess,
  onFailed,
  setErrorMessage,
}: LaboratoryOrderCategoryProps) => {
  const params = useParams<{
    id: any;
    tag: string;
    item: string;
  }>();
  const { toast } = useToast();
  const patientId = params.id.toUpperCase();
  const router = useRouter();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);
    try {
      const labOrder = await createInitialLabOrder(
        patientId,
        appointmentId,
        router,
      );
      setIsOrderModalOpen(false);
      onSuccess();
    } catch (error) {
      setIsOrderModalOpen(false);
      onFailed();
    } finally {
      setIsSubmitted(false);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
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

export default LaboratoryOrderCategory;
