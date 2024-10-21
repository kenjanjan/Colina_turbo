import { ModalProps } from "@/lib/interface";
import Image from "next/image";
import React, { useState } from "react";
import PrescriptionOrderCategory from "./order-prescription-cat";
import DietaryOrderCategory from "./order-dietary-cat";
import LaboratoryOrderCategory from "./order-laboratory-cat";

const OrderModalContent = ({
  tab,
  isOrder,
  data,
  isModalOpen,
  setIsOrder,
  setIsOrderModalOpen,
  appointmentId,
  onSuccess = () => {},
  onFailed = () => {},
  setIsUpdated,
  setErrorMessage,
}: ModalProps) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [category, setCategory] = useState("");
  const [isPrn, setIsPrn] = useState<boolean>(false); // default is PRN
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setCategory(value);
  };
  console.log(data, "data");
  console.log(category, "category");
  return (
    <div className="min-w-[767px] rounded-[7.69px] bg-white px-8 py-5">
      <div className="items-centers flex flex-col justify-center gap-5">
        <div className="flex justify-between gap-x-72">
          <div className="flex flex-col">
            <h1 className="text-[20px] font-medium">
              {tab === "PrescriptionUpdate"
                ? "Update Prescription":
                tab === "Dietary"
                ? "Dietary Order":
                tab === "Appointment"
                ? "Dietary Order"
                : `${tab === "Prescription" ? "View" : "Add"} ${
                    category === "Prescription"
                      ? category + (isPrn ? " PRN" : " Schedule")
                      : category || tab || ""
                  } ${tab === "Prescription" ? "" : "to Order List"}`}
            </h1>
            {category || tab ? (
              <p className="sub-title">Submit your log details.</p>
            ) : (
              <p className="sub-title">Make sure to submit your details.</p>
            )}
          </div>
          {/* <div
            className="mt-[10px] flex cursor-pointer items-start"
            onClick={
              setIsOrder ? () => setIsOrder(false) : () => isModalOpen(false)
            }
          >
            <Image
              alt="close-button"
              width={12}
              height={11.61}
              src="/icons/close-modal.svg"
            />
          </div> */}

          <div
            className="mt-[10px] flex cursor-pointer items-start"
            onClick={() => {
              // Close the order if setIsOrder is true
              if (setIsOrder) {
                setIsOrder(false);
              }

              // Close the order modal if setIsOrderModalOpen is defined
              if (setIsOrderModalOpen) {
                setIsOrderModalOpen ? setIsOrderModalOpen(false) : null;
              }

              // Call isModalOpen to close the generic modal
              isModalOpen(false);
            }}
          >
            <Image
              alt="close-button"
              width={12}
              height={11.61}
              src="/icons/close-modal.svg"
            />
          </div>
        </div>
        {!tab && (
          <div className="flex flex-col gap-2">
            <h1 className="required-field text-[20px] font-medium">
              Type of Order
            </h1>
            <div className="relative w-full">
              <select
                id="status"
                className="block h-12 w-full cursor-pointer rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                name="medicationLogStatus"
                onChange={handleStatusChange}
                required
              >
                <option value="">Select Category</option>
                <option value="Prescription">Prescription</option>
                <option value="Dietary">Dietary</option>
                <option value="Laboratory Result">Laboratory Result</option>
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
        )}

        {/* Content */}

        {(category || tab) &&
          (category === "Prescription" ||
          tab === "Prescription" ||
          tab === "PrescriptionUpdate" ? (
            <PrescriptionOrderCategory
              data={data}
              tab={tab}
              setIsOrder={setIsOrder}
              isModalOpen={isModalOpen}
              setIsOrderModalOpen={
                setIsOrder ? () => setIsOrder(false) : () => isModalOpen(false)
              }
              isPrn={isPrn}
              setIsPrn={setIsPrn}
              appointmentId={appointmentId}
              onSuccess={onSuccess}
              onFailed={onFailed}
              setErrorMessage={setErrorMessage}
              setIsUpdated={setIsUpdated ? setIsUpdated : undefined}
            />
          ) : category === "Dietary" || tab === "Dietary" ? (
            <DietaryOrderCategory
              data={data}
              tab={tab}
              setIsOrder={setIsOrder}
              isModalOpen={isModalOpen}
              setIsOrderModalOpen={
                setIsOrder ? () => setIsOrder(false) : () => isModalOpen(false)
              }
              appointmentId={appointmentId}
              onSuccess={onSuccess}
              onFailed={onFailed}
              setErrorMessage={setErrorMessage}
            />
          ) : category === "Laboratory Result" ? (
            <LaboratoryOrderCategory
              setIsOrder={setIsOrder}
              isModalOpen={isModalOpen}
              setIsOrderModalOpen={
                setIsOrder ? () => setIsOrder(false) : () => isModalOpen(false)
              }
              appointmentId={appointmentId}
              onSuccess={onSuccess}
              onFailed={onFailed}
              setErrorMessage={setErrorMessage}
            />
          ) : null)}

        {/* {(category || tab) && (
          <div className="">
            <div className="flex justify-end">
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
                disabled={isSubmitted || category === ""}
                type="submit"
                className={` ${isSubmitted || (category === "" && "cursor-not-allowed")} h-[45px] w-[150px] rounded-sm bg-[#007C85] px-3 py-2 font-medium text-[#ffff] hover:bg-[#03595B]`}
              >
                Submit
              </button>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default OrderModalContent;
