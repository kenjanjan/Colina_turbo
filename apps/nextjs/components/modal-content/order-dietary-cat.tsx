import { fetchDietaryOrders } from "@/app/api/lab-results-api/lab-results.api";
import { createDietaryOrder } from "@/app/api/prescription-api/prescription.api";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { TextareaHTMLAttributes, useEffect, useState } from "react";

interface Order {
  orders_uuid: string;
  orders_appointmentId: number;
  orders_orderDate: string;
  orders_orderType: string;
}
interface DietaryOrderCategoryProps {
  data?: any;
  tab?: string;
  setIsOrder?: (value: boolean) => void;
  isModalOpen: (value: boolean) => void;
  setIsOrderModalOpen: (value: boolean) => void;
  appointmentId?: string;
  onSuccess: () => void;
  onFailed: () => void;
  setErrorMessage: (message: string) => void;
}

const DietaryOrderCategory = ({
  data,
  tab,
  setIsOrderModalOpen,
  setIsOrder,
  isModalOpen,
  appointmentId,
  onSuccess,
  onFailed,
  setErrorMessage,
}: DietaryOrderCategoryProps) => {
  const params = useParams<{
    id: any;
    tag: string;
    item: string;
  }>();
  const patientId = params.id.toUpperCase();
  const router = useRouter();
  const [isReferenceUIDChecked, setIsReferenceUIDChecked] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [orderUuid, setOrderUuid] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [isReferenceOpen, setIsReferenceOpen] = useState(false);
  const [orderList, setOrderlist] = useState<Order[]>([]);
  const [formData, setFormData] = useState({
    dietary: data?.dietaryuuid || "",
    notes: data?.notes || "",
    status: data?.status || "",
    orderUuid: data?.orderuuid || "",
    appointmentUuid: data?.appointmentuuid || "",
    dateIssued: data?.dateissued || "",
  });

  console.log(formData, "formData");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleReferenceUIDCheckbox = () => {
    setIsReferenceUIDChecked(!isReferenceUIDChecked);
  }; 

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCharCount(e.target.value.length);
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleReferenceSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrderUuid("");
    setFormData((prevData) => ({
      ...prevData,
      orderUuid: "",
    }));
    setOrderUuid(e.target.value);
    setIsReferenceOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchDietaryOrders(patientId, "dietary", router);
        if (response) {
          setOrderlist(response.data);
          console.log(formData,"dennn");
        }
      } catch (error) {}
    };
    fetchData();
  }, []);

  const filteredOrders = Array.isArray(orderList)
    ? orderList.filter((order) =>
        order.orders_uuid.toLowerCase().includes(orderUuid.toLowerCase()),
      )
    : [];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);

    try {
      const response = await createDietaryOrder(patientId,formData )
      if (response) {
        onSuccess();
        setIsOrderModalOpen(false);
        isModalOpen(false);
      }
    } catch (error) {
      onFailed();
    } finally {
      setIsSubmitted(false);
    }
  };
console.log(formData,"formData")
  console.log(data, "data");
  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      {!tab && (
        <div className="flex gap-1.5">
          <input
            id="checkbox"
            type="checkbox"
            onChange={handleReferenceUIDCheckbox}
            className="cursor-pointer"
          />
          <label htmlFor="checkbox" className="sub-title cursor-pointer">
            is this add reference UID?
          </label>
        </div>
      )}
      {isReferenceUIDChecked && (
        <div className="mt-5 flex flex-col">
          <input
            required
            name="orderUuid"
            type="text"
            value={orderUuid}
            onChange={handleReferenceSearch}
            placeholder="example: ORDER UID-123123123123"
            className="block h-12 w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
          />
          {orderUuid && isReferenceOpen && (
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
                          orderUuid: order.orders_uuid,
                        }));
                        setOrderUuid(order.orders_uuid);
                        setIsReferenceOpen(false);
                      }}
                      className="cursor-pointer space-x-2 font-semibold hover:text-[#03595B]"
                    >
                      <p>{order.orders_uuid}</p>
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
      <div className="flex w-full justify-between gap-5">
        <div className="flex w-full flex-col gap-2">
          <h1 className="required-field text-[20px] font-medium">
            Dietary Requirement
          </h1>
          <input
            required
            type="text"
            name="dietary"
            onChange={handleChange}
            disabled={tab ? tab.length > 0 : false}
            value={data?.dietary_requirement || formData.dietary}
            placeholder="input dietary requirement"
            className="block h-12 w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
          />
        </div>
        <div className="flex w-full flex-col gap-2">
          <h1 className="required-field text-[20px] font-medium">Status</h1>
          <div className="relative">
            <select
              required
              name="status"
              onChange={handleStatusChange}
              // value={data?.status || formData.status}
              value={data.p_status || formData.status}
              disabled={tab ? tab.length > 0 : false}
              className="block h-12 w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
            >
              <option value="">Select Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
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
      </div>
      <div className="flex w-full flex-col gap-2">
        <h1 className="required-field text-[20px] font-medium">Notes</h1>
        <textarea
          required
          name="notes"
          value={data?.notes || formData.notes}
          placeholder="input notes"
          maxLength={200}
          disabled={tab ? tab.length > 0 : false}
          onChange={handleInputChange}
          className="block h-[96px] w-full resize-none rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
        />
        <p
          className={cn("sub-title text-end", {
            "!text-red-500": charCount === 200,
          })}
        >
          {charCount}/200 Characters
        </p>
      </div>
      {!tab && (
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
      )}
    </form>
  );
};

export default DietaryOrderCategory;
