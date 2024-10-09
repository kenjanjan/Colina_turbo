"use client";
import { onNavigate } from "@/actions/navigation";
import { fetchDueMedication } from "@/app/api/medication-logs-api/due-medication-api";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useToast } from "../ui/use-toast";
import Image from "next/image";
import { fetchProfileImages } from "@/app/api/patients-api/patientProfileImage.api";
import ResuableTooltip from "../reusable/tooltip";
import DBDueMedicationLoader from "../loaders/DBDueMedicationLoader";

interface DBDueMedicationProps {
  totalDueMedication: number;
  setTotalDueMedication: (dueMedicationLength: number) => void;
  totalDone: number;
  setTotalDone: (totalDone: number) => void;
}
const DBDueMedication = ({
  totalDueMedication,
  setTotalDueMedication,
  totalDone,
  setTotalDone,
}: DBDueMedicationProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const [term, setTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dueMedSortBy, setDueMedSortBy] = useState(
    "medicationlogs.medicationLogsTime",
  );
  const [sortOrder, setSortOrder] = useState("ASC");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoading2, setIsLoading2] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [patientDueMedImages, setDueMedPatientImages] = useState<any[]>([]);
  const [dueMedicationList, setDueMedicationList] = useState<
    {
      patient_uuid: string;
      medicationlogs_medicationLogsName: string;
      patient_firstName: string;
      patient_lastName: string;
      patient_middleName: string;
      medicationlogs_medicationLogsDate: string;
      medicationlogs_medicationLogsTime: string;
    }[]
  >([]);
  const [dueMedTotalPages, setDueMedTotalPages] = useState(0);

  console.log(totalDone, "totalDone");
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const dueMedicationList = await fetchDueMedication(
          term,
          currentPage,
          dueMedSortBy,
          sortOrder as "ASC" | "DESC",
          3,
          router,
        );

        // // Filter data by distinct medicationLogsName for each patient
        // const filteredData = dueMedicationList.data.reduce(
        //   (
        //     acc: { [key: string]: any },
        //     currentItem: {
        //       patient_uuid: string;
        //       medicationlogs_medicationLogsName: string;
        //     },
        //   ) => {
        //     const key = `${currentItem.patient_uuid}-${currentItem.medicationlogs_medicationLogsName}`;
        //     if (!acc[key]) {
        //       acc[key] = currentItem;
        //     }
        //     return acc;
        //   },
        //   {},
        // );

        // const filteredArray: {
        //   patient_uuid: string;
        //   medicationlogs_medicationLogsName: string;
        //   patient_firstName: string;
        //   patient_lastName: string;
        //   patient_middleName: string;
        //   medicationlogs_medicationLogsDate: string;
        //   medicationlogs_medicationLogsTime: string;
        // }[] = Object.values(filteredData);
        // const limitedArray = filteredArray.slice(0, 5);

        const uniquePatientUuids = new Set(
          dueMedicationList.data.map(
            (patient: { patient_uuid: any }) => patient.patient_uuid,
          ),
        );

        const patientUuids = Array.from(uniquePatientUuids);

        setDueMedicationList(dueMedicationList.data);
        setDueMedTotalPages(dueMedicationList.totalPages);
        setTotalDueMedication(dueMedicationList.totalCount);
        setTotalDone(dueMedicationList.totalDone);
        setIsLoading(false);
        const profileImagesResponse = await fetchProfileImages(
          patientUuids as string[],
        );
        if (profileImagesResponse) {
          const patientImagesData = profileImagesResponse.map((image: any) => {
            // Convert the image data buffer to a data URL if available
            if (image.data) {
              const buffer = Buffer.from(image.data);
              const dataUrl = `data:image/jpeg;base64,${buffer.toString(
                "base64",
              )}`;
              return {
                patientUuid: image.patientUuid,
                data: dataUrl,
              };
            } else {
              // If no data URL is available, return an empty object
              return {
                patientUuid: image.patientUuid,
                data: "",
              };
            }
          });
          setDueMedPatientImages(patientImagesData);
          console.log(patientImagesData, "patientImagesData");
        }
      } catch (error) {
        // Handle error
      }
    };
    fetchData();
  }, [currentPage]);

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
  const formatDate = (dateOfSurgery: string | number | Date) => {
    // Create a new Date object from the provided createdAt date string
    const date = new Date(dateOfSurgery);

    // Get the month, day, and year
    const month = date.toLocaleString("default", { month: "short" });
    const day = date.getDate();
    const year = date.getFullYear();

    const formattedDate = `${month} ${day}, ${year}`;

    return formattedDate;
  };

  return (
    <div className="relative h-full w-full">
      {isLoading ? (
        <DBDueMedicationLoader />
      ) : dueMedicationList.length > 0 ? (
        <div className="flex h-full w-full select-none flex-col justify-between rounded-[5px] bg-[#FAFAFA] px-5 py-3">
          <div className="h-full">
            <div className="flex flex-col">
              <p className="text-[20px] !font-medium">
                Due Medication
                <span>{dueMedicationList.length > 1 ? "s" : ""}</span>
              </p>
              <p className="sub-title mb-3 pt-3 text-[15px] font-normal">
                Total of {totalDueMedication} due medication
                <span>{dueMedicationList.length > 1 ? "s" : ""}</span>
              </p>
            </div>
            <div>
              {dueMedicationList.map((dueMedication, index) => (
                <div
                  key={index}
                  className="mb-1 flex h-[70px] w-full cursor-pointer flex-row justify-between gap-[13px] rounded-md px-2 hover:bg-[#F4F4F4]"
                >
                  <div className="flex w-3/4">
                    <div className="mr-3 flex items-center">
                      {patientDueMedImages.some(
                        (image) =>
                          image.patientUuid === dueMedication.patient_uuid,
                      ) ? (
                        // Render the matched image
                        <div>
                          {patientDueMedImages.map((image, imgIndex) => {
                            if (
                              image.patientUuid === dueMedication.patient_uuid
                            ) {
                              return (
                                <div key={imgIndex}>
                                  {image.data ? (
                                    // Render the image if data is not empty
                                    <div className="max-h-[45px] min-h-[45px] min-w-[45px] max-w-[45px]">
                                      <Image
                                        className="h-12 w-12 rounded-full object-cover"
                                        src={image.data} // Use the base64-encoded image data directly
                                        alt=""
                                        width={45}
                                        height={45}
                                      />
                                    </div>
                                  ) : (
                                    // Render the stock image (.svg) if data is empty
                                    <Image
                                      className="max-h-[45px] min-h-[45px] min-w-[45px] max-w-[45px] rounded-full"
                                      src="/imgs/user.png"
                                      alt=""
                                      width={45}
                                      height={45}
                                    />
                                  )}
                                </div>
                              );
                            }
                            return null;
                          })}
                        </div>
                      ) : (
                        // Render a placeholder image if no matching image found
                        <div>
                          <Image
                            className="max-h-[45px] min-h-[45px] min-w-[45px] max-w-[45px] rounded-full"
                            src="/imgs/loading.gif" // Show loading gif while fetching images
                            alt="Loading"
                            width={45}
                            height={45}
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex w-4/6">
                      <div className="flex w-full flex-col justify-center gap-1">
                        <p className="truncate text-[15px] hover:text-wrap">
                          <ResuableTooltip
                            text={`${dueMedication.patient_firstName}${" "}${
                              dueMedication.patient_middleName
                            }${" "}${dueMedication.patient_lastName}`}
                          />
                        </p>
                        <p className="sub-title font-normal text-[#71717A]">
                          <ResuableTooltip
                            text={
                              dueMedication.medicationlogs_medicationLogsName
                            }
                          />
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex w-1/4 flex-col items-end justify-center gap-1 text-end">
                    <p className="flex text-[15px] font-medium">
                      {formatDate(
                        dueMedication.medicationlogs_medicationLogsDate,
                      )}
                    </p>
                    <p className="sub-title ml-4 font-medium">
                      {formatTime(
                        dueMedication.medicationlogs_medicationLogsTime,
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            onClick={() => {
              setIsLoading(true);
              router.push("/due-medications");
            }}
            className="group mt-2 flex w-fit cursor-pointer items-center text-[15px] font-semibold text-[#151518] opacity-50 hover:text-[#007C85] hover:opacity-100"
          >
            SEE ALL DUE
            <svg
              className="ml-2 text-[#71717A] group-hover:text-[#007C85]"
              width="17"
              height="14"
              viewBox="0 0 10 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.14795 2.15826L8.7739 8.78421L2.14795 15.4102"
                stroke="currentColor"
                strokeWidth="2.43402"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      ) : (
        <div className="relative flex h-full w-full select-none flex-col justify-between rounded-[5px] bg-[#FAFAFA] px-5 py-3">
          <div className="h-full w-full">
            <div className="flex flex-col">
              <p className="p-title !font-medium">
                Due Medication
                <span>{dueMedicationList.length > 1 ? "s" : ""}</span>
              </p>
              <p className="sub-title mb-3 pt-3 text-[15px] font-normal">
                Total of {totalDueMedication} due medication
                <span>{dueMedicationList.length > 1 ? "s" : ""}</span>
              </p>
            </div>
          </div>
          <div className="sub-title absolute -ml-2 flex h-full w-full items-center justify-center">
            no data yet
          </div>
        </div>
      )}
    </div>
  );
};

export default DBDueMedication;
