import { onNavigate } from "@/actions/navigation";
import axios, { AxiosError } from "axios";
import { getAccessToken, setAccessToken } from "../login-api/accessToken";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function fetchNotifications(
  userId: string,
  router: any, // Pass router instance as a parameter
): Promise<any> {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Unauthorized Access");
    }

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await axios.get(
      `${apiUrl}/user-notifications/missed/${userId}`,
      { headers },
    );

    console.log(response.data);
    const notifications = response.data;
    console.log(notifications, "notifications after search");
    return notifications;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.message === "Network Error") {
        // Handle network error
        console.error("Connection refused or network error occurred.");
        return Promise.reject(
          new Error("Connection refused or network error occurred."),
        );
      }
      if (axiosError.response?.status === 401) {
        setAccessToken("");
        onNavigate(router, "/login");
        return Promise.reject(new Error("Unauthorized access"));
      }
    }
    console.error("Error searching notifications list:", error.message);
    return Promise.reject(error);
  }
}


export async function fetchAllNotifications(
  term: string,
  notificationType: string,
  page: number,
  perPage: number,
  userUuid: string,
  router: any, // Pass router instance as a parameter
): Promise<any> {
  const requestData = {
    term: term,
    notificationType: notificationType,
    page: page,
    perPage: perPage,
    userUuid: userUuid,
  };
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Unauthorized Access");
    }

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await axios.post(
      `${apiUrl}/notifications/all-notifications`,
      requestData,
      { headers },
    );

    console.log(response.data);
    const allNotifications = response.data;
    console.log(allNotifications, "allNotifications go");
    return allNotifications;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.message === "Network Error") {
        // Handle network error
        console.error("Connection refused or network error occurred.");
        return Promise.reject(
          new Error("Connection refused or network error occurred."),
        );
      }
      if (axiosError.response?.status === 401) {
        setAccessToken("");
        onNavigate(router, "/login");
        return Promise.reject(new Error("Unauthorized access"));
      }
    }
    console.error("Error allNotifications list:", error.message);
    return Promise.reject(error);
  }
}


export async function notificationMarkAsRead(
  userUuid: string,
  notificationUuid: string,
  router: any, // Pass router instance as a parameter
): Promise<any> {
  const requestData = {
    userId: userUuid,
    notificationId: notificationUuid,
  };
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Unauthorized Access");
    }

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await axios.post(
      `${apiUrl}/user-notifications/mark-read`,
      requestData,
      { headers },
    );

    console.log(response.data);
    const markAsRead = response.data;
    console.log(markAsRead, "markAsRead go");
    return markAsRead;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.message === "Network Error") {
        // Handle network error
        console.error("Connection refused or network error occurred.");
        return Promise.reject(
          new Error("Connection refused or network error occurred."),
        );
      }
      if (axiosError.response?.status === 401) {
        setAccessToken("");
        onNavigate(router, "/login");
        return Promise.reject(new Error("Unauthorized access"));
      }
      if (axiosError.response?.status === 409) {
        console.log("Notification already marked as read.");
        return Promise.resolve("Already marked as read");
      }
    }
    console.error("Error mark as read:", error.message);
    return Promise.reject(error);
  }
}