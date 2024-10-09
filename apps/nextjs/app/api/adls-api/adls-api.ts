import axios, { AxiosError } from "axios";
import { onNavigate } from "@/actions/navigation";
import { getAccessToken, setAccessToken } from "../login-api/accessToken";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function fetchAdlsByPatient(
  patientUuid: string,
  term: string,
  currentPage: number,
  sortBy: string,
  sortOrder: "ASC" | "DESC",
  perPage: number,
  router: any // Pass router instance as a parameter
): Promise<any> {
  const requestData = {
 
    term: term,
    page: currentPage,
    sortBy: sortBy,
    sortOrder: sortOrder,
    perPage: perPage
  };
  try {
    console.log("searchAdls", requestData);
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Unauthorized Access");
    }

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await axios.post(
      `${apiUrl}/adls/list/${patientUuid}`,
      requestData,
      { headers }
    );

    console.log(response.data);
    const patientAdls = response.data;
    console.log(patientAdls, "patient Adls after search");
    return patientAdls;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.message === "Network Error") {
        // Handle network error
        console.error("Connection refused or network error occurred.");
        return Promise.reject(
          new Error("Connection refused or network error occurred.")
        );
      }
      if (axiosError.response?.status === 401) {
        setAccessToken("");
        onNavigate(router, "/login");
        return Promise.reject(new Error("Unauthorized access"));
      }
    }
    console.error("Error searching patient adls:", error.message);
    return Promise.reject(error);
  }
}

export async function createAdlsOfPatient(
  patientId: string,
  formData: any,
  router: any
): Promise<any> {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Unauthorized Access");
    }

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    // Make the API request to create the ADLS
    const response = await axios.post(
      `${apiUrl}/adls/${patientId}`,
      formData,
      { headers }
    );
    const createdAdls = response.data;

    return createdAdls;
  } catch (error) {
    console.error("Error creating Adls:", error);
    throw error; // Rethrow the error to handle it in the component
  }
}

export async function updateAdlsOfPatient(
  adlsUuid: string,
  formData: any,
  router: any
): Promise<any> {
  try {
    console.log(formData, "formdata");
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Unauthorized Access");
    }

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    // Make the API request to create the Notes
    const response = await axios.patch(
      `${apiUrl}/adls/update/${adlsUuid}`,
      formData,
      { headers }
    );
    const updatedAdls = response.data;

    return updatedAdls;
  } catch (error) {
    if ((error as AxiosError).response?.status === 401) {
      setAccessToken("");
      onNavigate(router, "/login");
      return Promise.reject(new Error("Unauthorized access"));
    }
    console.error((error as AxiosError).message);
  }
}
