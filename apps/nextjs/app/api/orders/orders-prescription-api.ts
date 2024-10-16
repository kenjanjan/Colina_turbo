import axios, { AxiosError } from "axios";
import { onNavigate } from "@/actions/navigation";
import { getAccessToken, setAccessToken } from "../login-api/accessToken";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function fetchOrdersPrescriptionsByPatient(
    patientUuid: string,
    term: string,
    currentPage: number,
    sortBy: string,
    sortOrder: "ASC" | "DESC",
    perPage: number,
    filterStatus: string[],
    router: any
): Promise<any> {
    const requestData = {
        term: term,
        page: currentPage,
        sortBy: sortBy,
        sortOrder: sortOrder,
        perPage: perPage,
        filterStatus: filterStatus,
    };
    try {
        console.log("searchOrdersPrescriptionsByPatient", requestData);
        const accessToken = getAccessToken();
        if (!accessToken) {
            throw new Error("Unauthorized Access");
        }

        const headers = {
            Authorization: `Bearer ${accessToken}`,
        };

        const response = await axios.post(
            `${apiUrl}/orders-prescriptions/patient/${patientUuid}`,
            requestData,
            { headers }
        );

        console.log(response.data);
        const patientOrdersPrescription = response.data;
        console.log(patientOrdersPrescription, "patient Orders-Prescriptions after search");
        return patientOrdersPrescription;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            if (axiosError.message === "Network Error") {
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
        console.error("Error searching patient orders-prescriptions:", error.message);
        return Promise.reject(error);
    }
}

export async function createOrderPrescriptionOfPatient(
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

        const response = await axios.post(
            `${apiUrl}/adls/${patientId}`,
            formData,
            { headers }
        );
        const createdOrderPrescription = response.data;

        return createdOrderPrescription;
    } catch (error) {
        console.error("Error creating Orders Prescription:", error);
        throw error;
    }
}

export async function updateOrderPrescriptionOfPatient(
    ordersPrescriptionUuid: string,
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
            `${apiUrl}/adls/update/${ordersPrescriptionUuid}`,
            formData,
            { headers }
        );
        const updateOrdersPrescription = response.data;

        return updateOrdersPrescription;
    } catch (error) {
        if ((error as AxiosError).response?.status === 401) {
            setAccessToken("");
            onNavigate(router, "/login");
            return Promise.reject(new Error("Unauthorized access"));
        }
        console.error((error as AxiosError).message);
    }
}
