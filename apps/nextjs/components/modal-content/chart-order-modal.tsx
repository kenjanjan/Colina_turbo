import { View, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import TableTop from "../reusable/tableTop";
import ResuableTooltip from "../reusable/tooltip";
import DropdownMenu from "../dropdown-menu";
import { cn, formatCreatedAtDate } from "@/lib/utils";
import Pagination from "../shared/pagination";
import Image from "next/image";
import { fetchOrdersPrescriptionsByPatient } from "@/app/api/orders/orders-prescription-api";
import { useRouter } from "next/navigation";
import { fetchOrdersDietaryByPatient } from "@/app/api/orders/orders-dietary-api";
import { fetchOrdersLaboratoryByPatient } from "@/app/api/orders/orders-laboratory-api";
import Modal from "../reusable/modal";
import { AppointmentModalContent } from "./appointment-modal-content";
import { LabresultsModalContent } from "./labresults-modal-content";

const ChartOrderModal = ({
  setIsChartOrderOpen,
  patientUuid,
  patientName,
}: {
  setIsChartOrderOpen: any;
  patientUuid: string;
  patientName: string;
}) => {
  const router = useRouter();
  const [orderLaboratoryList, setOrderLaboratoryList] = useState<any[]>([]);
  const [orderDietaryList, setOrderDietaryList] = useState<any[]>([]);

  const [isOpenFilterStatus, setIsOpenFilterStatus] = useState(false);
  const [filterStatusFromCheck, setFilterStatusFromCheck] = useState<any[]>([]);
  const [term, setTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState("p.createdAt");
  const [sortOrder, setSortOrder] = useState("DESC");
  const [orderPrescriptionList, setOrderPrescriptionList] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageNumber, setPageNumber] = useState("");
  const [isPrescription, setIsPrescription] = useState(true);
  const [isDietary, setIsDietary] = useState(false);
  const [isLaboratory, setIsLaboratory] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpenOrderedBy, setIsOpenOrderedBy] = useState(false);
  const [isOpenSortedBy, setIsOpenSortedBy] = useState(false);
  const [isViewAppointment, setIsViewAppointment] = useState(false);
  const [appointmentData, setAppointmentData] = useState<any[]>([]);
  const [isViewLabResult, setIsViewLabResult] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  let optionsFilterStatus: any[] = [];

  if (isPrescription) {
    optionsFilterStatus = [
      { label: "active", onClick: () => {} }, // Changed to lowercase
      { label: "discontinued", onClick: () => {} }, // Changed to lowercase
    ];
  }

  if (isDietary) {
    optionsFilterStatus = [
      { label: "Active", onClick: () => {} }, // Changed to lowercase
      { label: "Inactive", onClick: () => {} }, // Changed to lowercase
    ];
  }

  if (isLaboratory) {
    optionsFilterStatus = [
      { label: "completed", onClick: setFilterStatusFromCheck }, // Changed to lowercase
      { label: "pending", onClick: setFilterStatusFromCheck }, // Changed to lowercase
    ];
  }

  const handleOrderOptionClick = (option: string) => {
    setIsOpenOrderedBy(false);
    if (option === "Ascending") {
      setSortOrder("ASC");
    } else {
      setSortOrder("DESC");
    }
    console.log(option, "option");
  };
  console.log(sortOrder, "sortOrder");

  const handleSortOptionClick = (option: string) => {
    setIsOpenSortedBy(false);
    if (isPrescription) {
      if (option === "PRESCRIPTION UID") {
        setSortBy("p.uuid");
      } else if (option === "DATE ISSUED") {
        setSortBy("p.createdAt");
      } else if (option === "MEDICINE NAME") {
        setSortBy("p.name");
      } else {
        setSortBy("p.dosage");
      }
    }
    if (isDietary) {
      if (option === "DATE ISSUED") {
        setSortBy("dateissued");
      } else if (option === "DIETARY REQUIREMENT") {
        setSortBy("dietary");
      } else {
        setSortBy("notes");
      }
    }
    if (isLaboratory) {
      if (option === "Date") {
        setSortBy("dateissued");
      } else if (option === "Appointment") {
        setSortBy("appointmentuuid");
      } else {
        setSortBy("laboratoryuuid");
      }
    }
    console.log("option", sortBy);
  };

  const optionsOrderedBy = [
    { label: "Ascending", onClick: handleOrderOptionClick },
    { label: "Descending", onClick: handleOrderOptionClick },
  ];

  let optionsSortBy: { label: string; onClick: (option: string) => void }[] =
    [];

  if (isPrescription) {
    optionsSortBy = [
      { label: "PRESCRIPTION UID", onClick: handleSortOptionClick },
      { label: "DATE ISSUED", onClick: handleSortOptionClick },
      { label: "MEDICINE NAME", onClick: handleSortOptionClick },
      { label: "DOSAGE", onClick: handleSortOptionClick },
    ];
  }
  if (isDietary) {
    optionsSortBy = [
      { label: "DATE ISSUED", onClick: handleSortOptionClick },
      { label: "DIETARY REQUIREMENT", onClick: handleSortOptionClick },
      { label: "NOTES", onClick: handleSortOptionClick },
    ];
  }
  if (isLaboratory) {
    optionsSortBy = [
      { label: "Date", onClick: handleSortOptionClick },
      { label: "Appointment", onClick: handleSortOptionClick },
      { label: "Laboratory", onClick: handleSortOptionClick },
    ];
  }

  const handleStatusUpdate = (checkedFilters: string[]) => {
    if (isLaboratory) {
      // Convert checked filters to lowercase before passing them
      const lowercaseFilters = checkedFilters.map((filter) =>
        filter.toLowerCase(),
      );

      // Call the function to set the filter status
      setFilterStatusFromCheck(lowercaseFilters);
    } else {
      // Pass the original checked filters when not in laboratory mode
      setFilterStatusFromCheck(checkedFilters);
    }
  };

  console.log(filterStatusFromCheck, "filterStatusFromCheck");

  // Fetching for prescription data
  // useEffect(() => {
  //   setIsLoading(true);
  // }, [isPrescription, isDietary, isLaboratory]);

  useEffect(() => {
    const fetchData = async () => {
      if (isPrescription) {
        try {
          const response = await fetchOrdersPrescriptionsByPatient(
            patientUuid,
            term,
            currentPage,
            sortBy,
            sortOrder as "ASC" | "DESC",
            4,
            filterStatusFromCheck,
            router,
          );
          setOrderPrescriptionList(response.data);
          setTotalPages(response.totalPages);
          setTotalOrders(response.totalCount);
          setIsLoading(false);
        } catch (error: any) {
          setError(error.message);
        }
      }
      if (isDietary) {
        try {
          const response = await fetchOrdersDietaryByPatient(
            patientUuid,
            term,
            currentPage,
            sortBy,
            sortOrder as "ASC" | "DESC",
            4,
            filterStatusFromCheck,
            router,
          );
          setOrderDietaryList(response.data);
          setTotalPages(response.totalPages);
          setTotalOrders(response.totalCount);
          setIsLoading(false);
        } catch (error: any) {
          setError(error.message);
        }
      }
      if (isLaboratory) {
        try {
          const response = await fetchOrdersLaboratoryByPatient(
            patientUuid,
            term,
            currentPage,
            sortBy,
            sortOrder as "ASC" | "DESC",
            4,
            filterStatusFromCheck,
            router,
          );
          setOrderLaboratoryList(response.data);
          setTotalPages(response.totalPages);
          setTotalOrders(response.totalCount);
          setIsLoading(false);
        } catch (error: any) {
          setError(error.message);
        }
      }
    };
    fetchData();
  }, [
    currentPage,
    term,
    sortOrder,
    sortBy,
    filterStatusFromCheck,
    isDietary,
    isPrescription,
  ]);

  const isModalOpen = (isOpen: boolean) => {
    setIsOpen(isOpen);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else if (!isOpen) {
      document.body.style.overflow = "visible";
      setIsViewLabResult(false);
    }
  };

  return (
    <div className="flex w-[1284px] flex-col gap-5 rounded-md px-10 py-7">
      <div className="flex items-center justify-between">
        <h1 className="text-[20px] font-medium">
          List of Orders for {patientName}
          {" > "}
          <span
            className={cn("cursor-pointer", {
              "text-[#007C85]": isPrescription,
            })}
            onClick={() => {
              setIsPrescription(true);
              setIsDietary(false);
              setIsLaboratory(false);
              setIsLoading(true);
              setFilterStatusFromCheck([]);
              setSortBy("p.createdAt");
            }}
          >
            Prescription{" "}
          </span>{" "}
          /
          <span
            className={cn("cursor-pointer", { "text-[#007C85]": isDietary })}
            onClick={() => {
              setIsDietary(true);
              setIsPrescription(false);
              setIsLaboratory(false);
              setIsLoading(true);
              setFilterStatusFromCheck([]);
              setSortBy("dateissued");
            }}
          >
            {" "}
            Dietary{" "}
          </span>{" "}
          /
          <span
            className={cn("cursor-pointer", { "text-[#007C85]": isLaboratory })}
            onClick={() => {
              setIsLaboratory(true);
              setIsPrescription(false);
              setIsDietary(false);
              setIsLoading(true);
              setFilterStatusFromCheck([]);
              setSortBy("dateissued");
            }}
          >
            {" "}
            Laboratory
          </span>
        </h1>
        <X
          onClick={() => setIsChartOrderOpen(false)}
          className="h-6 w-6 cursor-pointer items-center text-black"
        />
      </div>
      <div>
        <TableTop
          isOpenOrderedBy={isOpenOrderedBy}
          isOpenSortedBy={isOpenSortedBy}
          optionsOrderedBy={optionsOrderedBy}
          optionsSortBy={optionsSortBy}
          term={term}
          setTerm={setTerm}
          setCurrentPage={setPageNumber}
        />
        {isPrescription && !isLoading ? (
          <table className="table-fixed border-spacing-2 text-left rtl:text-right">
            <thead>
              <tr className="h-[70px] border-b text-[15px] font-semibold uppercase text-[#64748B]">
                <td className="pl-4">ORDER UID</td>
                <td className="">PRESCRIPTION UID</td>
                <td className="">APPOINTMENT UID</td>
                <td className="">DATE ISSUED</td>
                <td className="">MEDICINE NAME</td>
                <td className="">DOSAGE</td>
                <td className="relative px-6 py-3">
                  <div
                    className={`absolute ${filterStatusFromCheck?.length > 0 ? "left-[26px] top-[24px]" : "left-[26px] top-[24px]"}`}
                  >
                    <DropdownMenu
                      options={optionsFilterStatus.map(
                        ({ label, onClick }) => ({
                          label,
                          onClick: () => {
                            // onClick(label);
                            // console.log("label", label);
                          },
                        }),
                      )}
                      open={isOpenFilterStatus}
                      width={"165px"}
                      statusUpdate={handleStatusUpdate} // Pass the handler function
                      checkBox={true}
                      title={"Status"}
                      label={"Status"}
                    />
                  </div>
                </td>
              </tr>
            </thead>
            <tbody className="h-[254px]">
              {orderPrescriptionList.length === 0 && (
                <tr className="h-full">
                  <td className="border-1 flex h-full items-center justify-center py-5">
                    <p className="sub-title text-center">No logs yet</p>
                  </td>
                </tr>
              )}
              {orderPrescriptionList.length > 0 && (
                <>
                  {orderPrescriptionList.map((ordersPrescription, index) => (
                    <tr
                      key={index}
                      className="group h-[63px] border-b text-[15px] hover:bg-[#f4f4f4]"
                    >
                      <td className="pl-4 text-[15px] font-normal">
                        {ordersPrescription.op_uuid}{" "}
                      </td>
                      <td className="">
                        <ResuableTooltip text={ordersPrescription.p_uuid} />{" "}
                      </td>
                      <td className="">
                        <ResuableTooltip text={ordersPrescription.a_uuid} />{" "}
                      </td>
                      <td className="">
                        <ResuableTooltip
                          text={formatCreatedAtDate(
                            ordersPrescription.o_orderdate,
                          )}
                        />{" "}
                      </td>
                      <td className="">
                        <ResuableTooltip text={ordersPrescription.p_name} />{" "}
                      </td>
                      <td className="">
                        <ResuableTooltip text={ordersPrescription.p_dosage} />{" "}
                      </td>
                      <td className="relative px-6 py-3">
                        <p
                          className={`flex items-center justify-center rounded-[30px] py-1 font-semibold ${
                            ordersPrescription.p_status === "Active"
                              ? "bg-[#CCFFDD] text-[#17C653]"
                              : ordersPrescription.p_status === "Discontinued"
                                ? "bg-[#FFE8EC] text-[#EF4C6A]" // Red color for Discontinued
                                : ""
                          }`}
                        >
                          {ordersPrescription.p_status}{" "}
                        </p>
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        ) : (
          isPrescription && (
            <div className="container flex h-full w-full items-center justify-center py-[113px]">
              <Image
                src="/imgs/colina-logo-animation.gif"
                alt="logo"
                width={100}
                height={100}
              />
            </div>
          )
        )}
        {isDietary && !isLoading ? (
          <table className="table-fixed border-spacing-2 text-left rtl:text-right">
            <thead>
              <tr className="h-[70px] border-b text-[15px] font-semibold uppercase text-[#64748B]">
                <td className="pl-4">ORDER UID</td>
                <td className="">DATE ISSUED</td>
                <td className="">DIETARY REQUIREMENT</td>
                <td className="">
                  <DropdownMenu
                    options={optionsFilterStatus.map(({ label, onClick }) => ({
                      label,
                      onClick: () => {
                        // onClick(label);
                        // console.log("label", label);
                      },
                    }))}
                    open={isOpenFilterStatus}
                    width={"165px"}
                    statusUpdate={handleStatusUpdate}
                    checkBox={true}
                    title={"Status"}
                    label={"Status"}
                  />
                </td>
                <td className="w-[400px]">NOTES</td>
              </tr>
            </thead>
            <tbody className="h-[254px]">
              {orderDietaryList.map((dietary: any, index: any) => (
                <tr
                  key={index}
                  className="group h-[63px] border-b text-[15px] hover:bg-[#f4f4f4]"
                >
                  <td className="pl-4 text-[15px] font-normal">
                    {dietary.orderuuid}
                  </td>
                  <td className="">
                    <ResuableTooltip
                      text={formatCreatedAtDate(dietary.dateissued)}
                    />
                  </td>
                  <td className="">
                    <ResuableTooltip text={dietary.dietary} />
                  </td>
                  <td className="">
                    <span
                      className={`flex w-[95.68px] items-center justify-center rounded-[30px] py-1 font-semibold ${
                        dietary.status === "Discontinued"
                          ? "bg-[#FFE8EC] text-[#EF4C6A]"
                          : "bg-[#CCFFDD] text-[#17C653]"
                      }`}
                    >
                      {dietary.status === "Discontinued"
                        ? "Discontinued"
                        : "Active"}
                    </span>
                  </td>
                  <td className="w-[400px] truncate">
                    {" "}
                    <ResuableTooltip text={dietary.notes} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          isDietary && (
            <div className="container flex h-full w-full items-center justify-center py-[113px]">
              <Image
                src="/imgs/colina-logo-animation.gif"
                alt="logo"
                width={100}
                height={100}
              />
            </div>
          )
        )}
        {isLaboratory && !isLoading ? (
          <table className="table-fixed border-spacing-2 text-left rtl:text-right">
            <thead>
              <tr className="h-[70px] border-b text-[15px] font-semibold uppercase text-[#64748B]">
                <td className="pl-4">ORDER UID</td>
                <td className="">DATE ISSUED</td>
                <td className="">APPOINTMENT UID</td>
                <td className="">LABORATORY UID</td>
                <td className="px-6 py-5">
                  <DropdownMenu
                    options={optionsFilterStatus.map(({ label, onClick }) => ({
                      label,
                      onClick: () => {
                        // onClick(label);
                        // console.log("label", label);
                      },
                    }))}
                    open={isOpenFilterStatus}
                    width={"165px"}
                    statusUpdate={handleStatusUpdate} // Pass the handler function
                    checkBox={true}
                    title={"Status"}
                    label={"Status"}
                  />
                </td>
              </tr>
            </thead>
            <tbody className="h-[254px]">
              {orderLaboratoryList.map((laboratory: any, index: any) => (
                <tr
                  key={index}
                  className="group h-[63px] border-b text-[15px] hover:bg-[#f4f4f4]"
                >
                  <td className="pl-4 text-[15px] font-normal">
                    {laboratory.orderuuid}
                  </td>

                  <td className="">
                    <ResuableTooltip
                      text={formatCreatedAtDate(laboratory.dateissued)}
                    />
                  </td>
                  <td className="">
                    {laboratory.appointmentuuid} -{" "}
                    <span
                      onClick={() => (
                        setIsViewAppointment(true),
                        setAppointmentData(laboratory)
                      )}
                      className="cursor-pointer text-[#64748B]"
                    >
                      View
                    </span>{" "}
                  </td>
                  <td
                    className={` ${laboratory.laboratoryuuid ? "" : "pl-16"}`}
                  >
                    {laboratory.laboratoryuuid!=="-" ? (
                      <>
                        {laboratory.laboratoryuuid} -{" "}
                        <span
                          onClick={() => (
                            setIsViewLabResult(true),
                            setAppointmentData(laboratory)
                          )}
                          className="cursor-pointer text-[#64748B]"
                        >
                          View
                        </span>{" "}
                      </>
                    ) : (
                      "-"
                    )}
                  </td>

                  <td className="">
                    {/* <span
                          className={`w-[50px] items-center rounded-[30px] px-2 py-1 text-[15px] font-semibold ${laboratory.status === "Pending" ? "bg-[#FFF8DD] text-[#F6C000]" : "bg-[#DFFFE8] text-[#34A853]"}`}
                        >
                          {laboratory.status}
                        </span> */}
                    <span
                      className={`flex w-[109px] items-center justify-center rounded-[30px] py-1 font-semibold ${
                        laboratory.status === "pending"
                          ? "bg-[#FFF8DD] text-[#F6C000]"
                          : "bg-[#DFFFE8] text-[#34A853]"
                      }`}
                    >
                      {laboratory.status === "pending"
                        ? "Pending"
                        : "Completed"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          isLaboratory && (
            <div className="container flex h-full w-full items-center justify-center py-[113px]">
              <Image
                src="/imgs/colina-logo-animation.gif"
                alt="logo"
                width={100}
                height={100}
              />
            </div>
          )
        )}
      </div>
      <div className="flex justify-between">
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
          setCurrentPage={setCurrentPage}
        />
      </div>
      {isViewAppointment && (
        <Modal
          content={
            <AppointmentModalContent
              isModalOpen={isModalOpen}
              onSuccess={() => {}}
              isOpen={isOpen}
              isView={isViewAppointment}
              appointmentData={appointmentData}
              label="sample label"
              setIsViewAppointment={setIsViewAppointment}
            />
          }
          isModalOpen={isModalOpen}
        />
      )}
      {isViewLabResult && (
        <Modal
          content={
            <LabresultsModalContent
              label={isViewLabResult ? "ViewLabResult" : "LabResultTab"}
              isModalOpen={isModalOpen}
              isEdit={false}
              labResultData={[]}
              onSuccess={() => {}}
              setIsUpdated={{}}
              appointmentData={appointmentData}
              setIsViewLabResult={setIsViewLabResult}
            />
          }
          isModalOpen={isModalOpen}
        />
      )}
    </div>
  );
};

export default ChartOrderModal;
