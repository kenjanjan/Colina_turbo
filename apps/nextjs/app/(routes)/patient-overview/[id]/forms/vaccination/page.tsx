"use client";
import Image from "next/image";
import DropdownMenu from "@/components/dropdown-menu";
import { ConfirmationModal } from "@/components/modal-content/confirmation-modal-content";
import Modal from "@/components/reusable/modal";
import { formatTableDate } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Pagination from "@/components/shared/pagination";
import ResuableTooltip from "@/components/reusable/tooltip";
import PdfDownloader from "@/components/pdfDownloader";
import { fetchVaccinationsByPatient } from "@/app/api/vaccinations-api/vaccinations.api";
import TableTop from "@/components/reusable/tableTop";
import { VaccinationModalContent } from "@/components/modal-content/vaccination-modal-content";
import View from "@/components/shared/buttons/view";
import Details from "@/components/shared/buttons/details";
import { VaccinationViewModalContent } from "@/components/modal-content/vaccinationview-modal-content";
import { SuccessModal } from "@/components/shared/success";

export default function ArchiveTab() {
  const router = useRouter();
  const params = useParams<{
    id: any;
    tag: string;
    item: string;
  }>();

  const patientId = params.id.toUpperCase();
  const [isOpenOrderedBy, setIsOpenOrderedBy] = useState(false);
  const [isOpenSortedBy, setIsOpenSortedBy] = useState(false);
  const [sortOrder, setSortOrder] = useState("DESC");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [vaccinationRecords, setVaccinationRecords] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState("createdAt");
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalArchive, setTotalArchive] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [term, setTerm] = useState<string>("");
  const [vaccinationData, setVaccinationData] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isView, setIsView] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const handleOrderOptionClick = (option: string) => {
    if (option === "Ascending") {
      setSortOrder("ASC");
    } else {
      setSortOrder("DESC");
    }
  };

  const onSuccess = () => {
    setIsSuccessOpen(true);
  };

  const handleSortOptionClick = (option: string) => {
    if (option == "DATE") {
      setSortBy("dateIssued");
    } else if (option == "VACCINATOR") {
      setSortBy("vaccinatorName");
    } else if (option == "DOSAGE") {
      setSortBy("dosageSequence");
    } else if (option == "MANUFACTURER") {
      setSortBy("vaccineManufacturer");
    } else if (option == "FACILITY") {
      setSortBy("healthFacility");
    }
    console.log(sortBy, "option");
  };

  const optionsOrderedBy = [
    { label: "Ascending", onClick: handleOrderOptionClick },
    { label: "Descending", onClick: handleOrderOptionClick },
  ];
  const optionsSortBy = [
    { label: "DATE", onClick: handleSortOptionClick },
    { label: "VACCINATOR", onClick: handleSortOptionClick },
    { label: "DOSAGE", onClick: handleSortOptionClick },
    { label: "MANUFACTURER", onClick: handleSortOptionClick },
    { label: "FACILITY", onClick: handleSortOptionClick },
  ];
  // end of orderby & sortby function

  const isModalOpen = (isOpen: boolean) => {
    setIsOpen(isOpen);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else if (!isOpen) {
      document.body.style.overflow = "visible";
      setIsEdit(false);
      setIsView(false);
      setVaccinationData([]);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchVaccinationsByPatient(
          patientId,
          term,
          currentPage,
          sortBy,
          sortOrder as "ASC" | "DESC",
          4,
          router,
        );
        setVaccinationRecords(response.data);
        setTotalPages(response.totalPages);
        setTotalArchive(response.totalCount);
        setIsLoading(false);
      } catch (error: any) {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentPage, sortOrder, sortBy, term, isSuccessOpen]);

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

  console.log(vaccinationRecords, "patient vacc records");
  return (
    <div className="flex h-full w-full flex-col justify-between">
      <div className="h-full w-full">
        <div className="flex w-full justify-between">
          <div className="flex-row">
            <div className="flex w-full gap-2">
              <p
                onClick={() => {
                  setIsLoading(true);
                  router.replace(
                    `/patient-overview/${patientId.toLowerCase()}/forms`,
                  );
                }}
                className="p-table-title cursor-pointer hover:underline"
              >
                Form
              </p>
              <p className="slash">{">"}</p>
              <p className="active">Vaccination</p>
              <span className="bread">/</span>
              <span
                onClick={() => {
                  setIsLoading(true);
                  router.replace(
                    `/patient-overview/${patientId.toLowerCase()}/forms/archived`,
                  );
                }}
                className="bread"
              >
                Archived
              </span>
            </div>

            <div>
              <p className="my-1 h-[23px] text-[15px] font-normal text-[#64748B]">
                Total of {totalArchive} logs
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={() => isModalOpen(true)} className="btn-add gap-2">
              <Image src="/imgs/add.svg" alt="" width={18} height={18} />
              <p className="">Add</p>
            </button>
            <PdfDownloader
              props={[
                "Uuid",
                "Date",
                "Vaccinator_Name",
                "Dosage_seq.",
                "Vacc_Manufacturer",
                "Health_Facility",
              ]}
              variant={"Vaccinations Form Table"}
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
        {/* START OF TABLE */}
        <div>
          <table className="text-left rtl:text-right">
            <thead>
              <tr className="h-[70px] border-b text-[15px] font-semibold uppercase text-[#64748B]">
                <td className="px-6 py-3">VR UID</td>
                <td className="px-6 py-3">DATE</td>
                <td className="px-6 py-3">VACCINATOR NAME</td>
                <td className="px-6 py-3">DOSAGE SEQ.</td>
                <td className="px-4 py-3">VACC. MANUFACTURER</td>
                <td className="px-6 py-3">HEALTH FACILITY</td>
                <td className="relative px-6 py-3">
                  <p className="absolute right-[120px] top-[24px]">Action</p>
                </td>
              </tr>
            </thead>
            <tbody className="h-[254px]">
              {vaccinationRecords.length === 0 && (
                <tr>
                  <td className="border-1 absolute flex w-[180vh] items-center justify-center py-5">
                    <p className="text-center text-[15px] font-normal text-gray-700">
                      No Vaccination Record <br />
                    </p>
                  </td>
                </tr>
              )}

              {vaccinationRecords.map((vacc, index) => (
                <tr
                  key={index}
                  className="group h-[63px] border-b text-[15px] hover:bg-[#f4f4f4]"
                >
                  <td className="px-6 py-3">
                    <ResuableTooltip text={vacc.vaccination_uuid} />
                  </td>
                  <td className="px-6 py-3">
                    {formatTableDate(vacc.vaccination_dateIssued)}
                  </td>
                  <td className="px-6 py-3">
                    <ResuableTooltip text={vacc.vaccination_vaccinatorName} />
                  </td>
                  <td className="px-6 py-3">
                    <ResuableTooltip text={vacc.vaccination_dosageSequence} />
                  </td>
                  <td className="px-4 py-3">
                    <ResuableTooltip
                      text={vacc.vaccination_vaccineManufacturer}
                    />
                  </td>
                  <td className="px-6 py-3">
                    <ResuableTooltip text={vacc.vaccination_healthFacility} />
                  </td>

                  <td className="relative py-3 pl-6">
                    <p
                      onClick={() => {
                        isModalOpen(true);
                        setIsOpen(true);
                        setIsEdit(true);
                        setVaccinationData(vacc);
                        console.log(vacc, "vaccination data");
                      }}
                      className="absolute right-[150px] top-[11px]"
                    >
                      <Details />
                    </p>

                    <p
                      onClick={() => {
                        isModalOpen(true);
                        setIsView(true);
                        setVaccinationData(vacc);
                        console.log(vacc, "vaccination data");
                      }}
                      className="absolute right-[40px] top-[11px]"
                    >
                      <View />
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
            <VaccinationModalContent
              isModalOpen={isModalOpen}
              onSuccess={onSuccess}
              isOpen={isOpen}
              isView={isEdit}
              vaccinationData={vaccinationData}
              label="sample label"
            />
          }
          isModalOpen={isModalOpen}
        />
      )}
      {isView && (
        <Modal
          content={
            <VaccinationViewModalContent
              isModalOpen={isModalOpen}
              isView={isView}
              vaccinationData={vaccinationData}
            />
          }
          isModalOpen={isModalOpen}
        />
      )}
      {isSuccessOpen && (
        <Modal
          content={
            <SuccessModal
              label={isEdit ? "Edit Form" : "Add Form"}
              isAlertOpen={isSuccessOpen}
              toggleModal={setIsSuccessOpen}
              isUpdated={isUpdated}
              setIsUpdated={setIsUpdated}
            />
          }
          isModalOpen={isModalOpen}
        />
      )}
    </div>
  );
}
