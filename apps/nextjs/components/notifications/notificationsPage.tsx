"use client";
import React, { useCallback, useEffect, useState } from "react";
import PdfDownloader from "../pdfDownloader";
import Image from "next/image";
import DropdownMenu from "../dropdown-menu";
import ResuableTooltip from "../reusable/tooltip";
import { useRouter } from "next/navigation";
import {
  fetchAllNotifications,
  notificationMarkAsRead,
} from "@/app/api/notifications-api/notifications.api";
import { Notification, UserDetail } from "@/lib/interface";
import PatientIcon from "../reusable/patientIcon";
import Pagination from "../shared/pagination";
import { formatDate, formatTableDate, formatTableTime } from "@/lib/utils";
import { getUserDetail } from "@/app/api/login-api/accessToken";

const NotificationsPage = () => {
  const router = useRouter();
  const userDetail: UserDetail = getUserDetail();
  const [isOpenOrderedBy, setIsOpenOrderedBy] = useState(false);
  const [isOpenSortedBy, setIsOpenSortedBy] = useState(false);
  const [pageNumber, setPageNumber] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [term, setTerm] = useState("");
  const [filter, setFilter] = useState("All");

  const fetchData = useCallback(async () => {
    try {
      const response = await fetchAllNotifications(
        term,
        filter,
        currentPage,
        5,
        userDetail.uuid!,
        router
      );
      setNotifications(response.data);
      setTotalPages(response.totalPages);
      setTotalCount(response.totalCount);
    } catch (error: any) {
      console.error("Error fetching notifications:", error.message);
    }
  }, [term, filter, currentPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilterOptionClick = (option: string) => {
    setFilter(option === "All" ? "All" : option);
  };

  const optionsFilter = [
    { label: "All", onClick: handleFilterOptionClick },
    { label: "Medication", onClick: handleFilterOptionClick },
    { label: "Appointment", onClick: handleFilterOptionClick },
  ];

  const filteredOptions =
    filter === "All"
      ? optionsFilter.filter((option) => option.label !== "All")
      : optionsFilter;

  const handleNotificationClick = (
    notificationId: string,
    label: string,
    patientId: string,
    id: string | undefined,
  ) => {
    const markAsRead = async () => {
      const mark = await notificationMarkAsRead(
        userDetail.uuid!,
        notificationId,
        router,
      );
    };
    markAsRead();

    if (label === "Medication") {
      router.push("/chart?id=" + patientId);
    } else if (label === "Appointment") {
      router.push(
        `/patient-overview/${patientId}/patient-appointment?id=${id}`,
      );
    }
  };

  console.log(currentPage, "currentPage");
  console.log(pageNumber, "pageNumber");

  return (
    <div className="w- flex h-full flex-col justify-between">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <p className="p-title">Notifications</p>
            <p className="sub-title h-[22px] w-[1157px]">
              Total of {totalCount} notifications
            </p>
          </div>
          <div className="flex flex-row justify-end gap-2">
            <PdfDownloader
              props={["Uuid", "Name", "Age", "Gender"]}
              variant={"Patient List Table"}
            />
          </div>
        </div>

        <div className="mt-4 flex h-[75px] w-full items-center justify-between bg-[#F4F4F4]">
          <form className="relative mr-5">
            <div className="flex flex-col">
              <input
                className="sub-title relative m-5 h-[47px] w-[573px] rounded bg-[#fff] bg-no-repeat px-5 py-3 pl-10 pt-[14px] outline-none ring-[1px] ring-[#E7EAEE]"
                type="text"
                placeholder="Search by reference no. or name..."
                value={term}
                onChange={(e) => {
                  setTerm(e.target.value);
                  setCurrentPage(1);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    // Add your search logic here
                  }
                }}
              />
              <Image
                src="/svgs/search.svg"
                alt="Search"
                width={18.75}
                height={18.75}
                className="pointer-events-none absolute left-8 top-9 h-[18.75px] w-[18.75px]"
              />
            </div>
          </form>

          <div className="mr-3 flex w-full items-center justify-end gap-[12px]">
            <p className="text-[15px] font-semibold text-[#191D23] opacity-[60%]">
              Filter
            </p>
            <DropdownMenu
              options={filteredOptions.map(({ label, onClick }) => ({
                label,
                onClick: () => {
                  onClick(label);
                },
              }))}
              open={isOpenOrderedBy}
              width={"165px"}
              checkBox={false}
              label={"Select"}
            />
          </div>
        </div>
        <div>
          <table className="w-full items-start justify-center">
            <thead className="sub-title text-left !font-semibold rtl:text-right">
              <tr className="h-[70px] border-b border-[#E7EAEE] uppercase">
                <th className="px-6 py-3 !font-semibold">Name</th>
                <th className="px-6 py-3 !font-semibold">Patient UID</th>
                {filter !== "Medication" && (
                  <th className="px-6 py-3 !font-semibold">Type</th>
                )}
                {filter !== "Appointment" && (
                  <th className="px-6 py-3 !font-semibold">Medication</th>
                )}
                {filter !== "Appointment" && (
                  <th className="px-6 py-3 !font-semibold">Dosage</th>
                )}
                <th className="px-6 py-3 !font-semibold">Date</th>
                <th className="px-6 py-3 !font-semibold">Time</th>
                <th className="px-6 py-3 !font-semibold">Status</th>
                <th className="px-6 py-3 !font-semibold">
                  {filter === "Medication"
                    ? "Notes"
                    : filter === "Appointment"
                      ? "Details"
                      : "Notes/Details"}
                </th>
              </tr>
            </thead>
            <tbody>
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <tr
                    key={notification.uuid}
                    className="group cursor-pointer border-b bg-white hover:bg-[#F4F4F4]"
                    onClick={() =>
                      handleNotificationClick(
                        notification.uuid,
                        notification.notificationType,
                        notification.patientId,
                        notification.notificationType === "Appointment"
                          ? notification.appointment?.uuid
                          : notification.medicationLog?.uuid,
                      )
                    }
                  >
                    {notification.userNotifications.length < 1 && (
                      <div className="absolute -ml-5 mb-1 mt-10 flex h-[8px] w-[8px] items-center justify-center rounded-full bg-[#2B81E4]"></div>
                    )}
                    <td className="flex items-center gap-5 px-6 py-5">
                      <div className="max-h-[48px] min-h-[48px] min-w-[48px] max-w-[48px]">
                        <PatientIcon patientId={notification.patientId} />
                      </div>
                      <div className="overflow-hidden">
                        <ResuableTooltip text={notification.patientName} />
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <ResuableTooltip text={notification.patientId} />
                    </td>
                    {filter !== "Medication" && (
                      <td className="px-6 py-5">
                        {notification.notificationType}
                      </td>
                    )}
                    {filter !== "Appointment" && (
                      <td className="px-6 py-5">
                        {notification.medicationName
                          ? notification.medicationName
                          : ("------------")}
                      </td>
                    )}
                    {filter !== "Appointment" && (
                      <td className="px-6 py-5">
                        {notification.medicationDosage
                          ? notification.medicationDosage
                          : ("------------")}
                      </td>
                    )}
                    <td className="px-6 py-5">
                      {formatTableDate(notification.date)}
                    </td>
                    <td className="px-6 py-5">
                      {formatTableTime(notification.time)}
                    </td>
                    <td className="relative">
                      <div className="absolute top-[30px] flex h-[25px] w-[101px] items-center justify-center rounded-[30px] bg-[#FFE8EC] font-semibold text-[#EF4C6A]">
                        {notification.status}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <ResuableTooltip text={notification.details} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-6 py-5 text-center">
                    No notifications available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="">
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

export default NotificationsPage;
