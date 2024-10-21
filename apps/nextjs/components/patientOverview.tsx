"use client";
import { useEffect, useRef, useState } from "react";
import { onNavigate } from "@/actions/navigation";
import { Navbar } from "@/components/navbar";
import { redirect, useParams, useRouter } from "next/navigation";
import { fetchPatientOverview } from "@/app/api/patients-api/patientOverview.api";
import { usePathname } from "next/navigation";
import {
  fetchPatientProfileImage,
  updatePatientProfileImage,
} from "@/app/api/patients-api/patientProfileImage.api";
import { toast as sonner } from "sonner";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import Link from "next/link";
import Image from "next/image";
import {
  EditProvider,
  useEditContext,
} from "@/app/(routes)/patient-overview/[id]/editContext";
import { PatientOverviewProps } from "@/lib/interface";
import { cn } from "@/lib/utils";
import ResuableTooltip from "./reusable/tooltip";

export default function PatientOverviewComponent({
  isCollapsed,
  onOpenHoverEnter,
  onOpenHoverLeave,
  toggleSidebar,
  isOpenHovered,
}: PatientOverviewProps) {
  const { isEdit, isSave, toggleEdit, disableEdit } = useEditContext();
  console.log("isSave", isSave);
  useEffect(() => {
    console.log("isEdit changed in layout:", isEdit);
  }, [isEdit]);

  const router = useRouter();
  const params = useParams<{
    id: any;
    tag: string;
    item: string;
  }>();

  const { toast } = useToast();
  const [patientData, setPatientData] = useState<any[]>([]);
  const [patientImage, setPatientImage] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const patientId = params.id.toUpperCase();
  const pathname = usePathname();
  const inputRef = useRef<HTMLSpanElement>(null);

  const tabs = [
    {
      label: "ADLs",
      url: `/patient-overview/${params.id}/adls`,
    },
    {
      label: "MAR",
      url: `/patient-overview/${params.id}/medication/scheduled`,
    },
    {
      label: "Notes",
      url: `/patient-overview/${params.id}/notes/nurses-notes`,
    },
    {
      label: "Vital Signs",
      url: `/patient-overview/${params.id}/vital-signs`,
    },
    {
      label: "Laboratory Results",
      url: `/patient-overview/${params.id}/lab-results`,
    },
    {
      label: "Medical History",
      url: `/patient-overview/${params.id}/medical-history/allergies`,
    },
    {
      label: "Prescription",
      url: `/patient-overview/${params.id}/prescription/scheduled`,
    },
    {
      label: "Forms",
      url: `/patient-overview/${params.id}/forms`,
    },
    {
      label: "Appointment",
      url: `/patient-overview/${params.id}/patient-appointment`,
    },
    {
      label: "Orders",
      url: `/patient-overview/${params.id}/orders/prescription`,
    },
  ];
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const [currentRoute, setCurrentRoute] = useState<string>("");

  const [seeMoreClicked, setSeeMoreClicked] = useState(false);
  const [seeMoreHovered, setSeeMoreHovered] = useState(false);

  const handleSeeMoreHover = () => {
    setSeeMoreHovered(true);
  };

  const handleSeeMoreLeave = () => {
    setSeeMoreHovered(false);
  };

  useEffect(() => {
    const pathParts = pathname.split("/");
    setCurrentRoute(pathParts[pathParts.length - 1]);
    const clicked = true;
    const hovered = true;
    setSeeMoreClicked(clicked);
    setSeeMoreHovered(hovered);
  }, [pathname, currentRoute]);

  //show loading
  const loadDefaultImage = async () => {
    try {
      // Fetch the default image as a file
      const response = await fetch("/imgs/loading.gif");
      const blob = await response.blob();

      // Read the file content as a data URL
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setPatientImage(reader.result); // Set the data URL as the state
        }
      };
      reader.readAsDataURL(blob); // Read the blob content as a data URL
    } catch (error) {
      console.error("Error loading default image:", error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetchPatientOverview(patientId, router);
      console.log(response, "response");
      const imgResponse = await fetchPatientProfileImage(patientId, router);
      setIsLoading(false);

      if (!imgResponse.data || imgResponse.data.length === 0) {
        // If no image data is available, set patientImage to null
        setPatientImage("");
      } else {
        // Convert the image data buffer to a data URL
        const buffer = Buffer.from(imgResponse.data);
        const dataUrl = `data:image/jpeg;base64,${buffer.toString("base64")}`;
        setPatientImage(dataUrl);
      }
      setPatientData(response);
    } catch (error: any) {
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
        action: (
          <ToastAction
            altText="Try again"
            onClick={() => {
              window.location.reload();
            }}
          >
            Try again
          </ToastAction>
        ),
      });
    }
  };
  useEffect(() => {
    const pathParts = pathname.split("/");
    const tabUrl = pathParts[pathParts.length - 1];

    fetchData();
  }, [patientId, router, params, isSave]);
  //removed router and params replaced with pathname for reduce icon reload
  console.log(patientData, "patientData");

  const pathParts = pathname.split("/");
  const tabUrl = pathParts[pathParts.length - 1];

  const handleCopyClick = () => {
    if (inputRef.current) {
      sonner.success("Patient ID copied to clipboard");
      const range = document.createRange();
      range.selectNodeContents(inputRef.current);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
      document.execCommand("copy");
      selection?.removeAllRanges();
    }
  };
  const toggleMaxSizeToast = (): void => {
    toast({
      variant: "destructive",
      title: "File Size Too Big!",
      description: `Total size of selected files exceeds the limit of 15MB!`,
    });
  };
  const [selectedFileNames, setSelectedFileNames] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File[]>([]);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [fileTypes, setFileTypes] = useState<string[]>([]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const MAX_FILE_SIZE_MB = 15;

    if (!file) {
      console.warn("No file selected");
      return;
    }

    const fileSizeMB = file.size / (1024 * 1024); // Convert bytes to MB

    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      toggleMaxSizeToast();
      e.target.value = ""; // Clear the input field
      return;
    }

    const reader = new FileReader();

    reader.onload = async () => {
      if (typeof reader.result === "string") {
        setPatientImage(reader.result);

        try {
          const userIconFormData = new FormData();
          userIconFormData.append("profileimage", file, file.name);

          console.log("userIconFormData", userIconFormData);

          const addUserIcon = await updatePatientProfileImage(
            patientId,
            userIconFormData,
          );
          setIsLoading(true);

          loadDefaultImage();
          fetchData();

          console.log(
            `Icon FILE ${file.name} added successfully:`,
            addUserIcon,
          );
        } catch (error: any) {
          if (error.message === "Patient already exists") {
            console.log("conflict error");
          } else {
            console.log(error.message);
            setError("Failed to add Patient");
          }
        }
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div
      className={cn(
        "sticky top-0 z-[5] flex w-full flex-col gap-[3px] bg-white pt-[90px]",
        { "pb-8": tabUrl === "patient-details" },
      )}
    >
      <div className="p-table-title relative flex gap-1 pb-2">
        <div
          className={`flex cursor-pointer items-center gap-5 transition-opacity delay-150 duration-300 ${isCollapsed ? "block opacity-100" : "hidden opacity-0"}`}
          onMouseEnter={onOpenHoverEnter}
          onMouseLeave={onOpenHoverLeave}
          onClick={toggleSidebar}
        >
          <Image
            className=""
            src={`${isOpenHovered ? "/icons/sidebar-hover.svg" : "/icons/sidebar-open.svg"}`}
            alt="sidebar-open"
            width={20}
            height={20}
          />
        </div>

        <h1>Patient Overview</h1>
        <div
          className={`absolute left-[1.5%] rounded-[5px] bg-[#007C85] px-3 py-1 !text-[15px] !font-semibold text-white transition-all duration-100 ${isOpenHovered ? "scale-100" : "scale-0"}`}
        >
          <h1>OPEN</h1>
        </div>
      </div>
      <div className="relative flex w-full gap-[30px] rounded-[5px] p-5 ring-1 ring-[#D0D5DD]">
        {currentRoute === "patient-details" && (
          <div
            className={`absolute transition-all duration-300 ${isCollapsed ? "left-[12.7%]" : "left-[13.8%]"} bottom-8 z-10 flex h-[28px] w-[28px] cursor-pointer items-center justify-center rounded-full bg-white`}
          >
            <label htmlFor="fileInput">
              <Image
                src={"/icons/edit-profile-pic.svg"}
                alt="edit-profile"
                width={26}
                height={26}
                className="cursor-pointer"
              />
            </label>
            <input
              type="file"
              id="fileInput"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
        )}

        <div className="relative">
          {currentRoute === "patient-details" && (
            <label
              htmlFor="fileInput"
              className="absolute h-full w-full cursor-pointer rounded-[5px] hover:bg-[#007C8599]"
            ></label>
          )}
          {!isLoading ? (
            <>
              {patientImage ? (
                <Image
                  className="max-h-[200px] min-h-[200px] min-w-[200px] max-w-[200px] rounded-[5px] object-cover"
                  width={200}
                  height={200}
                  src={patientImage}
                  alt="profile"
                />
              ) : (
                <Image
                  className="max-h-[200px] min-h-[200px] min-w-[200px] max-w-[200px] rounded-[5px] object-cover"
                  width={200}
                  height={200}
                  src="/imgs/user-no-icon.svg"
                  alt="profile"
                />
              )}
            </>
          ) : (
            <div className="h-[200px] w-[200px] animate-pulse rounded-lg bg-gray-300"></div>
          )}
        </div>

        <div className="flex w-full justify-between font-medium">
          <div className="flex flex-col justify-between gap-[20px] pt-[10px]">
            <div className="flex flex-col gap-[15px]">
              {isLoading ? (
                <div className="h-[30px] w-52 animate-pulse rounded-full bg-gray-300"></div>
              ) : (
                <p className="p-title ml-1">
                  {patientData[0]?.firstName} {patientData[0]?.middleName}{" "}
                  {patientData[0]?.lastName}
                </p>
              )}
              <div className="flex flex-col gap-[15px]">
                <div className="flex gap-[55px]">
                  {isLoading ? (
                    <div className="flex animate-pulse items-start">
                      <div className="mr-2 h-[22px] w-32 rounded-full bg-gray-300"></div>
                      <div className="mr-2 h-[22px] w-24 rounded-full bg-gray-400"></div>
                      <div className="mr-2 h-[22px] w-36 rounded-full bg-gray-300"></div>
                      <div className="mr-2 h-[22px] w-36 rounded-full bg-gray-200"></div>
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-[3px]">
                        <img
                          src="/imgs/profile-circle-new.svg"
                          className="px-1"
                          alt="profile"
                          width="26"
                          height="26"
                        />
                        <p className="">Patient</p>
                      </div>
                      <p className="">Age: {patientData[0]?.age}</p>
                      <p className=" ">Gender: {patientData[0]?.gender}</p>
                      <div className="flex gap-[8px]">
                        <p className="flex items-center">
                          ID: <span ref={inputRef}>{patientData[0]?.uuid}</span>
                        </p>
                        <img
                          src="/imgs/id.svg"
                          alt="copy"
                          className="cursor-pointer"
                          onClick={handleCopyClick}
                        />
                      </div>
                    </>
                  )}
                </div>
                <div className="w-full">
                  {isLoading ? (
                    <div className="flex animate-pulse items-start">
                      <div className="mr-12 h-5 w-44 rounded-full bg-gray-400"></div>
                      <div className="h-5 w-60 rounded-full bg-gray-400"></div>
                    </div>
                  ) : (
                    <div className="grid w-full grid-cols-4 gap-x-4">
                      <div className="col-span-1 flex w-[239px] gap-2">
                        <img
                          src="/imgs/codestatus.svg"
                          className="px-1"
                          alt="codestatus"
                          width="26"
                          height="26"
                        />
                        <p>
                          Code Status:
                          <span
                            className={`${
                              patientData[0]?.codeStatus === "DNR"
                                ? "text-[#DB3956]"
                                : "text-[#1B84FF]"
                            } ml-1 w-[200px] font-extrabold`}
                          >
                            {patientData[0]?.codeStatus}
                          </span>
                        </p>
                      </div>
                      <div className="col-span-1 w-full">
                        <p className="flex w-[239px] truncate">
                          Allergy:{" "}
                          <span className="truncate">
                            {patientData[0]?.allergies ? (
                              <ResuableTooltip
                                text={patientData[0]?.allergies}
                              />
                            ) : (
                              "None"
                            )}
                          </span>
                        </p>
                      </div>
                      <div className="col-span-1 w-full">
                        <p className="flex w-[239px] truncate">
                          Mobility:{" "}
                          <span className="truncate">
                            {patientData[0]?.mobility ? (
                              <ResuableTooltip
                                text={patientData[0]?.mobility}
                              />
                            ) : (
                              "None"
                            )}
                          </span>
                        </p>
                      </div>
                      <div className="col-span-1 w-full">
                        <p className="flex w-[239px] truncate">
                          Dietary Restriction:{" "}
                          <span className="truncate">
                            {patientData[0]?.dietaryRestrictions ? (
                              <ResuableTooltip
                                text={patientData[0]?.dietaryRestrictions}
                              />
                            ) : (
                              "None"
                            )}
                          </span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-[50px] px-2">
              {isLoading ? (
                <div className="flex animate-pulse items-start">
                  <div className="mr-12 h-8 w-10 rounded-full bg-gray-300"></div>
                  <div className="mr-12 h-8 w-14 rounded-full bg-gray-200"></div>
                  <div className="mr-12 h-8 w-20 rounded-full bg-gray-300"></div>
                  <div className="mr-12 h-8 w-36 rounded-full bg-gray-400"></div>
                  <div className="mr-12 h-8 w-28 rounded-full bg-gray-300"></div>
                  <div className="mr-12 h-8 w-24 rounded-full bg-gray-200"></div>
                  <div className="mr-12 h-8 w-14 rounded-full bg-gray-400"></div>
                  <div className="h-8 w-24 rounded-full bg-gray-200"></div>
                </div>
              ) : (
                tabs.map((tab, index) => (
                  <Link href={tab.url} key={index}>
                    <p
                      className={`cursor-pointer font-bold ${
                        pathname === tab.url ||
                        (tabUrl === "surgeries" &&
                          tab.label === "Medical History") ||
                        (tabUrl === "prorenata" && tab.label === "MAR") ||
                        (tabUrl === "prn" && tab.label === "Prescription") ||
                        (tabUrl === "dietary" && tab.label === "Orders") ||
                        (tabUrl === "laboratory" && tab.label === "Orders") ||
                        (tabUrl === "incident-report" &&
                          tab.label === "Notes") ||
                        (tabUrl === "archived" && tab.label === "Forms")
                          ? "border-b-2 border-[#007C85] pb-1 text-[15px] text-[#007C85]"
                          : "h-[31px] border-[#007C85] pb-1 text-[15px] hover:border-b-2 hover:text-[#007C85]"
                      }`}
                      onClick={() => {
                        disableEdit(); // disable edit on tab change
                      }}
                    >
                      {tab.label}
                    </p>
                  </Link>
                ))
              )}
            </div>
          </div>

          <div
            className={`cursor-pointer ${isLoading ? "hidden" : ""} absolute right-0`}
          >
            <Link href={`/patient-overview/${params.id}/patient-details`}>
              <p
                onClick={() => {}}
                className={`mr-10 text-right text-[15px] font-semibold underline hover:text-[#007C85] ${
                  currentRoute === "patient-details" ? "text-[#007C85]" : ""
                }`}
                onMouseEnter={handleSeeMoreHover}
                onMouseLeave={handleSeeMoreLeave}
              >
                See more details
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
