"use client";
import PdfDownloader from "@/components/pdfDownloader";
import Pagination from "@/components/shared/pagination";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import ResuableTooltip from "@/components/reusable/tooltip";
import TableTop from "@/components/reusable/tableTop";
import View from "@/components/shared/buttons/view";
import DropdownMenu from "@/components/dropdown-menu";
import { formatCreatedAtDate } from "@/lib/utils";
import Modal from "@/components/reusable/modal";
import OrderModalContent from "@/components/modal-content/order-modal-content";
import { fetchOrdersPrescriptionsByPatient } from "@/app/api/orders/orders-prescription-api";

const Prescription = () => {
  const params = useParams<{
    id: any;
    tag: string;
    item: string;
  }>();
  const router = useRouter();
  const patientId = params.id.toUpperCase();
  const [term, setTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [pageNumber, setPageNumber] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [sortBy, setSortBy] = useState("o_orderDate");
  const [sortOrder, setSortOrder] = useState("ASC");
  const [isOpenOrderedBy, setIsOpenOrderedBy] = useState(false);
  const [isOpenSortedBy, setIsOpenSortedBy] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<any>({});
  const [isOrder, setIsOrder] = useState(false);
  const [orderPrescriptionList, setOrderPrescriptionList] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [filterStatusFromCheck, setFilterStatusFromCheck] = useState<string[]>(
    [],
  );
  const [isOpenFilterStatus, setIsOpenFilterStatus] = useState(false);
  const handleStatusUpdate = (checkedFilters: string[]) => {
    setFilterStatusFromCheck(checkedFilters);
  };
  const optionsFilterStatus = [
    { label: "Active", onClick: setFilterStatusFromCheck },
    { label: "Discontinued", onClick: setFilterStatusFromCheck },
  ];

  const handleOrderOptionClick = (option: string) => {
    setIsOpenOrderedBy(false);
    if (option === "Ascending") {
      setSortOrder("ASC");
    } else {
      setSortOrder("DESC");
    }
  };

  const isModalOpen = (isOpen: boolean) => {
    setIsOpen(isOpen);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else if (!isOpen) {
      document.body.style.overflow = "visible";
      setIsEdit(false);
    }
  };

  const handleSortOptionClick = (option: string) => {
    setIsOpenSortedBy(false);
    if (option === "PRESCRIPTION UID") {
      setSortBy("p");
    } else if (option === "DATE ISSUED") {
      setSortBy("createdAt");
    } else if (option === "MEDICINE NAME") {
      setSortBy("createdAt");
    } else {
      setSortBy("DOSAGE");
    }
    console.log("option", option);
  };

  const optionsOrderedBy = [
    { label: "Ascending", onClick: handleOrderOptionClick },
    { label: "Descending", onClick: handleOrderOptionClick },
  ];
  const optionsSortBy = [
    { label: "PRESCRIPTION UID", onClick: handleSortOptionClick },
    { label: "DATE ISSUED", onClick: handleSortOptionClick },
    { label: "MEDICINE NAME", onClick: handleSortOptionClick },
    { label: "DOSAGE", onClick: handleSortOptionClick },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchOrdersPrescriptionsByPatient(
          patientId,
          term,
          currentPage,
          sortBy,
          "ASC",
          4,
          filterStatusFromCheck,
          router,
        );
        setOrderPrescriptionList(response.data);
        setTotalPages(response.totalPages);
        setTotalOrders(response.totalCount);
        console.log(response, "responseee");
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
  console.log(orderPrescriptionList, "orderPrescriptionList");
  const onSuccess = () => {
    setIsSuccessOpen(true);
    isModalOpen(false);
  };
  const onFailed = () => {
    setIsErrorOpen(true);
  };

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex-grow">
        <div className="flex w-full justify-between">
          <div className="flex-row">
            <div className="flex gap-2">
              <p className="p-table-title">Order</p>
              <p className="slash">{">"}</p>
              <p className="active">Prescription</p>
              <p className="slash">/</p>
              <p
                onClick={() => {
                  router.push(
                    `/patient-overview/${patientId.toLowerCase()}/orders/dietary`,
                  );
                }}
                className="bread"
              >
                Dietary
              </p>
              <span className="slash">/</span>
              <p
                onClick={() => {
                  router.push(
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
                Total of {totalOrders} Prescription Orders
              </p>
            </div>
          </div>
          <div className="flex gap-2">
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
          </div>
        </div>
      </div>
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
      <div>
        <table className="w-full table-fixed border-spacing-2 text-left rtl:text-right">
          <thead>
            <tr className="h-[70px] border-b text-[15px] font-semibold uppercase text-[#64748B]">
              <td className="w-[200px] pl-4">ORDER UID</td>
              <td className="w-[200px]">PRESCRIPTION UID</td>
              <td className="w-[200px]">APPOINTMENT UID</td>
              <td className="w-[200px]">DATE ISSUED</td>
              <td className="w-[200px]">MEDICINE NAME</td>
              <td className="w-[100px]">DOSAGE</td>
              <td className="relative px-6 py-3">
                <div
                  className={`absolute ${filterStatusFromCheck?.length > 0 ? "left-[26px] top-[24px]" : "left-[26px] top-[24px]"}`}
                >
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
                </div>
              </td>
              <td className="relative">
                <p className="absolute right-[80px] top-[24px]">Action</p>
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
                    <td className="w-[200px] pl-4 text-[15px] font-normal">
                      {ordersPrescription.op_uuid}{" "}
                    </td>
                    <td className="w-[200px]">
                      <ResuableTooltip text={ordersPrescription.p_uuid} />{" "}
                    </td>
                    <td className="w-[200px]">
                      <ResuableTooltip text={ordersPrescription.a_uuid} />{" "}
                    </td>
                    <td className="w-[200px]">
                      <ResuableTooltip
                        text={formatCreatedAtDate(
                          ordersPrescription.o_orderdate,
                        )}
                      />{" "}
                    </td>
                    <td className="w-[200px]">
                      <ResuableTooltip text={ordersPrescription.p_name} />{" "}
                    </td>
                    <td className="w-[100px]">
                      <ResuableTooltip text={ordersPrescription.p_dosage} />{" "}
                    </td>
                    <td className="relative px-6 py-3">
                      <p
                        className={`flex w-[109px] items-center justify-center rounded-[30px] py-1 font-semibold ${
                          ordersPrescription.p_status === "active"
                            ? "bg-[#CCFFDD] text-[#17C653]"
                            : ordersPrescription.p_status === "Discontinued"
                              ? "bg-[#FFE8EC] text-[#EF4C6A]" // Red color for Discontinued
                              : ""
                        }`}
                      >
                        {ordersPrescription.p_status === "active"
                          ? "Active"
                          : ordersPrescription.p_status}{" "}
                      </p>
                    </td>
                    <td className="relative py-3 pl-6">
                      <p
                        className="absolute right-[40px] top-[11px]"
                        onClick={() => {
                          setIsOrderModalOpen(true);
                          setSelectedData(ordersPrescription);
                        }}
                      >
                        <View />
                      </p>
                    </td>
                  </tr>
                ))}
              </>
            )}
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
              tab={"Prescription"}
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

export default Prescription;
