import React, { forwardRef, use, useEffect, useState } from "react";
import Image from "next/image";
import PatientIcon from "./reusable/patientIcon";
import {
  fetchNotifications,
  notificationMarkAsRead,
} from "@/app/api/notifications-api/notifications.api";
import { useRouter } from "next/navigation";
import { cn, timeElapsed } from "@/lib/utils";
import ResuableTooltip from "./reusable/tooltip";
import { getUserDetail } from "@/app/api/login-api/accessToken";
import Link from "next/link";
import { NotificationProps, UserDetail } from "@/lib/interface";

const Notification = forwardRef<HTMLDivElement, NotificationProps>(
  (props, ref) => {
    const router = useRouter();
    const userDetail: UserDetail = getUserDetail();

    const [isPreviousNotification, setIsPreviousNotification] = useState(false);

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
      try {
        markAsRead();
      } catch (error) {
      } finally {
        props.setIsNotificationClicked(props.isNotificationClicked + 1);
        if (label === "Medication") {
          router.push("/chart?id=" + patientId);
        } else if (label === "Appointment") {
          router.push(
            `/patient-overview/${patientId}/patient-appointment?id=${id}`,
          );
        }
      }
    };

    const limitedNotifications = props.notifications.slice(0, 6);
    console.log(props.notifications, "notifications");
    return (
      <div
        ref={ref}
        className="absolute right-7 top-20 z-40 flex h-auto w-full max-w-[409px] flex-col justify-center rounded-[5px] bg-white drop-shadow-lg"
      >
        <div className="flex h-full w-full flex-col justify-between gap-5 py-5">
          <div className="h-full w-full">
            <div className="flex justify-between px-8 pb-3">
              <h1 className="py-1 text-[20px] font-semibold">Notification</h1>
              <Link href={"/notifications"}>
                <h1
                  className={cn(
                    "cursor-pointer px-4 py-1 font-medium text-[#2B81E4] hover:bg-[#F9F9F9]",
                    {
                      hidden:
                        props.notifications.length === 0 ||
                        limitedNotifications.length === 0,
                    },
                  )}
                  onClick={() => props.setIsNotificationOpen(false)}
                >
                  See all
                </h1>
              </Link>
            </div>
            <div className="flex h-full w-full flex-col gap-7">
              {/* CONTENT */}
              <div
                className={`flex h-full ${isPreviousNotification ? "max-h-[750px]" : "max-h-[450px]"} w-full flex-col gap-2 overflow-y-auto px-5`}
              >
                {(isPreviousNotification
                  ? props.notifications
                  : limitedNotifications
                ).length === 0 ? (
                  <div className="flex w-full items-center justify-center text-gray-500">
                    No Notification/s
                  </div>
                ) : (
                  (isPreviousNotification
                    ? props.notifications
                    : limitedNotifications
                  ).map((notification, index) => (
                    <div
                      className="flex w-full cursor-pointer justify-between gap-4 px-3 py-2 font-medium hover:bg-[#F4F4F4]"
                      key={index}
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
                      <div className="flex w-11/12 gap-4">
                        <div>
                          <PatientIcon patientId={notification.patientId} />
                        </div>
                        <div className="flex flex-col">
                          <div className="w-48 truncate">
                            <h1>
                              <ResuableTooltip
                                text={notification.patientName}
                              />
                            </h1>
                          </div>
                          <div>
                            <h1 className="sub-title">
                              {notification.notificationType === "Appointment"
                                ? "Appointment has been missed."
                                : "Medication has been missed."}
                            </h1>
                          </div>
                        </div>
                      </div>
                      <div className="flex w-1/12 flex-col items-center">
                        <div className="flex flex-col items-center">
                          {notification.userNotifications.length < 1 && (
                            <div className="mb-1 h-[8px] w-[8px] rounded-full bg-[#2B81E4]"></div>
                          )}
                          <h1>
                            {timeElapsed(notification.date, notification.time)}
                          </h1>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          {!isPreviousNotification && (
            <div
              className={cn(
                "w-full cursor-pointer px-8 text-center font-medium",
                {
                  hidden:
                    props.notifications.length <= 6 ||
                    limitedNotifications.length == 0,
                },
              )}
            >
              <button
                className="w-full bg-[#F9F9F9] p-3 hover:text-[#007C85]"
                onClick={() => setIsPreviousNotification(true)}
              >
                See previous notifications
              </button>
            </div>
          )}
        </div>
      </div>
    );
  },
);

export default Notification;
