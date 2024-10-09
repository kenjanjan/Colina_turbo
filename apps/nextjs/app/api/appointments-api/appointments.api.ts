import axios, { AxiosError } from "axios";
import { onNavigate } from "@/actions/navigation";
import { getAccessToken, setAccessToken } from "../login-api/accessToken";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function fetchAppointmentsByPatient(
  patientUuid: string,
  term: string,
  currentPage: number,
  sortBy: string,
  sortOrder: "ASC" | "DESC",
  filterStatusFromCheck: string[],
  filterTypeFromCheck: string[],

  perPage: number,
  router: any // Pass router instance as a parameter
): Promise<any> {
  const requestData = {
    patientUuid: patientUuid.toUpperCase(),
    term: term,
    page: currentPage,
    sortBy: sortBy,
    sortOrder: sortOrder,    
    filterStatus: filterStatusFromCheck,
    filterType: filterTypeFromCheck,

    perPage:perPage 
  };
  try {
    console.log("searchPatient", requestData);
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Unauthorized Access");
    }

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await axios.post(
      `${apiUrl}/appointments/list/${patientUuid}`,
      requestData,
      { headers }
    );

    console.log(response.data);
    const { patientId, id, ...patientAppointmentsNoId } = response.data;
    console.log(patientAppointmentsNoId, "patient appointments after search");
    return patientAppointmentsNoId;
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
    console.error("Error searching patient list:", error.message);
    return Promise.reject(error);
  }
}

export async function createAppointmentOfPatient(
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

    // Make the API request to create the allergy
    const response = await axios.post(
      `${apiUrl}/appointments/${patientId}`,
      formData,
      { headers }
    );
    const createdAppointment = response.data;

    return createdAppointment;
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw error; // Rethrow the error to handle it in the component
  }
}

export async function updateAppointmentOfPatient(
  appointmentUuid: string,
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

    // Make the API request to create the allergy
    const response = await axios.patch(
      `${apiUrl}/appointments/update/${appointmentUuid}`,
      formData,
      { headers }
    );
    const updatedAppointment = response.data;

    return updatedAppointment;
  } catch (error) {
    if ((error as AxiosError).response?.status === 401) {
      setAccessToken("");
      onNavigate(router, "/login");
      return Promise.reject(new Error("Unauthorized access"));
    }
    console.error((error as AxiosError).message);
  }
}


export async function addAppointmentFile(
  appointmentUuid: string,
  formData: FormData
): Promise<any> {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Unauthorized Access");
    }

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "multipart/form-data",
    };

    const response = await axios.post(
      `${apiUrl}/appointments/${appointmentUuid}/uploadfiles`,
      formData,
      { headers }
    );

    const appointmentFileInserted = response.data;
    console.log(
      "Appointment files uploaded successfully:",
      appointmentFileInserted
    );

    return appointmentFileInserted;
  } catch (error: any) {
    console.error("Error uploading appointment files:", error);

    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    }
    throw error;
  }
}

export async function deleteAppointmentFile(
  appointmentUuid: string,
  fileUUID: string
): Promise<any> {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Unauthorized Access");
    }

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await axios.patch(
      `${apiUrl}/appointments/files/delete/${fileUUID}`,
      {},
      { headers }
    );
    console.log(response, "appointmentFileDeleted");

    return response.data;
  } catch (error) {
    console.error("Error deleting appointment files:", error);
    throw error;
  }
}


// FILES
export async function fetchAppointmentFiles(
  appointmentUuid: string,
  router: any
): Promise<any> {
  const requestData = {
    appointmentUuid: appointmentUuid.toUpperCase(),
  };
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Unauthorized Access");
    }

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await axios.get(
      `${apiUrl}/appointments/${appointmentUuid}/files`,
      { headers }
    );

    return response;
  } catch (error) {
    if ((error as AxiosError).response?.status === 401) {
      setAccessToken("");
      onNavigate(router, "/login");
      return Promise.reject(new Error("Unauthorized access"));
    }
    console.error(
      "Error fetching appointment files:",
      (error as AxiosError).message
    );
  }
}

export async function getCurrentAppointmentFileCountFromDatabase(
  appointmentUuid: string
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
      `${apiUrl}/appointments/${appointmentUuid}/files/count`,
      { headers }
    );

    return response.data;
  } catch (error) {
    if ((error as AxiosError).response?.status === 401) {
      setAccessToken("");
      return Promise.reject(new Error("Unauthorized access"));
    }
    console.error(
      "Error fetching appointm files count:",
      (error as AxiosError).message
    );
  }
}
