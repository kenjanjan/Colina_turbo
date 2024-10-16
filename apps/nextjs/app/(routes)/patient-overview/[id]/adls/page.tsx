"use client";

import { fetchAdlsByPatient } from "@/app/api/adls-api/adls-api";
import ADLModal from "@/components/modal-content/adl-modal-content";
import PdfDownloader from "@/components/pdfDownloader";
import AddButton from "@/components/reusable/addButton";
import Modal from "@/components/reusable/modal";
import TableTop from "@/components/reusable/tableTop";
import ResuableTooltip from "@/components/reusable/tooltip";
import Edit from "@/components/shared/buttons/edit";
import { ErrorModal } from "@/components/shared/error";
import Pagination from "@/components/shared/pagination";
import { SuccessModal } from "@/components/shared/success";
import { formatCreatedAtDate, formatCreatedAtTime } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
interface Adl {
  adl_uuid: string;
  adl_createdAt: string;
  adl_adls: string;
  adl_notes: string;
}
const Adls = () => {
  const params = useParams<{
    id: any;
    tag: string;
    item: string;
  }>();
  const router = useRouter();
  const patientId = params.id.toUpperCase();
  const [pageNumber, setPageNumber] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [term, setTerm] = useState("");
  const [adlsList, setAdlsList] = useState<any[]>([]);
  const [selectedAdl, setSelectedAdl] =useState<[]>([])
  const [totalAdls, setTotalAdls] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenOrderedBy, setIsOpenOrderedBy] = useState(false);
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
  const [sortBy, setSortBy] = useState("createdAt");
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isModalOpen = (isOpen: boolean) => {
    setIsOpen(isOpen);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else if (!isOpen) {
      document.body.style.overflow = "visible";
      setIsEdit(false);
      // setScheduledMedData([]);
    }
  };

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
    { label: "ADLs", onClick: handleSortOptionClick },
    { label: "Notes", onClick: handleSortOptionClick },
    { label: "Date Created", onClick: handleSortOptionClick },
  ]; // end of orderby & sortby functions

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchAdlsByPatient(
          patientId,
          term,
          currentPage,
          sortBy,
          sortOrder,
          4,
          router,
        );
        setAdlsList(response.data);
        setTotalPages(response.totalPages);
        setTotalAdls(response.totalCount);
      } catch (error: any) {
        setError(error.message);
      }
    };
    fetchData();
  }, [currentPage, term, sortOrder, sortBy, isSuccessOpen]);

  console.log(adlsList, "adlsList");
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
        <div className="flex justify-between">
          <div>
            <h1 className="p-table-title">Activities of Daily Living</h1>
            <h2 className="sub-title py-1">Total of {totalAdls} ADLS</h2>
          </div>
          <div className="flex gap-2">
            <AddButton isModalOpen={isModalOpen} />
            <PdfDownloader
              props={["Uuid", "ADLs", "Date", "Notes"]}
              variant={"ADL Table"}
              patientId={patientId}
            />
          </div>
        </div>

        <div className="pt-2">
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
      </div>

      {/* START OF TABLE */}
      <div>
        <table className="w-full table-fixed border-spacing-2 text-left rtl:text-right">
          <thead>
            <tr className="h-[70px] border-b text-[15px] font-semibold uppercase text-[#64748B]">
              <td className="pl-4">ADLS UID</td>
              <td className="">Date</td>
              <td className="">Time</td>
              <td className="!normal-case">ADLs</td>
              <td className="w-[400px]">Notes</td>{" "}
              {/* Set the desired width here */}
              <td className="relative">
                <p className="absolute right-[80px] top-[24px]">Action</p>
              </td>
            </tr>
          </thead>
          <tbody className="h-[254px]">
            {adlsList.length === 0 && (
              <tr className="h-full">
                <td className="border-1 flex h-full items-center justify-center py-5">
                  <p className="sub-title text-center">No logs yet</p>
                </td>
              </tr>
            )}
            {adlsList.length > 0 && (
              <>
                {adlsList.map((adl, index) => (
                  <tr
                    key={index}
                    className="group h-[63px] border-b text-[15px] hover:bg-[#f4f4f4]"
                  >
                    <td className="pl-4">
                      <ResuableTooltip text={adl.adl_uuid} />
                    </td>
                    <td className="">
                      {formatCreatedAtDate(adl.adl_createdAt)}
                    </td>
                    <td className="">
                      {formatCreatedAtTime(adl.adl_createdAt)}
                    </td>
                    <td className="">
                      <ResuableTooltip text={adl.adl_adls} />
                    </td>
                    <td className="w-[400px]">
                      <ResuableTooltip text={adl.adl_notes} />
                    </td>
                    <td className="relative py-3 pl-6">
                      <p
                        onClick={() => {
                          isModalOpen(true);
                          setIsEdit(true);
                          setSelectedAdl(adl);
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

      {/* pagination */}
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
            <ADLModal
              isModalOpen={isModalOpen}
              adls={selectedAdl}
              onSuccess={onSuccess}
              onFailed={onFailed}
              isEdit={isEdit}
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
          isUpdated={"false"}
          setIsUpdated={""}
        />
      )}
      {isErrorOpen && (
        <ErrorModal
          label="Adls Log already exist"
          isAlertOpen={isErrorOpen}
          toggleModal={setIsErrorOpen}
          isEdit={false}
          errorMessage={"error"}
        />
      )}
    </div>
  );
};

export default Adls;
