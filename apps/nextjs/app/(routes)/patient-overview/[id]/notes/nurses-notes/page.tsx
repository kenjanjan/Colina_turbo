"use client";
import Image from "next/image";

import React, { useEffect } from "react";
import DropdownMenu from "@/components/dropdown-menu";
import { useState } from "react";
import { fetchNotesByPatient } from "@/app/api/notes-api/notes-api";
import { SuccessModal } from "@/components/shared/success";
import { NursenotesModalContent } from "@/components/modal-content/nursenotes-modal-content";
import Modal from "@/components/reusable/modal";
import View from "@/components/shared/buttons/view";
import { useParams, useRouter } from "next/navigation";
import Pagination from "@/components/shared/pagination";
import ResuableTooltip from "@/components/reusable/tooltip";
import { formatCreatedTime, formatTableDate } from "@/lib/utils"; // Adjust the path as needed
import PdfDownloader from "@/components/pdfDownloader";

const Notes = () => {
  const router = useRouter();
  if (typeof window === "undefined") {
  }
  const [isOpenOrderedBy, setIsOpenOrderedBy] = useState(false);
  const [isOpenSortedBy, setIsOpenSortedBy] = useState(false);
  const [sortOrder, setSortOrder] = useState<string>("ASC");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [patientNotes, setPatientNotes] = useState<any[]>([]);
  const [PatientNotesData, setPatientNotesData] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalNotes, setTotalNotes] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState("");
  const [isView, setIsView] = useState(false);
  const [term, setTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [isEdit, setIsEdit] = useState(false);
  const [notesToEdit, setNotesToEdit] = useState<any[]>([]);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const type = "nn";

  const params = useParams<{
    id: any;
    tag: string;
    item: string;
  }>();

  console.log(params, "for surgery patientId");
  const patientId = params.id.toUpperCase();
  // const patientId = params.id;

  const handleOrderOptionClick = (option: string) => {
    if (option === "Ascending") {
      setSortOrder("ASC");
    } else {
      setSortOrder("DESC");
    }
  };

  const handleSortOptionClick = (option: string) => {
    setIsOpenSortedBy(false);
    if (option === "Subject") {
      setSortBy("subject");
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
    { label: "Subject", onClick: handleSortOptionClick },
    { label: "Notes", onClick: handleSortOptionClick },
  ]; // end of orderby & sortby function

  const [isOpen, setIsOpen] = useState(false);

  const isModalOpen = (isOpen: boolean) => {
    setIsOpen(isOpen);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else if (!isOpen) {
      document.body.style.overflow = "visible";
      setNotesToEdit([]);
      setIsEdit(false);
      setPatientNotesData([]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchNotesByPatient(
          patientId,
          term,
          type,
          currentPage,
          sortBy,
          sortOrder as "ASC" | "DESC",
          4,
          router,
        );
        setPatientNotes(response.data);
        setTotalPages(response.totalPages);
        setTotalNotes(response.totalCount);
        setIsLoading(false);
      } catch (error: any) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentPage, sortOrder, sortBy, term, isSuccessOpen]);

  console.log(patientNotes, "patientNotes");

  const onSuccess = () => {
    setIsSuccessOpen(true);
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

  return (
    <div className="flex h-full w-full flex-col justify-between">
      <div className="h-full w-full">
        <div className="mb-2 flex w-full justify-between">
          <div className="flex-row">
            <div className="flex gap-2">
              <p className="p-table-title">Notes</p>
              <span className="slash">{">"}</span>
              <span className="active">Nurse&apos;s Notes</span>
              <span className="slash">{"/"}</span>
              <span
                onClick={() => {
                  setIsLoading(true);
                  router.replace(
                    `/patient-overview/${patientId.toLowerCase()}/notes/incident-report`,
                  );
                }}
                className="bread"
              >
                Incident Report
              </span>
            </div>
            <div>
              <p className="my-1 h-[23px] text-[15px] font-normal text-[#64748B]">
                Total of {totalNotes} Notes
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                isModalOpen(true);
                setIsView(false);
              }}
              className="btn-add gap-2"
            >
              <Image src="/imgs/add.svg" alt="" width={18} height={18} />
              <p className="">Add</p>
            </button>
            <PdfDownloader
              props={[ "Uuid", "Date", "Time", "Subject", "Notes"]}
              variant={"Nurse's Note Table"}
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
        </div>

        {/* START OF TABLE */}
        <div>
          <table className="text-left rtl:text-right">
            <thead>
              <tr className="h-[70px] border-b text-[15px] font-semibold uppercase text-[#64748B]">
                <td className="px-6 py-3">NOTES UID</td>
                <td className="px-6 py-3">DATE</td>
                <td className="px-6 py-3">TIME</td>
                <td className="px-6 py-3">SUBJECT</td>
                <td className="px-6 py-3">NOTES</td>
                <td className="relative px-6 py-3">
                  <p className="absolute right-[80px] top-[24px]">Action</p>
                </td>
              </tr>
            </thead>
            <tbody className="h-[254px]">
              {patientNotes.length === 0 && (
                <h1 className="border-1 absolute flex items-center justify-center py-5">
                  <p className="text-center text-[15px] font-normal text-gray-700">
                    No Note/s <br />
                  </p>
                </h1>
              )}
              {patientNotes.map((note, index) => (
                <tr
                  key={index}
                  className="group h-[63px] border-b text-[15px] hover:bg-[#f4f4f4]"
                >
                  <td className="px-6 py-3">
                    <ResuableTooltip text={note.notes_uuid} />
                  </td>
                  <td className="px-6 py-3">
                    {formatTableDate(note.notes_createdAt)}
                  </td>
                  <td className="px-6 py-3">
                    {formatCreatedTime(note.notes_createdAt)}
                    {/* time not formattd left as is for now  and check with local time of machine */}
                  </td>
                  <td className="px-6 py-3">
                    <ResuableTooltip text={note.notes_subject} />
                  </td>
                  <td className="px-6 py-3">
                    <ResuableTooltip text={note.notes_notes} />
                  </td>
                  <td className="relative py-3 pl-6">
                    {" "}
                    <p
                      onClick={() => {
                        isModalOpen(true);
                        setIsView(true);
                        setPatientNotesData(note);
                      }}
                      className="absolute right-[40px] top-[11px]"
                    >
                      <View></View>
                    </p>
                  </td>
                </tr>
              ))}
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
            <NursenotesModalContent
              isModalOpen={isModalOpen}
  
              uuid=""
              name=""
              isOpen={isOpen}
              isView={isView}
              label={isView ? "View" : "Add"}
              PatientNotesData={PatientNotesData}
              onSuccess={onSuccess}
            />
          }
          isModalOpen={isModalOpen}
        />
      )}
      {/* {isView && (
        <Modal
          content={
            <NursenotesModalContent
              isModalOpen={isModalOpen}
              isView={isView}
            />
          }
          isModalOpen={isModalOpen}
        />
      )} */}

      {isSuccessOpen && (
        <SuccessModal
          label={isView ? "View" : "Add"}
          isAlertOpen={isSuccessOpen}
          toggleModal={setIsSuccessOpen}
          isUpdated={isUpdated}
          setIsUpdated={setIsUpdated}
        />
      )}
    </div>
  );
};

export default Notes;
