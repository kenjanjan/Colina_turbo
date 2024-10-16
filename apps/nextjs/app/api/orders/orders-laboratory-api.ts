import axios, { AxiosError } from "axios";
import { onNavigate } from "@/actions/navigation";
import { getAccessToken, setAccessToken } from "../login-api/accessToken";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function fetchOrdersLaboratoryByPatient(
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
        console.log("searchOrdersLaboratoryByPatient", requestData);
        const accessToken = getAccessToken();
        if (!accessToken) {
            throw new Error("Unauthorized Access");
        }

        const headers = {
            Authorization: `Bearer ${accessToken}`,
        };

        const response = await axios.post(
            `${apiUrl}/orders-laboratory/patient/${patientUuid}`,
            requestData,
            { headers }
        );

        console.log(response.data);
        const patientOrdersLaboratory = response.data;
        console.log(patientOrdersLaboratory, "patient Orders-Laboratory after search");
        return patientOrdersLaboratory;
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
        console.error("Error searching patient orders-laboratory:", error.message);
        return Promise.reject(error);
    }
}

export async function createOrderLaboratoryOfPatient(
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
        const createdOrderPLaboratory = response.data;

        return createdOrderPLaboratory;
    } catch (error) {
        console.error("Error creating Orders Laboratory:", error);
        throw error;
    }
}

export async function updateOrderLaboratoryOfPatient(
    ordersLaboratoryUuid: string,
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
            `${apiUrl}/adls/update/${ordersLaboratoryUuid}`,
            formData,
            { headers }
        );
        const updateOrdersLaboratory = response.data;

        return updateOrdersLaboratory;
    } catch (error) {
        if ((error as AxiosError).response?.status === 401) {
            setAccessToken("");
            onNavigate(router, "/login");
            return Promise.reject(new Error("Unauthorized access"));
        }
        console.error((error as AxiosError).message);
    }
}
