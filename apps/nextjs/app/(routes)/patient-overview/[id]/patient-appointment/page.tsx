"use client";
import Image from "next/image";

import React, { useEffect } from "react";
import DropdownMenu from "@/components/dropdown-menu";
import Add from "@/components/shared/buttons/add";
import DownloadPDF from "@/components/shared/buttons/downloadpdf";
import View from "@/components/shared/buttons/view";
import { useState } from "react";
import { onNavigate } from "@/actions/navigation";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { fetchAppointmentsByPatient as fetchAppointmentsByPatient } from "@/app/api/appointments-api/appointments.api";
import { AppointmenViewModalContent } from "@/components/modal-content/appointmentview-modal-content";
import Modal from "@/components/reusable/modal";
import { AppointmentModalContent } from "@/components/modal-content/appointment-modal-content";
import { ClipboardList } from "lucide-react";
import { AppointmentemailModalContent } from "@/components/modal-content/appointmentemail-modal-content";
import { SuccessModal } from "@/components/shared/success";
import { ErrorModal } from "@/components/shared/error";
import Pagination from "@/components/shared/pagination";
import ResuableTooltip from "@/components/reusable/tooltip";
import PdfDownloader from "@/components/pdfDownloader";
import Edit from "@/components/shared/buttons/edit";
import { useEditContext } from "@/app/(routes)/patient-overview/[id]/editContext";
import OrderModalContent from "@/components/modal-content/order-modal-content";

const Appointment = () => {
  const router = useRouter();
  if (typeof window === "undefined") {
  }
  const { isOpenHovered } = useEditContext();

  const searchParams = useSearchParams();
  const [appointmentId, setAppointmentId] = useState(searchParams.get("id"));
  const [isOpenOrderedBy, setIsOpenOrderedBy] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEdit, setIsEdit] = useState(false);
  const [isView, setIsView] = useState(false);
  const [isOrder, setIsOrder] = useState(false);
  console.log(isEdit, "isEdit");
  const [isUpdated, setIsUpdated] = useState(false);
  const formatDate = (createdAt: string | number | Date) => {
    // Create a new Date object from the provided createdAt date string
    const date = new Date(createdAt);

    // Get the month, day, and year
    const month = date.toLocaleString("default", { month: "short" });
    const day = date.getDate();
    const year = date.getFullYear();

    const formattedDate = `${month} ${day}, ${year}`;

    return formattedDate;
  };
  const formatTime = (timeString: string) => {
    // Split the time string into hours and minutes
    const [hours, minutes] = timeString.split(":").map(Number);

    // Format the hours part into 12-hour format
    let formattedHours = hours % 12 || 12; // Convert 0 to 12
    const ampm = hours < 12 ? "am" : "pm"; // Determine if it's AM or PM

    // If minutes is undefined or null, set it to 0
    const formattedMinutes =
      minutes !== undefined ? minutes.toString().padStart(2, "0") : "00";

    // Return the formatted time string
    return `${formattedHours}:${formattedMinutes}${ampm}`;
  };
  const [error, setError] = useState<string | null>(null);
  const handleGoToPage = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();

    const pageNumberInt = parseInt(pageNumber, 10);

    // Check if pageNumber is a valid number and greater than 0
    if (
      !isNaN(pageNumberInt) &&
      pageNumberInt <= totalPages &&
      pageNumberInt > 0
    ) {
      setCurrentPage(pageNumberInt);

      console.log("Navigate to page:", pageNumberInt);
    } else {
      setGotoError(true);
      setTimeout(() => {
        setGotoError(false);
      }, 3000);
      console.error("Invalid page number:", pageNumber);
    }
  };
  const [appointmentData, setAppointmentData] = useState<any[]>([]);
  const [patientAppointments, setPatientAppointments] = useState<any[]>([]);
  const [term, setTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("DESC");
  const [sortBy, setSortBy] = useState("appointmentDate");
  const [pageNumber, setPageNumber] = useState("");
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalAppointments, setTotalAppointments] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isOpenSortedBy, setIsOpenSortedBy] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const handleOrderOptionClick = (option: string) => {
    if (option === "Ascending") {
      setSortOrder("ASC");
    } else {
      setSortOrder("DESC");
    }
  };

  const params = useParams<{
    id: any;
    tag: string;
    item: string;
  }>();

  const patientId = params.id.toUpperCase();

  const handleSortOptionClick = (option: string) => {
    setIsOpenSortedBy(false);
    if (option === "Date") {
      setSortBy("appointmentDate");
    } else if (option === "Time") {
      setSortBy("appointmentTime");
    } else {
      setSortBy("appointmentStatus");
    }
    console.log("option", option);
  };
  const optionsOrderedBy = [
    { label: "Ascending", onClick: handleOrderOptionClick },
    { label: "Descending", onClick: handleOrderOptionClick },
  ];
  const optionsSortBy = [
    { label: "Date", onClick: handleSortOptionClick },
    { label: "Time", onClick: handleSortOptionClick },
    { label: "Status", onClick: handleSortOptionClick },
  ]; // end of orderby & sortby function
  const [gotoError, setGotoError] = useState(false);
  const [filterStatusFromCheck, setFilterStatusFromCheck] = useState<string[]>(
    [],
  );
  const [filterTypeFromCheck, setFilterTypeFromCheck] = useState<string[]>([]);
  const [isOpenFilterStatus, setIsOpenFilterStatus] = useState(false);
  const handleStatusUpdate = (checkedFilters: string[]) => {
    setFilterStatusFromCheck(checkedFilters);
  };
  const handleTypeUpdate = (checkedFilters: string[]) => {
    setFilterTypeFromCheck(checkedFilters);
  };
  const optionsFilterStatus = [
    { label: "Scheduled", onClick: setFilterStatusFromCheck },
    { label: "Patient-IN", onClick: setFilterStatusFromCheck },
    { label: "On-going", onClick: setFilterStatusFromCheck },
    { label: "Cancelled", onClick: setFilterStatusFromCheck },
    { label: "Missed", onClick: setFilterStatusFromCheck },
    { label: "Done", onClick: setFilterStatusFromCheck },
  ];
  const optionsFilterType = [
    { label: "Podiatrist", onClick: setFilterTypeFromCheck },
    { label: "ER Visit", onClick: setFilterTypeFromCheck },
    { label: "Doctor's", onClick: setFilterTypeFromCheck },
    { label: "Dental", onClick: setFilterTypeFromCheck },
    { label: "Eye", onClick: setFilterTypeFromCheck },
    { label: "Others", onClick: setFilterTypeFromCheck },
  ];
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenReminder, setIsOpenReminder] = useState(false);

  const isModalOpen = (isOpen: boolean) => {
    setIsOpen(isOpen);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else if (!isOpen) {
      document.body.style.overflow = "visible";
      setIsEdit(false);
      setIsView(false);
      setAppointmentData([]);
    }
  };

  const isModalReminderOpen = (isOpen: boolean) => {
    setIsOpenReminder(isOpen);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else if (!isOpen) {
      document.body.style.overflow = "visible";
      setIsEdit(false);
      setAppointmentData([]);
    }
  };

  const onSuccess = () => {
    setIsEdit(false);
    setIsView(false);
    isModalOpen(false);
    setIsSuccessOpen(true);
  };
  const onFailed = () => {
    setIsErrorOpen(true);
    setIsEdit(false);
    setIsView(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchAppointmentsByPatient(
          patientId,
          appointmentId != null && term == "" ? appointmentId : term,
          currentPage,
          sortBy,
          sortOrder as "ASC" | "DESC",
          filterStatusFromCheck,
          filterTypeFromCheck,
          4,
          router,
        );

        //convert date to ISO string

        setPatientAppointments(response.data);
        console.log("Patient list after setting state:", response.data);
        setTotalPages(response.totalPages);
        setTotalAppointments(response.totalCount);
        setIsLoading(false);
      } catch (error: any) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [
    currentPage,
    sortOrder,
    sortBy,
    term,
    isOpen,
    filterStatusFromCheck,
    filterTypeFromCheck,
  ]);

  useEffect(() => {
    if (term != "") {
      setAppointmentId("");
    }
  }, [term]);
  useEffect(() => {
    console.log(isOpenHovered, "OPENHOVERED IN PAGE");
  }, [isOpenHovered]);

  if (isLoading) {
    return (
      <div className="container flex h-full w-full items-center justify-center">
        <Image
          src="/imgs/colina-logo-animation.gif"
          alt="logo"
          width={100}
          height={100}
        />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col justify-between overflow-hidden">
      <div className="h-full w-full overflow-hidden">
        <div className="mb-2 flex w-full justify-between">
          <div className="flex-row">
            <p className="p-table-title">Appointment</p>

            <div>
              <p className="my-1 h-[23px] text-[15px] font-normal text-[#64748B]">
                Total of {totalAppointments} Appointments
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => isModalOpen(true)} className="btn-add gap-2">
              <Image src="/imgs/add.svg" alt="" width={18} height={18} />
              <p className="">Add</p>
            </button>
            <PdfDownloader
              props={["Uuid", "Date", "Time", "End_time", "Details", "Status"]}
              variant={"Appointment Table"}
              patientId={patientId}
            />
          </div>
        </div>

        <div className="m:rounded-lg w-full items-center">
          <div className="flex h-[75px] w-full items-center justify-between bg-[#F4F4F4]">
            <form className="relative mr-5">
              {/* search bar */}
              <label className=""></label>
              <div className="flex">
                <input
                  className="relative mx-5 my-4 h-[47px] w-[460px] rounded-[3px] border-[1px] border-[#E7EAEE] bg-[#fff] bg-[center] bg-no-repeat px-5 py-3 pl-10 pt-[14px] text-[15px] outline-none placeholder:text-[#64748B]"
                  type="text"
                  placeholder="Search by reference no. or name..."
                  value={term}
                  onChange={(e) => {
                    setTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
                <Image
                  src="/svgs/search.svg"
                  alt="Search"
                  width={20}
                  height={20}
                  className="pointer-events-none absolute left-8 top-8"
                />
              </div>
            </form>

            <div className="mr-3 flex w-full items-center justify-end gap-[12px]">
              <p className="text-[15px] font-semibold text-[#191D23] opacity-[60%]">
                Order by
              </p>
              <DropdownMenu
                options={optionsOrderedBy.map(({ label, onClick }) => ({
                  label,
                  onClick: () => {
                    onClick(label);
                  },
                }))}
                open={isOpenOrderedBy}
                width={"165px"}
                label={"Select"}
              />
              <p className="text-[15px] font-semibold text-[#191D23] opacity-[60%]">
                Sort by
              </p>
              <DropdownMenu
                options={optionsSortBy.map(({ label, onClick }) => ({
                  label,
                  onClick: () => {
                    onClick(label);
                    console.log("label", label);
                  },
                }))}
                open={isOpenSortedBy}
                width={"165px"}
                label={"Select"}
              />
            </div>
          </div>
        </div>
        {/* START OF TABLE */}
        <div>
          <table className="text-left rtl:text-right">
            <thead>
              <tr className="h-[70px] border-b text-[15px] font-semibold uppercase text-[#64748B]">
                <td className="w-[10%] py-3 pl-4">APPOINTMENT UID</td>
                <td className="w-[9%] py-3">DATE</td>
                <td className="w-[11.5%] py-3">DOCTOR'S NAME</td>
                <td className="w-[6%] py-3">TIME</td>
                <td className="w-[6.5%] py-3">END TIME</td>
                <td className="relative w-[9%]">
                  <div
                    className={`absolute ${filterStatusFromCheck?.length > 0 ? "top-[24px]" : "top-[24px]"}`}
                  >
                    <DropdownMenu
                      options={optionsFilterType.map(({ label, onClick }) => ({
                        label,
                        onClick: () => {},
                      }))}
                      open={isOpenFilterStatus}
                      width={"165px"}
                      statusUpdate={handleTypeUpdate}
                      checkBox={true}
                      title={"Type"}
                      label={"Type"}
                    />
                  </div>
                </td>
                <td className="w-[9%] py-3">DETAILS</td>
                <td className="relative w-[11%]">
                  <div
                    className={`absolute ${filterStatusFromCheck?.length > 0 ? "left-[90px] top-[24px]" : "left-[90px] top-[24px]"}`}
                  >
                    <DropdownMenu
                      options={optionsFilterStatus.map(
                        ({ label, onClick }) => ({
                          label,
                          onClick: () => {},
                        }),
                      )}
                      open={isOpenFilterStatus}
                      width={"165px"}
                      statusUpdate={handleStatusUpdate}
                      checkBox={true}
                      title={"Status"}
                      label={"Status"}
                    />
                  </div>
                </td>
                <td className="relative w-[18%] px-6 py-3">
                  <p className="absolute right-[114px] top-[24px]">ACTION</p>
                </td>
              </tr>
            </thead>
            <tbody className="h-[254px]">
              {patientAppointments.length === 0 && (
                <tr>
                  <td className="border-1 absolute flex w-full items-center justify-center py-5">
                    <p className="text-center text-[15px] font-normal text-gray-700">
                      No Appointment/s <br />
                    </p>
                  </td>
                </tr>
              )}
              <div className="w-full">
                {patientAppointments.length > 0 && (
                  <table className="min-w-full table-fixed ">
                    <tbody>
                      {patientAppointments.map((appointments, index) => (
                        <tr
                          key={index}
                          className="group h-[63px] border-b text-[14px] hover:bg-[#f4f4f4]"
                        >
                          <td className="w-[11%] truncate py-2 pl-4">
                            {appointments.appointments_uuid}
                          </td>
                          <td className="w-[10%] truncate py-2">
                            {formatDate(
                              appointments.appointments_appointmentDate,
                            )}
                          </td>
                          <td className="w-[13%] truncate py-2">
                            <ResuableTooltip
                              text={appointments.appointments_appointmentDoctor}
                            />
                          </td>
                          <td className="w-[7%] truncate py-2">
                            {formatTime(
                              appointments.appointments_appointmentTime,
                            )}
                          </td>
                          <td className="w-[7%] truncate py-2">
                            {formatTime(
                              appointments.appointments_appointmentEndTime,
                            )}
                          </td>
                          <td className="w-[10%] truncate py-2">
                            <ResuableTooltip
                              text={appointments.appointments_appointmentType}
                            />
                          </td>
                          <td className="w-[15%] truncate py-2">
                            <ResuableTooltip
                              text={appointments.appointments_details}
                            />
                          </td>
                          <td className="py-2 w-[10%]">
                            <div
                              className={`relative  flex h-[25px] w-[90px] items-center justify-center rounded-[30px] text-[14px] font-semibold capitalize ${
                                appointments.appointments_appointmentStatus ===
                                "Scheduled"
                                  ? "bg-[#E7EAEE] text-[#71717A]"
                                  : appointments.appointments_appointmentStatus ===
                                      "Done"
                                    ? "bg-[#CCFFDD] text-[#17C653]"
                                    : appointments.appointments_appointmentStatus ===
                                          "Patient-IN" ||
                                        appointments.appointments_appointmentStatus ===
                                          "On-going"
                                      ? "bg-[#FFF8DD] text-[#F6C000]"
                                      : appointments.appointments_appointmentStatus ===
                                            "Missed" ||
                                          appointments.appointments_appointmentStatus ===
                                            "Cancelled" ||
                                          appointments.appointments_appointmentStatus ===
                                            "Resched"
                                        ? "bg-[#FFE8EC] text-[#EF4C6A]"
                                        : ""
                              }`}
                            >
                              {appointments.appointments_appointmentStatus}
                            </div>
                          </td>
                          <td className="flex w-[15%] gap-x-2 py-2">
                            <p
                              onClick={() => {
                                isModalOpen(true);
                                setIsEdit(true);
                                setIsView(false);
                                setAppointmentData(appointments);
                              }}
                            >
                              <Edit className="w-[76px]" />
                            </p>
                            <p
                              onClick={() => {
                                isModalOpen(true);
                                setIsView(true);
                                setIsEdit(false);
                                setAppointmentData(appointments);
                              }}
                            >
                              <View name="View" className="w-[76px]" />
                            </p>
                            <p
                              onClick={() => {
                                setAppointmentId(
                                  appointments.appointments_uuid,
                                );
                                setIsOrder(true);
                              }}
                            >
                              <View name="Order" className="w-[76px]" />
                            </p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </tbody>
          </table>
        </div>
        {/* END OF TABLE */}
      </div>
      {/* pagination */}
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
        setCurrentPage={setCurrentPage}
      />
      {isOpen && (
        <Modal
          content={
            <AppointmentModalContent
              isModalOpen={isModalOpen}
              onSuccess={onSuccess}
              isOpen={isOpen}
              isView={isView}
              isEdit={isEdit}
              appointmentData={appointmentData}
              label="sample label"
            />
          }
          isModalOpen={isModalOpen}
        />
      )}
      {isView && (
        <Modal
          content={
            <AppointmenViewModalContent
              isModalOpen={isModalOpen}
              isView={isView}
              appointmentData={appointmentData}
              // isView={isView}
              // prescriptionData={prescriptionData}
            />
          }
          isModalOpen={isModalOpen}
        />
      )}
      {isOrder && (
        <Modal
          content={
            <OrderModalContent
              isModalOpen={isModalOpen}
              isOrder={isOrder}
              data={appointmentData}
              setIsOrder={setIsOrder}
              appointmentId={appointmentId ?? undefined}
              onSuccess={onSuccess}
              setErrorMessage={setError}
              onFailed={onFailed}
            />
          }
          isModalOpen={isModalOpen}
        />
      )}

      {isOpenReminder && (
        <Modal
          content={
            <AppointmentemailModalContent
              onSuccess={onSuccess}
              onFailed={onFailed}
              isModalOpen={isModalReminderOpen}
            />
          }
          isModalOpen={isModalOpen}
        />
      )}

      {isSuccessOpen && (
        <SuccessModal
          label={isEdit ? "Updated" : "Submitted"}
          isAlertOpen={isSuccessOpen}
          toggleModal={setIsSuccessOpen}
          isUpdated={isEdit}
          setIsUpdated={setIsUpdated}
        />
      )}
      {isErrorOpen && (
        <ErrorModal
          label="Sending Email Failed"
          isAlertOpen={isErrorOpen}
          toggleModal={setIsErrorOpen}
          isEdit={isEdit}
          errorMessage={error}
        />
      )}
    </div>
  );
};

export default Appointment;
