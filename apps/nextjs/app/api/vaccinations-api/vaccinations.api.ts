import axios, { AxiosError } from "axios";
import { onNavigate } from "@/actions/navigation";
import { getAccessToken, setAccessToken } from "../login-api/accessToken";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function fetchVaccinationsByPatient(
  patientUuid: string,
  term: string,
  currentPage: number,
  sortBy: string,
  sortOrder: "ASC" | "DESC",
  perPage: number,
  router: any // Pass router instance as a parameter
): Promise<any> {
  const requestData = {
    patientUuid: patientUuid.toUpperCase(),
    term: term,
    page: currentPage,
    sortBy: sortBy,
    sortOrder: sortOrder,
    perPage: perPage,
  
  };
  try {
    console.log("vaccinations", requestData);
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Access token not found in local storage");
    }

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await axios.post(
      `${apiUrl}/vaccination/list/${patientUuid}`,
      requestData,
      { headers }
    );

    console.log(response.data);
    const patientVaccinations = response.data;
    console.log(patientVaccinations, "patient vaccinations after search");
    return patientVaccinations;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.message === "Network Error") {
        // Handle network error
        console.error("Connection refused or network error occurred.");
        return Promise.reject(new Error("Connection refused or network error occurred."));
      }
      if (axiosError.response?.status === 401) {
        setAccessToken("");
        onNavigate(router, "/login");
        return Promise.reject(new Error("Unauthorized access"));
      }
    }
    console.error("Error searching patient vaccinations:", error.message);
    return Promise.reject(error);
  }
}


export async function createVaccinationOfPatient(patientId: string, vaccinationData: any, router: any): Promise<any> {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Access token not found in local storage");
    }

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    // Make the API request to create the Notes
    const response = await axios.post(`${apiUrl}/vaccination/${patientId}`, vaccinationData, { headers });
    const createdVaccinations = response.data;

    return createdVaccinations;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.message === "Network Error") {
        // Handle network error
        console.error("Connection refused or network error occurred.");
        return Promise.reject(new Error("Connection refused or network error occurred."));
      }
      if (axiosError.response?.status === 401) {
        setAccessToken("");
        onNavigate(router, "/login");
        return Promise.reject(new Error("Unauthorized access"));
      }
    }
    console.error("Error searching patient vaccinations:", error.message);
    return Promise.reject(error);
  }
}

// fetchvaccination
export async function fetchVaccinationFiles(
  vaccinationViewUuid: string,
  router: any // Pass router instance as a parameter
): Promise<any> {
  const requestData = {
    vaccinationViewUuid: vaccinationViewUuid.toUpperCase(),
  };
  console.log(vaccinationViewUuid);
  try {
    console.log("searchPatient", requestData);
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Access token not found in local storage");
    }

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await axios.get(
      `${apiUrl}/vaccination/${vaccinationViewUuid}/files`,
      { headers }
    );

    console.log(response.data, 'api fetch vaccination files');
    return response;

  } catch (error) {
    if ((error as AxiosError).response?.status === 401) {
      setAccessToken("");
      onNavigate(router, "/login");
      return Promise.reject(new Error("Unauthorized access"));
    }
    console.error(
      "Error searching vaccination files:",
      (error as AxiosError).message
    );
  }
}
// fetchvaccination

// Add
export async function addVaccinationFile(vaccinationsUuid: string, vaccinationData: any, router?: any): Promise<any> {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Access token not found in local storage");
    }

    // Set headers
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'multipart/vaccination-data',  // Axios should set this automatically, but specify it just in case
    };

    // Log the VaccinationData content for debugging
    for (let [key, value] of vaccinationData.entries()) {
      console.log(`VaccinationData key: ${key}, value: ${value}`);
    }

    // Make the API request to upload files
    const response = await axios.post(`${apiUrl}/vaccination/${vaccinationsUuid}/uploadfiles`, vaccinationData, { headers });

    const vaccinationFileInserted = response.data;
    console.log("Vaccination files uploaded successfully:", vaccinationFileInserted);

    return vaccinationFileInserted;
  } catch (error: any) {
    console.error("Error uploading vaccination files:", error);

    // Log error details for troubleshooting
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    }
    throw error; // Rethrow the error to handle it in the calling function
  }
}
// Add

// Delete
export async function deleteVaccinationFiles(vaccinationsUuid: string, fileUUID: string): Promise<any> {
  try {
    // Retrieve the access token from local storage
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Access token not found in local storage");
    }

    // Define the headers for the request, including the Authorization header
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    // Define the request data with the array of fileUUIDs
    const response = await axios.patch(`${apiUrl}/vaccination/files/delete/${fileUUID}`, {}, {
      headers,
    });
    console.log(response, "vaccinationFileInserted");

    // Return the response data if the deletion is successful
    return response.data;

  } catch (error) {
    console.error("Error deleting files:", error);
    throw error; // Rethrow the error to handle it in the calling component
  }
}
// Delete

// Fetch
export async function getCurrentFileCountFromDatabase(
  vaccinationsUuid: string,
): Promise<any> {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Access token not found in local storage");
    }

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await axios.get(
      `${apiUrl}/vaccination/${vaccinationsUuid}/files/count`,
      { headers }
    );

    console.log(response.data, 'api fetch COUNT');
    return response.data;

  } catch (error) {
    if ((error as AxiosError).response?.status === 401) {
      setAccessToken("");
      return Promise.reject(new Error("Unauthorized access"));
    }
    console.error(
      "Error searching vaccination files:",
      (error as AxiosError).message
    );
  }
}
// Fetch

export async function updateVaccinationsOfPatient(
  vaccinationsUuid: string,
  vaccinationData: any,
  router: any):
  Promise<any> {
  try {
    console.log(vaccinationData, "vaccinationdata")
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Access token not found in local storage");
    }

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    // Make the API request to create the Notes
    const response = await axios.patch(
      `${apiUrl}/vaccination/update/${vaccinationsUuid}`,
      vaccinationData,
      { headers });
    const updatedSurgery = response.data;

    return updatedSurgery;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.message === "Network Error") {
        // Handle network error
        console.error("Connection refused or network error occurred.");
        return Promise.reject(new Error("Connection refused or network error occurred."));
      }
      if (axiosError.response?.status === 401) {
        setAccessToken("");
        onNavigate(router, "/login");
        return Promise.reject(new Error("Unauthorized access"));
      }
    }
    console.error("Error searching patient vaccinations:", error.message);
    return Promise.reject(error);
  }
}

