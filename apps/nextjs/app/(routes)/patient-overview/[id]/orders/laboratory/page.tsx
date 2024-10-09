"use client";

import PdfDownloader from "@/components/pdfDownloader";
import Pagination from "@/components/shared/pagination";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import ResuableTooltip from "@/components/reusable/tooltip";
import TableTop from "@/components/reusable/tableTop";
import DropdownMenu from "@/components/dropdown-menu";
import View from "@/components/shared/buttons/view";
import { LabresultsModalContent } from "@/components/modal-content/labresults-modal-content";
import Modal from "@/components/reusable/modal";
import { SuccessModal } from "@/components/shared/success";

const Laboratory = () => {
  const router = useRouter();
  const params = useParams<{
    id: any;
    tag: string;
    item: string;
  }>();

  const patientId = params.id.toUpperCase();
  const [term, setTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(5);
  const [pageNumber, setPageNumber] = useState("");
  const [sortBy, setSortBy] = useState("dateIssued");
  const [sortOrder, setSortOrder] = useState("ASC");
  const [isOpenOrderedBy, setIsOpenOrderedBy] = useState(false);
  const [isOpenSortedBy, setIsOpenSortedBy] = useState(false);
  const [totalOrder, setTotalOrder] = useState<number>(0);
  const [isOpenFilterStatus, setIsOpenFilterStatus] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [filterStatusFromCheck, setFilterStatusFromCheck] = useState<string[]>(
    [],
  );

  const mockLaboratory = [
    {
      orderUid: "ORD-AEDB6CN2",
      dateIssued: "Apr 21 2024",
      prescriptionUid: "PRC-AEDB6CB1",
      appointmentUid: "LBR-7890124567891",
      laboratoryUid: "",
      status: "Pending",
    },
    {
      orderUid: "ORD-AEDB6CN2",
      dateIssued: "Apr 21 2024",
      prescriptionUid: "PRC-AEDB6CB1",
      appointmentUid: "LBR-7890124567891",
      laboratoryUid: "LBR-7890124567891",
      status: "Done",
    },
    {
      orderUid: "ORD-AEDB6CN2",
      dateIssued: "Apr 21 2024",
      prescriptionUid: "PRC-AEDB6CB1",
      appointmentUid: "LBR-7890124567891",
      laboratoryUid: "LBR-7890124567891",
      status: "Done",
    },
    {
      orderUid: "ORD-AEDB6CN2",
      dateIssued: "Apr 21 2024",
      prescriptionUid: "PRC-AEDB6CB1",
      appointmentUid: "LBR-7890124567891",
      laboratoryUid: "",
      status: "Done",
    },
  ];

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
    if (option === "ADLs") {
      setSortBy("adls");
    } else if (option === "Date Created") {
      setSortBy("createdAt");
    } else {
      setSortBy("notes");
    }
    console.log("option", option);
  };

  const optionsOrderedBy = [
    { label: "Ascending", onClick: handleOrderOptionClick },
    { label: "Descending", onClick: handleOrderOptionClick },
  ];
  const optionsSortBy = [
    { label: "Date", onClick: handleSortOptionClick },
    { label: "Appointment", onClick: handleSortOptionClick },
    { label: "Laboratory", onClick: handleSortOptionClick },
  ]; // end of orderby & sortby functions

  const optionsFilterStatus = [
    { label: "Done", onClick: setFilterStatusFromCheck },
    { label: "Pending", onClick: setFilterStatusFromCheck },
  ]; // end of status function

  const handleStatusUpdate = (checkedFilters: string[]) => {
    setFilterStatusFromCheck(checkedFilters);

    // Here you can further process the checked filters or update other state as needed
  };

  const handleGoToPage = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    const pageNumberInt = parseInt(pageNumber, 10);
    if (
      !isNaN(pageNumberInt) &&
      pageNumberInt > 0 &&
      pageNumberInt <= totalPages
    ) {
      setCurrentPage(pageNumberInt);
    }
  };

  const perPage = 4; // Set entries per page

  // Function to paginate data
  const paginate = (data: any, currentPage: any, perPage: any) => {
    const offset = (currentPage - 1) * perPage;
    return data.slice(offset, offset + perPage);
  };

  // Use the function to get the paginated data
  const paginatedPrescriptions = paginate(mockLaboratory, currentPage, perPage);

  useEffect(() => {
    const fetchData = async () => {
      const totalPages = Math.ceil(mockLaboratory.length / 4);
      filterStatusFromCheck;
      setTotalPages(totalPages);
      setTotalOrder(mockLaboratory.length);
    };

    fetchData();
  }, [currentPage, sortOrder, sortBy, term, filterStatusFromCheck]);

  useEffect(() => {
    setFilterStatusFromCheck(filterStatusFromCheck);
    // const newLabel = filterStatusFromCheck.length > 0 ? filterStatusFromCheck.join(", "):"Status"
    const newLabel =
      filterStatusFromCheck.length > 0
        ? `${filterStatusFromCheck.length} Status Selected`
        : "Status";

    // setStatusFiltered(newLabel);
    console.log(filterStatusFromCheck.join(", "), "parent");
    console.log(newLabel, "new parent");
  }, [filterStatusFromCheck]);


  const isModalOpen = (isOpen: boolean) => {
    setIsOpen(isOpen);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else if (!isOpen) {
      document.body.style.overflow = "visible";
    }
  };

  const onSuccess = () => {
    setIsSuccessOpen(true);
    isModalOpen(false);
  };

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex-grow">
        <div className="flex w-full justify-between">
          <div className="flex-row">
            <div className="flex gap-2">
              <p className="p-table-title">Order</p>
              <p className="slash">{">"}</p>
              <span
                onClick={() => {
                  router.replace(
                    `/patient-overview/${patientId.toLowerCase()}/orders/prescription`,
                  );
                }}
                className="bread"
              >
                Prescription
              </span>
              <span className="bread">/</span>
              <p
                onClick={() => {
                  router.replace(
                    `/patient-overview/${patientId.toLowerCase()}/orders/dietary`,
                  );
                }}
                className="bread"
              >
                Dietary
              </p>
              <span className="slash">/</span>
              <p className="active">Laboratory</p>
            </div>
            <div>
              <p className="my-1 h-[23px] text-[15px] font-normal text-[#64748B]">
                Total of {totalOrder} Laboratory Orders
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {/* WIP */}
            <PdfDownloader
              props={[
                "Uuid",
                "ORDER UID",
                "PRESCRIPTION UID",
                "DATE ISSUED",
                "EXPIRY DATE",
                "MEDICINE NAME",
                "DOSAGE",
                "STATUS",
              ]}
              variant={"Archived Forms Table"}
              patientId={patientId}
            />
            {/* WIP */}
          </div>
        </div>
      </div>

      {/* Search and sort */}
      <div className="w-full items-center pt-2 sm:rounded-lg">
        <TableTop
          isOpenOrderedBy={isOpenOrderedBy}
          isOpenSortedBy={isOpenSortedBy}
          optionsOrderedBy={optionsOrderedBy}
          optionsSortBy={optionsSortBy}
          term={term}
          setTerm={setTerm}
          setCurrentPage={setPageNumber}
        />
      </div>

      {/* Prescription table */}
      <div>
        <table className="w-full table-fixed border-spacing-2 text-left rtl:text-right">
          <thead>
            <tr className="h-[70px] border-b text-[15px] font-semibold uppercase text-[#64748B]">
              <td className="w-[250px] pl-4">ORDER UID</td>
              <td className="w-[200px]">DATE ISSUED</td>
              <td className="w-[300px]">APPOINTMENT UID</td>
              <td className="w-[300px]">LABORATORY UID</td>
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
              <td className="relative">
                <p className="absolute right-[80px] top-[24px]">Action</p>
              </td>
            </tr>
          </thead>
          <tbody className="h-[254px]">
            {paginatedPrescriptions.map((prescription: any, index: any) => (
              <tr
                key={index}
                className="group h-[63px] border-b text-[15px] hover:bg-[#f4f4f4]"
              >
                <td className="w-[250px] pl-4 text-[15px] font-normal">
                  {prescription.orderUid}
                </td>

                <td className="w-[200px]">
                  <ResuableTooltip text={prescription.dateIssued} />
                </td>
                <td className="w-[300px]">
                  {prescription.appointmentUid} -{" "}
                  <span
                    // onclick function
                    className="cursor-pointer text-[#64748B]"
                  >
                    View
                  </span>
                </td>
                <td
                  className={`w-[300px] ${prescription.laboratoryUid ? "" : "pl-16"}`}
                >
                  {prescription.laboratoryUid ? (
                    <>
                      {prescription.laboratoryUid} -{" "}
                      <span
                        // onClick function here
                        className="cursor-pointer text-[#64748B]"
                      >
                        View
                      </span>
                    </>
                  ) : (
                    "-"
                  )}
                </td>

                <td className="w-[200px]">
                  {/* <span
                    className={`w-[50px] items-center rounded-[30px] px-2 py-1 text-[15px] font-semibold ${prescription.status === "Pending" ? "bg-[#FFF8DD] text-[#F6C000]" : "bg-[#DFFFE8] text-[#34A853]"}`}
                  >
                    {prescription.status}
                  </span> */}
                  <span
                    className={`flex w-[109px] items-center justify-center rounded-[30px] py-1 font-semibold ${
                      prescription.status === "Pending"
                        ? "bg-[#FFF8DD] text-[#F6C000]"
                        : "bg-[#DFFFE8] text-[#34A853]"
                    }`}
                  >
                    {prescription.status === "Pending" ? "Pending" : "Done"}
                  </span>
                </td>
                <td className="relative py-3 pl-6">
                  <p className="absolute right-[40px] top-[11px]" onClick={() => isModalOpen(true)} >
                    <View name="Add" />
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between">
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
          setCurrentPage={setCurrentPage}
        />
      </div>
      {isOpen && (
        <Modal
          content={
            <LabresultsModalContent
              isModalOpen={isModalOpen}
              isEdit={false}
              labResultData={[]}
              onSuccess={onSuccess}
              setIsUpdated={{}}
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
          isUpdated={false}
          setIsUpdated={{}}
        />
      )}
    </div>
  );
};

export default Laboratory;
