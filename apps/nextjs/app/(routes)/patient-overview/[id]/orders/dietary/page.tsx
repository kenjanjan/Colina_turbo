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
import { formatCreatedAtDate } from "@/lib/utils";
import OrderModalContent from "@/components/modal-content/order-modal-content";
import Modal from "@/components/reusable/modal";
import { fetchOrdersDietaryByPatient } from "@/app/api/orders/orders-dietary-api";

const Dietary = () => {
  const router = useRouter();
  const params = useParams<{
    id: any;
    tag: string;
    item: string;
  }>();

  const patientId = params.id.toUpperCase();
  const [term, setTerm] = useState<string>("");

  const [isOpenOrderedBy, setIsOpenOrderedBy] = useState(false);
  const [isOpenSortedBy, setIsOpenSortedBy] = useState(false);
  // const [totalOrder, setTotalOrder] = useState<number>(0);
  const [isOpenFilterStatus, setIsOpenFilterStatus] = useState(false);
  const [isOrder, setIsOrder] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<any>({});
  const [isOpen, setIsOpen] = useState(false);

  const [filterStatusFromCheck, setFilterStatusFromCheck] = useState<string[]>(
    [],
  );
  const [orderDietaryList, setOrderDietaryList] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [pageNumber, setPageNumber] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("ASC");
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchOrdersDietaryByPatient(
          patientId,
          term,
          currentPage,
          sortBy,
          "ASC",
          4,
          filterStatusFromCheck,
          router,
        );
        setOrderDietaryList(response.data);
        setTotalPages(response.totalPages);
        setTotalOrders(response.totalCount);
        console.log(response, "denn");
      } catch (error: any) {
        setError(error.message);
      }
    };
    fetchData();
  }, [
    currentPage,
    term,
    sortOrder,
    sortBy,
    isSuccessOpen,
    filterStatusFromCheck,
  ]);

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
                Total of {totalOrders} Dietary Orders
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
            {orderDietaryList.map((prescription: any, index: any) => (
              <tr
                key={index}
                className="group h-[63px] border-b text-[15px] hover:bg-[#f4f4f4]"
              >
                <td className="w-[200px] pl-4 text-[15px] font-normal">
                  {prescription.orderuuid}
                </td>
                <td className="w-[200px]">
                  <ResuableTooltip
                    text={formatCreatedAtDate(prescription.dateissued)}
                  />
                </td>
                <td className="w-[200px]">
                  <ResuableTooltip text={prescription.dietary} />
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
                  <p
                    className="absolute right-[40px] top-[11px]"
                    onClick={() => {
                      setSelectedData(prescription);
                      setIsOrderModalOpen(true);
                    }}
                  >
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
