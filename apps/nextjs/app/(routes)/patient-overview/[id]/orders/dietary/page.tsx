"use client";
import PdfDownloader from "@/components/pdfDownloader";
import Pagination from "@/components/shared/pagination";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import ResuableTooltip from "@/components/reusable/tooltip";
import TableTop from "@/components/reusable/tableTop";
import View from "@/components/shared/buttons/view";
import DropdownMenu from "@/components/dropdown-menu";
import { useEditContext } from "../../editContext";
import { cn } from "@/lib/utils";
import OrderModalContent from "@/components/modal-content/order-modal-content";
import Modal from "@/components/reusable/modal";

const Dietary = () => {
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
  const [isOrder, setIsOrder] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<any>({});
  const [isOpen, setIsOpen] = useState(false);
  const [filterStatusFromCheck, setFilterStatusFromCheck] = useState<string[]>(
    [],
  );
  const { isOpenHovered } = useEditContext();
  console.log(isOpenHovered, "isOpenHovered");
  const optionsFilterStatus = [
    { label: "Active", onClick: setFilterStatusFromCheck },
    { label: "Inactive", onClick: setFilterStatusFromCheck },
  ]; // end of status function

  const handleStatusUpdate = (checkedFilters: string[]) => {
    setFilterStatusFromCheck(checkedFilters);

    // Here you can further process the checked filters or update other state as needed
  };

  const mockPrescriptions = [
    {
      orderUid: "ORD-AEDB6CN2",
      dateIssued: "Apr 21 2024",
      dietary_requirement: "Pure Diet",
      status: "Active",
      notes:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    },
    {
      orderUid: "ORD-AEDB6CN2",
      dateIssued: "Apr 21 2024",
      dietary_requirement: "Pure Diet",
      status: "Inactive",
      notes:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    },
    {
      orderUid: "ORD-AEDB6CN2",
      dateIssued: "Apr 21 2024",
      dietary_requirement: "Pure Diet",
      status: "Inactive",
      notes:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    },
    {
      orderUid: "ORD-AEDB6CN2",
      dateIssued: "Apr 21 2024",
      dietary_requirement: "Pure Diet",
      status: "Active",
      notes:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    },
    {
      orderUid: "ORD-AEDB6CN2",
      dateIssued: "Apr 21 2024",
      dietary_requirement: "Pure Diet",
      status: "Inactive",
      notes:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    },
    {
      orderUid: "ORD-AEDB6CN2",
      dateIssued: "Apr 21 2024",
      dietary_requirement: "Pure Diet",
      status: "Inactive",
      notes:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    },
    {
      orderUid: "ORD-AEDB6CN2",
      dateIssued: "Apr 21 2024",
      dietary_requirement: "Pure Diet",
      status: "Inactive",
      notes:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
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
    { label: "DATE ISSUED", onClick: handleSortOptionClick },
    { label: "DIETARY REQUIREMENT", onClick: handleSortOptionClick },
    { label: "NOTES", onClick: handleSortOptionClick },
  ]; // end of orderby & sortby functions

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
  const paginatedPrescriptions = paginate(
    mockPrescriptions,
    currentPage,
    perPage,
  );

  useEffect(() => {
    const fetchData = async () => {
      const totalPages = Math.ceil(mockPrescriptions.length / 4);
      setTotalPages(totalPages);
      setTotalOrder(mockPrescriptions.length);
    };

    fetchData();
  }, [currentPage, sortOrder, sortBy, term]);

  const isModalOpen = (isOpen: boolean) => {
    setIsOpen(isOpen);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else if (!isOpen) {
      document.body.style.overflow = "visible";
    }
  };
  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex-grow">
        <div className="flex w-full justify-between">
          <div className="flex-row">
            <div className="flex gap-2">
              <p className="p-table-title">Order</p>
              <p className="slash">{">"}</p>
              <p
                onClick={() => {
                  router.replace(
                    `/patient-overview/${patientId.toLowerCase()}/orders/prescription`,
                  );
                }}
                className="bread"
              >
                Prescription
              </p>
              <span className="slash">/</span>
              <p className="active">Dietary</p>
              <span className="slash">/</span>
              <p
                onClick={() => {
                  router.replace(
                    `/patient-overview/${patientId.toLowerCase()}/orders/laboratory`,
                  );
                }}
                className="bread"
              >
                Laboratory
              </p>
            </div>
            <div>
              <p className="my-1 h-[23px] text-[15px] font-normal text-[#64748B]">
                Total of {totalOrder} Dietary Orders
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
              <td className="w-[200px] pl-4">ORDER UID</td>
              <td className="w-[200px]">DATE ISSUED</td>
              <td className="w-[200px]">DIETARY REQUIREMENT</td>
              <td className="w-[200px]">
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
              <td className="w-[500px]">NOTES</td>
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
                <td className="w-[200px] pl-4 text-[15px] font-normal">
                  {prescription.orderUid}
                </td>
                <td className="w-[200px]">
                  <ResuableTooltip text={prescription.dateIssued} />
                </td>
                <td className="w-[200px]">
                  <ResuableTooltip text={prescription.dietary_requirement} />
                </td>
                <td className="w-[200px]">
                  <span
                    className={`flex w-[109px] items-center justify-center rounded-[30px] py-1 font-semibold ${
                      prescription.status === "Inactive"
                        ? "bg-[#FFE8EC] text-[#EF4C6A]"
                        : "bg-[#CCFFDD] text-[#17C653]"
                    }`}
                  >
                    {prescription.status === "Inactive" ? "Inactive" : "Active"}
                  </span>
                </td>
                <td className="w-[500px]">
                  {" "}
                  <ResuableTooltip text={prescription.notes} />
                </td>

                <td className="relative py-3 pl-4">
                  <p className="absolute right-[40px] top-[11px]" onClick={()=>{
                    setSelectedData(prescription);
                    setIsOrderModalOpen(true);
                  }}>
                    <View />
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
      {isOrderModalOpen && (
        <Modal
          content={
            <OrderModalContent
              tab={"Dietary"}
              isModalOpen={isModalOpen}
              isOrder={isOrder}
              data={selectedData}
              setIsOrder={setIsOrder}
              setIsOrderModalOpen={setIsOrderModalOpen}
            />
          }
          isModalOpen={isModalOpen}
        />
      )}
    </div>
  );
};

export default Dietary;
