"use client";

import PdfDownloader from "@/components/pdfDownloader";
import Pagination from "@/components/shared/pagination";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import ResuableTooltip from "@/components/reusable/tooltip";
import Edit from "@/components/shared/buttons/edit";
import TableTop from "@/components/reusable/tableTop";
import View from "@/components/shared/buttons/view";
import DropdownMenu from "@/components/dropdown-menu";

const Order = () => {
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
  const [filterStatusFromCheck, setFilterStatusFromCheck] = useState<string[]>(
    [],
  );

  const optionsFilterStatus = [
    { label: "Active", onClick: setFilterStatusFromCheck },
    { label: "Discontinued", onClick: setFilterStatusFromCheck },
  ]; // end of status function

  const handleStatusUpdate = (checkedFilters: string[]) => {
    setFilterStatusFromCheck(checkedFilters);

    // Here you can further process the checked filters or update other state as needed
  };

  const mockPrescriptions = [
    {
      orderUid: "ORD-AEDB6CN2",
      prescriptionUid: "PRC-AEDB6CB1",
      dateIssued: "Apr 21 2024",
      expiryDate: "Jan 31 2024",
      medicineName: "Paracetamol",
      dosage: "500mg",
      status: "Discontinued",
    },
    {
      orderUid: "ORD-AB34D8F4",
      prescriptionUid: "PRC-BB34D7F3",
      dateIssued: "Mar 15 2024",
      expiryDate: "Dec 31 2024",
      medicineName: "Ibuprofen",
      dosage: "400mg",
      status: "Active",
    },
    {
      orderUid: "ORD-C987E6B2",
      prescriptionUid: "PRC-CC987E5B1",
      dateIssued: "Jan 10 2024",
      expiryDate: "Nov 30 2024",
      medicineName: "Aspirin",
      dosage: "100mg",
      status: "Active",
    },
    {
      orderUid: "ORD-A987E6A3",
      prescriptionUid: "PRC-BC987E5A5",
      dateIssued: "Feb 10 2024",
      expiryDate: "Nov 30 2024",
      medicineName: "Camphor",
      dosage: "100mg",
      status: "Discontinued",
    },
    {
      orderUid: "ORD-Z987E6AZ",
      prescriptionUid: "PRC-ZC987E5AZ",
      dateIssued: "Mar 10 2024",
      expiryDate: "Nov 30 2024",
      medicineName: "Poy",
      dosage: "100mg",
      status: "Active",
    },
    {
      orderUid: "ORD-AEDB6CN2",
      prescriptionUid: "PRC-AEDB6CB1",
      dateIssued: "Apr 21 2024",
      expiryDate: "Jan 31 2024",
      medicineName: "Paracetamol",
      dosage: "500mg",
      status: "Discontinued",
    },
    {
      orderUid: "ORD-AB34D8F4",
      prescriptionUid: "PRC-BB34D7F3",
      dateIssued: "Mar 15 2024",
      expiryDate: "Dec 31 2024",
      medicineName: "Ibuprofen",
      dosage: "400mg",
      status: "Active",
    },
    {
      orderUid: "ORD-C987E6B2",
      prescriptionUid: "PRC-CC987E5B1",
      dateIssued: "Jan 10 2024",
      expiryDate: "Nov 30 2024",
      medicineName: "Aspirin",
      dosage: "100mg",
      status: "Active",
    },
    {
      orderUid: "ORD-A987E6A3",
      prescriptionUid: "PRC-BC987E5A5",
      dateIssued: "Feb 10 2024",
      expiryDate: "Nov 30 2024",
      medicineName: "Camphor",
      dosage: "100mg",
      status: "Discontinued",
    },
    {
      orderUid: "ORD-Z987E6AZ",
      prescriptionUid: "PRC-ZC987E5AZ",
      dateIssued: "Mar 10 2024",
      expiryDate: "Nov 30 2024",
      medicineName: "Poy",
      dosage: "100mg",
      status: "Active",
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
    { label: "PRESCRIPTION UID", onClick: handleSortOptionClick },
    { label: "DATE ISSUED", onClick: handleSortOptionClick },
    { label: "MEDICINE NAME", onClick: handleSortOptionClick },
    { label: "DOSAGE", onClick: handleSortOptionClick },
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

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex-grow">
        <div className="flex w-full justify-between">
          <div className="flex-row">
            <div className="flex gap-2">
              <p className="active">Order</p>
              <span className="slash">/</span>
              <span
                onClick={() => {
                  router.push(
                    `/patient-overview/${patientId.toLowerCase()}/orders/prescription`,
                  );
                }}
                className="bread"
              >
                Prescription
              </span>
              <span className="slash">/</span>
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
                Total of {totalOrder} Prescription Orders
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
              <td className="w-[250px]">PRESCRIPTION UID</td>
              <td className="w-[170px]">DATE ISSUED</td>
              <td className="w-[170px]">EXPIRY DATE</td>
              <td className="w-[200px]">MEDICINE NAME</td>
              <td className="w-[150px]">DOSAGE</td>
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
                <td className="w-[200px] pl-4 text-[15px] font-normal">
                  {prescription.orderUid}
                </td>
                <td className="w-[250px]">
                  <ResuableTooltip text={prescription.prescriptionUid} />
                </td>
                <td className="w-[170px]">
                  <ResuableTooltip text={prescription.dateIssued} />
                </td>
                <td className="w-[170px]">
                  {" "}
                  <ResuableTooltip text={prescription.expiryDate} />
                </td>
                <td className="w-[200px]">
                  {" "}
                  <ResuableTooltip text={prescription.medicineName} />
                </td>
                <td className="w-[150px]">
                  {" "}
                  <ResuableTooltip text={prescription.dosage} />
                </td>
                <td className="w-[200px]">
                  <span
                    className={`flex w-[109px] items-center justify-center rounded-[30px] py-1 font-semibold ${
                      prescription.status === "Discontinued"
                        ? "bg-[#FFE8EC] text-[#EF4C6A]"
                        : "bg-[#CCFFDD] text-[#17C653]"
                    }`}
                  >
                    {prescription.status === "Discontinued"
                      ? "Discontinued"
                      : "Active"}
                  </span>
                </td>
                <td className="relative py-3 pl-6">
                  <p className="absolute right-[40px] top-[11px]">
                    <View />
                    {/* <Edit></Edit> */}
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
    </div>
  );
};

export default Order;
