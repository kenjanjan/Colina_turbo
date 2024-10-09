"use client";

import React, { useEffect } from "react";
import DropdownMenu from "@/components/dropdown-menu";
import Edit from "@/components/shared/buttons/edit";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchScheduledMedByPatient } from "@/app/api/medication-logs-api/scheduled-med-api";
import { ErrorModal } from "@/components/shared/error";
import { SuccessModal } from "@/components/shared/success";
import Image from "next/image";
import Modal from "@/components/reusable/modal";
import { ScheduledModalContent } from "@/components/modal-content/scheduled-modal-content";
import Pagination from "@/components/shared/pagination";
import ResuableTooltip from "@/components/reusable/tooltip";
import { formatTableTime } from "@/lib/utils"; // Adjust the path as needed
import { formatTableDate } from "@/lib/utils"; // Adjust the path as needed
import PdfDownloader from "@/components/pdfDownloader";
import AddButton from "@/components/reusable/addButton";

const Scheduled = () => {
  const router = useRouter();
  if (typeof window === "undefined") {
  }
  // start of orderby & sortby function
  const [isOpenOrderedBy, setIsOpenOrderedBy] = useState(false);
  const [sortOrder, setSortOrder] = useState("DESC");
  const [sortBy, setSortBy] = useState("createdAt");
  const [pageNumber, setPageNumber] = useState("");
  const [patientScheduledMed, setPatientScheduledMed] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalScheduledMeds, setTotalScheduledMeds] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scheduledMedData, setScheduledMedData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [gotoError, setGotoError] = useState(false);
  const [term, setTerm] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);

  const isModalOpen = (isOpen: boolean) => {
    setIsOpen(isOpen);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else if (!isOpen) {
      document.body.style.overflow = "visible";
      setIsEdit(false);
      setScheduledMedData([]);
    }
  };
  const [perPage, setPerPage] = useState(4);

  const params = useParams<{
    id: any;
    tag: string;
    item: string;
  }>();
  const [filterStatusFromCheck, setFilterStatusFromCheck] = useState<string[]>(
    [],
  );
  const [isOpenFilterStatus, setIsOpenFilterStatus] = useState(false);
  const handleStatusUpdate = (checkedFilters: string[]) => {
    setFilterStatusFromCheck(checkedFilters);
    // if (checkedFilters) {
    //   console.log("Checked zz in Parent:", filterStatusFromCheck);
    // }
    // Here you can further process the checked filters or update other state as needed
  };
  const optionsFilterStatus = [
    { label: "Refused", onClick: setFilterStatusFromCheck },
    { label: "Given", onClick: setFilterStatusFromCheck },
    { label: "Held", onClick: setFilterStatusFromCheck },
  ];
  const patientId = params.id.toUpperCase();

  const [isOpenSortedBy, setIsOpenSortedBy] = useState(false);
  const handleOrderOptionClick = (option: string) => {
    setIsOpenOrderedBy(false);
    if (option === "Ascending") {
      setSortOrder("ASC");
    } else {
      setSortOrder("DESC");
    }
  };
  const handleSortOptionClick = (option: string) => {
    setIsOpenSortedBy(false);
    if (option === "Date") {
      setSortBy("medicationLogsDate");
    } else if (option === "Time") {
      setSortBy("medicationLogsTime");
    } else {
      setSortBy("medicationLogsName");
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
    { label: "Medication", onClick: handleSortOptionClick },
  ]; // end of orderby & sortby function

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchScheduledMedByPatient(
          patientId,
          term,
          currentPage,
          sortBy,
          sortOrder as "ASC" | "DESC",

          filterStatusFromCheck,
          4,
          router,
        );
        setPatientScheduledMed(response.data);
        setTotalPages(response.totalPages);
        setTotalScheduledMeds(response.totalCount);
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
    isSuccessOpen,
    filterStatusFromCheck,
  ]);

  const onSuccess = () => {
    setIsSuccessOpen(true);
    setIsEdit(false);
    isModalOpen(false);
    setScheduledMedData([]);
  };
  const onFailed = () => {
    setIsErrorOpen(true);
    setIsEdit(false);
  };

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

  console.log("patientScheduledMed", patientScheduledMed);
  console.log(patientScheduledMed);
  return (
    <div className="flex h-full w-full flex-col justify-between">
      <div className="h-full w-full">
        <div className="mb-2 flex w-full justify-between">
          <div className="flex-row">
            <div className="flex gap-2">
              <p className="p-table-title">Medication Logs</p>
              <span className="slash">{">"}</span>
              <span className="active">Scheduled</span>
              <span className="slash">{"/"}</span>
              <span
                onClick={() => {
                  setIsLoading(true);
                  router.replace(
                    `/patient-overview/${patientId.toLowerCase()}/medication/prorenata`,
                  );
                }}
                className="bread"
              >
                PRN
              </span>
            </div>
            <div>
              <p className="my-1 h-[23px] text-[15px] font-normal text-[#64748B]">
                Total of {totalScheduledMeds} Scheduled Medication Logs
              </p>
            </div>
          </div>
          <div className="flex gap-2">
           <AddButton isModalOpen={isModalOpen} />
            <PdfDownloader
              props={["Uuid", "Date", "Time", "Medication", "Notes", "Status"]}
              variant={"Scheduled Medication Table"}
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
                  width="20"
                  height="20"
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

          {/* START OF TABLE */}
          <div>
            <table className="text-left rtl:text-right">
              <thead>
                <tr className="h-[70px] border-b text-[15px] font-semibold uppercase text-[#64748B]">
                  <td className="px-6 py-3">Medication UID</td>
                  <td className="px-6 py-3">Date</td>
                  <td className="px-6 py-3">Time</td>
                  <td className="px-6 py-3">Medication</td>
                  <td className="px-6 py-3">Dosage</td>
                  <td className="px-6 py-3">Notes</td>
                  <td className="relative px-6 py-3">
                    <div
                      className={`absolute ${filterStatusFromCheck?.length > 0 ? "right-[px] top-[24px]" : "right-[44px] top-[24px]"}`}
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
                  <td className="relative px-6 py-3">
                    <p className="absolute right-[80px] top-[24px]">Action</p>
                  </td>
                </tr>
              </thead>
              <tbody className="h-[254px]">
                {patientScheduledMed.length === 0 && (
                  <tr>
                    <td className="border-1 absolute flex items-center justify-center py-5">
                      <p className="text-center text-[15px] font-normal text-gray-700">
                        No Scheduled Medication Log/s <br />
                      </p>
                    </td>
                  </tr>
                )}
                {patientScheduledMed.length > 0 && (
                  <>
                    {patientScheduledMed.map((schedMed, index) => (
                      <tr
                        key={index}
                        className="group h-[63px] border-b text-[15px] hover:bg-[#f4f4f4]"
                      >
                        <td className="px-6 py-3">
                          <ResuableTooltip
                            text={schedMed.medicationlogs_uuid}
                          />
                        </td>
                        <td className="px-6 py-3">
                          {formatTableDate(
                            schedMed.medicationlogs_medicationLogsDate,
                          )}
                        </td>
                        <td className="px-6 py-3">
                          {formatTableTime(
                            schedMed.medicationlogs_medicationLogsTime,
                          )}
                          {/* time not formattd left as is for now  and check with local time of machine */}
                        </td>
                        <td className="px-6 py-3">
                          <ResuableTooltip
                            text={schedMed.medicationlogs_medicationLogsName}
                          />
                        </td>

                        <td className="px-6 py-3">
                          <ResuableTooltip
                            text={schedMed.medicationlogs_notes}
                          />
                        </td>
                        <td className="px-6 py-3">
                          {schedMed.medicationlogs_medicationLogsDosage}
                          {/* static value for dosage temporary */}
                        </td>
                        <td className="relative">
                          <div
                            className={`absolute right-[18px] top-[18px] flex h-[25px] w-[85px] items-center justify-center rounded-[30px] font-semibold ${
                              schedMed.medicationlogs_medicationLogStatus ===
                              "Given"
                                ? "bg-[#CCFFDD] text-[#17C653]" // Green color for Given
                                : schedMed.medicationlogs_medicationLogStatus ===
                                    "Held"
                                  ? "h-[25px] bg-[#FFF8DD] px-7 text-center text-[#F6C000]" // Dark color for Held
                                  : schedMed.medicationlogs_medicationLogStatus ===
                                      "Refused"
                                    ? "h-[25px] w-[85px] bg-[#FFE8EC] text-[#DB3956]" // Red color for Refused
                                    : schedMed.medicationlogs_medicationLogStatus
                            }`}
                          >
                            {schedMed.medicationlogs_medicationLogStatus}
                          </div>
                        </td>

                        <td className="relative py-3 pl-6">
                          <p
                            onClick={() => {
                              isModalOpen(true);
                              setIsEdit(true);
                              setScheduledMedData(schedMed);
                            }}
                            className="absolute right-[40px] top-[11px]"
                          >
                            <Edit></Edit>
                          </p>
                        </td>
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </table>
          </div>
          {/* END OF TABLE */}
        </div>
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
            <ScheduledModalContent
              isModalOpen={isModalOpen}
              uuid=""
              name=""
              aschData={""}
              isOpen={isOpen}
              isEdit={isEdit}
              scheduledMedData={scheduledMedData}
              label="sample label"
              onSuccess={onSuccess}
              onFailed={onFailed}
              setIsUpdated={setIsUpdated}
              setErrorMessage={setError}
            />
          }
          isModalOpen={isModalOpen}
        />
      )}
      {isSuccessOpen && (
        <SuccessModal
          label="Success"
          isAlertOpen={isSuccessOpen}
          toggleModal={setIsSuccessOpen}
          isUpdated={isUpdated}
          setIsUpdated={setIsUpdated}
        />
      )}
      {isErrorOpen && (
        <ErrorModal
          label="Scheduled Log already exist"
          isAlertOpen={isErrorOpen}
          toggleModal={setIsErrorOpen}
          isEdit={isEdit}
          errorMessage={error}
        />
      )}
    </div>
  );
};

export default Scheduled;
