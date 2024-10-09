import { z } from "zod";

const patientDetailsSchema = z.object( {
    firstName: z.string().nonempty("First name is required"),
    lastName: z.string().nonempty("Last name is required"),
    middleName: z.string().optional(),
    gender: z.string().nonempty("Gender is required"),
    age: z.number().nonnegative("Age is required"),
    dateOfBirth: z.string().nonempty("Date of birth is required"),
    phoneNo: z.string().nonempty("Phone number is required"),
    address1: z.string().nonempty("Address line 1 is required"),
    city: z.string().nonempty("City is required"),
    address2: z.string().optional(),
    state: z.string().nonempty("State is required"),
    country: z.string().nonempty("Country is required"),
    zip: z.string().nonempty("Zip code is required"),
    admissionDate: z.string().optional(),
    codeStatus: z.string().nonempty("Code status is required"),
    email: z.string().email("Invalid email address"),
})

export default patientDetailsSchema