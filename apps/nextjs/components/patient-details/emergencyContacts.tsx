"use client";
import {
  createPatientEmergencyContact,
  fetchEmergencyContactsOfPatient,
  updateEmergencyContactOfPatient,
} from "@/app/api/emergency-contacts-api/emergency-contacts-api";
import { EmergencyContactsProps } from "@/lib/interface";
import { cn } from "@/lib/utils";
import { LucideLoader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SuccessModal } from "../shared/success";
import { ErrorModal } from "../shared/error";
const EmergencyContacts = ({ patientId }: any) => {
  const router = useRouter();
  const [isDisabled, setIsDisabled] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [error, setError] = useState("");
  const [canUpdate, setCanUpdate] = useState(false);

  const [initialFormData1, setInitialFormData1] =
    useState<EmergencyContactsProps>({
      uuid: "",
      name: "",
      patientRelationship: "",
      phoneNumber: "",
      email: "",
    });

  const [initialFormData2, setInitialFormData2] =
    useState<EmergencyContactsProps>({
      uuid: "",
      name: "",
      patientRelationship: "",
      phoneNumber: "",
      email: "",
    });

  const [initialFormData3, setInitialFormData3] =
    useState<EmergencyContactsProps>({
      uuid: "",
      name: "",
      patientRelationship: "",
      phoneNumber: "",
      email: "",
    });

  const [formData1, setFormData1] = useState<EmergencyContactsProps>({
    uuid: "",
    name: "",
    patientRelationship: "",
    phoneNumber: "",
    email: "",
  });

  const [formData2, setFormData2] = useState<EmergencyContactsProps>({
    uuid: "",
    name: "",
    patientRelationship: "",
    phoneNumber: "",
    email: "",
  });

  const [formData3, setFormData3] = useState<EmergencyContactsProps>({
    uuid: "",
    name: "",
    patientRelationship: "",
    phoneNumber: "",
    email: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchEmergencyContactsOfPatient(
          patientId,
          "",
          1,
          "name",
          "ASC",
          router,
        );

        const contacts = response.data;

        const contact1 = contacts[0] || null;
        const contact2 = contacts[1] || null;
        const contact3 = contacts[2] || null;

        if (contact1) {
          setFormData1({
            uuid: contact1.contact_uuid || "",
            name: contact1.contact_name || "",
            patientRelationship: contact1.contact_patientRelationship || "",
            phoneNumber: contact1.contact_phoneNumber || "",
            email: contact1.contact_email || "",
          });
          setInitialFormData1({
            uuid: contact1.contact_uuid || "",
            name: contact1.contact_name || "",
            patientRelationship: contact1.contact_patientRelationship || "",
            phoneNumber: contact1.contact_phoneNumber || "",
            email: contact1.contact_email || "",
          });
        }
        if (contact2) {
          setFormData2({
            uuid: contact2.contact_uuid || "",
            name: contact2.contact_name || "",
            patientRelationship: contact2.contact_patientRelationship || "",
            phoneNumber: contact2.contact_phoneNumber || "",
            email: contact2.contact_email || "",
          });
          setInitialFormData2({
            uuid: contact2.contact_uuid || "",
            name: contact2.contact_name || "",
            patientRelationship: contact2.contact_patientRelationship || "",
            phoneNumber: contact2.contact_phoneNumber || "",
            email: contact2.contact_email || "",
          });
        }
        if (contact3) {
          setFormData3({
            uuid: contact3.contact_uuid || "",
            name: contact3.contact_name || "",
            patientRelationship: contact3.contact_patientRelationship || "",
            phoneNumber: contact3.contact_phoneNumber || "",
            email: contact3.contact_email || "",
          });
          setInitialFormData3({
            uuid: contact3.contact_uuid || "",
            name: contact3.contact_name || "",
            patientRelationship: contact3.contact_patientRelationship || "",
            phoneNumber: contact3.contact_phoneNumber || "",
            email: contact3.contact_email || "",
          });
        }
      } catch (error: any) {
        console.error(error);
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  const data1 = {
    uuid: formData1.uuid,
    name: formData1.name,
    patientRelationship: formData1.patientRelationship,
    phoneNumber: formData1.phoneNumber,
    email: formData1.email,
  };

  const data2 = {
    uuid: formData2.uuid,
    name: formData2.name,
    patientRelationship: formData2.patientRelationship,
    phoneNumber: formData2.phoneNumber,
    email: formData2.email,
  };

  const data3 = {
    uuid: formData3.uuid,
    name: formData3.name,
    patientRelationship: formData3.patientRelationship,
    phoneNumber: formData3.phoneNumber,
    email: formData3.email,
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitted(true);
    try {
      if (!data1.uuid && data1.name) {
        const { uuid, ...dataWithoutUuid } = data1; // Destructure to exclude uuid
        await createPatientEmergencyContact(patientId, dataWithoutUuid, router);
      }
      if (data1.uuid) {
        await updateEmergencyContactOfPatient(data1.uuid, data1, router);
      }
      if (!data2.uuid && data2.name) {
        const { uuid, ...dataWithoutUuid } = data2; // Destructure to exclude uuid
        await createPatientEmergencyContact(patientId, dataWithoutUuid, router);
      }
      if (data2.uuid) {
        await updateEmergencyContactOfPatient(data2.uuid, data2, router);
      }

      if (!data3.uuid && data3.name) {
        const { uuid, ...dataWithoutUuid } = data3; // Destructure to exclude uuid
        await createPatientEmergencyContact(patientId, dataWithoutUuid, router);
      }
      if (data3.uuid) {
        await updateEmergencyContactOfPatient(data3.uuid, data3, router);
      }
      setIsSubmitted(false);
      setIsDisabled(true);
      onSuccess();
    } catch (error: any) {
      console.error("Error updating emergency contact:", error.message);
      onError();
    }
    setIsSubmitted(false);
    setCanUpdate(false);
  };

  const handleOnChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData1((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCanUpdate(true);
  };

  const handleOnChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData2((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCanUpdate(true);
  };

  const handleOnChange3 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData3((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCanUpdate(true);
  };

  const toggleEdit = () => {
    setIsDisabled((prev) => !prev);
  };

  const onSuccess = () => {
    setIsSuccessOpen(true);
  };
  const onError = () => {
    setIsErrorOpen(true);
  };

  const handleCancel = () => {
    setFormData1(initialFormData1);
    setFormData2(initialFormData2);
    setFormData3(initialFormData3);
    setIsDisabled(true);
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="flex h-full w-full flex-col gap-8 rounded-[5px] border-[1.77px] border-[#D0D5DD] py-8"
    >
      <div className="flex gap-5 px-5">
        <Image
          src={"/icons/patient-emergency-contact.svg"}
          alt={"patient-emergency-contact"}
          width={18}
          height={18}
        />
        <h1 className="text-[20px] font-semibold">Emergency Contacts</h1>
      </div>

      <div className="grid w-full grid-cols-4 gap-x-32 gap-y-8 px-14">
        <div className="flex flex-col">
          <label className="font-semibold text-[#64748B]">Contact Name</label>
          <input
            disabled={isDisabled}
            type="text"
            name="name"
            value={formData1.name}
            onChange={handleOnChange1}
            placeholder="n/a"
            className={cn(
              `h-[45px] w-full rounded-[3px] border-[1px] border-[#D0D5DD] bg-[#F4F4F4] px-5 placeholder:text-[#020817]`,
              { "border-0 bg-white px-0 font-semibold": isDisabled },
            )}
          />
        </div>
        <div className="flex flex-col ">
          <label className="font-semibold text-[#64748B]">Relationship</label>
          <input
            disabled={isDisabled}
            name="patientRelationship"
            value={formData1.patientRelationship}
            onChange={handleOnChange1}
            placeholder="n/a"
            className={cn(
              `h-[45px] w-full rounded-[3px] border-[1px] border-[#D0D5DD] bg-[#F4F4F4] px-5 placeholder:text-[#020817]`,
              { "border-0 bg-white px-0 font-semibold": isDisabled },
            )}
          />
        </div>
        <div className="flex flex-col ">
          <label className="font-semibold text-[#64748B]">Contact Number</label>
          <input
            disabled={isDisabled}
            name="phoneNumber"
            value={formData1.phoneNumber}
            onChange={handleOnChange1}
            placeholder="n/a"
            className={cn(
              `h-[45px] w-full rounded-[3px] border-[1px] border-[#D0D5DD] bg-[#F4F4F4] px-5 placeholder:text-[#020817]`,
              { "border-0 bg-white px-0 font-semibold": isDisabled },
            )}
          />
        </div>
        <div className="flex flex-col ">
          <label className="font-semibold text-[#64748B]">Contact Email</label>
          <input
            disabled={isDisabled}
            name="email"
            value={formData1.email}
            onChange={handleOnChange1}
            placeholder="n/a"
            className={cn(
              `h-[45px] w-full rounded-[3px] border-[1px] border-[#D0D5DD] bg-[#F4F4F4] px-5 placeholder:text-[#020817]`,
              { "border-0 bg-white px-0 font-semibold": isDisabled },
            )}
          />
        </div>
      </div>

      <hr className="mx-14 border-[1.77px] border-[#D0D5DD]" />

      <div className="grid w-full grid-cols-4 gap-x-32 gap-y-8 px-14">
        <div className="flex flex-col ">
          <label className="font-semibold text-[#007C85]">
            {"Contact 1 (Optional)"}
          </label>
          <input
            disabled={isDisabled}
            name="name"
            value={formData2.name}
            onChange={handleOnChange2}
            placeholder="n/a"
            className={cn(
              `h-[45px] w-full rounded-[3px] border-[1px] border-[#D0D5DD] bg-[#F4F4F4] px-5 placeholder:text-[#020817]`,
              { "border-0 bg-white px-0 font-semibold": isDisabled },
            )}
          />
        </div>
        <div className="flex flex-col ">
          <label className="font-semibold text-[#64748B]">Relationship</label>
          <input
            disabled={isDisabled}
            name="patientRelationship"
            value={formData2.patientRelationship}
            onChange={handleOnChange2}
            placeholder="n/a"
            className={cn(
              `h-[45px] w-full rounded-[3px] border-[1px] border-[#D0D5DD] bg-[#F4F4F4] px-5 placeholder:text-[#020817]`,
              { "border-0 bg-white px-0 font-semibold": isDisabled },
            )}
          />
        </div>
        <div className="flex flex-col ">
          <label className="font-semibold text-[#64748B]">Contact Number</label>
          <input
            disabled={isDisabled}
            name="phoneNumber"
            value={formData2.phoneNumber}
            onChange={handleOnChange2}
            placeholder="n/a"
            className={cn(
              `h-[45px] w-full rounded-[3px] border-[1px] border-[#D0D5DD] bg-[#F4F4F4] px-5 placeholder:text-[#020817]`,
              { "border-0 bg-white px-0 font-semibold": isDisabled },
            )}
          />
        </div>
        <div className="flex flex-col ">
          <label className="font-semibold text-[#64748B]">Contact Email</label>
          <input
            disabled={isDisabled}
            name="email"
            value={formData2.email}
            onChange={handleOnChange2}
            placeholder="n/a"
            className={cn(
              `h-[45px] w-full rounded-[3px] border-[1px] border-[#D0D5DD] bg-[#F4F4F4] px-5 placeholder:text-[#020817]`,
              { "border-0 bg-white px-0 font-semibold": isDisabled },
            )}
          />
        </div>
      </div>

      <div className="grid w-full grid-cols-4 gap-x-32 gap-y-8 px-14">
        <div className="flex flex-col ">
          <label className="font-semibold text-[#007C85]">
            {"Contact 2 (Optional)"}
          </label>
          <input
            disabled={isDisabled}
            name="name"
            value={formData3.name}
            onChange={handleOnChange3}
            placeholder="n/a"
            className={cn(
              `h-[45px] w-full rounded-[3px] border-[1px] border-[#D0D5DD] bg-[#F4F4F4] px-5 placeholder:text-[#020817]`,
              { "border-0 bg-white px-0 font-semibold": isDisabled },
            )}
          />
        </div>
        <div className="flex flex-col ">
          <label className="font-semibold text-[#64748B]">Relationship</label>
          <input
            disabled={isDisabled}
            name="patientRelationship"
            value={formData3.patientRelationship}
            onChange={handleOnChange3}
            placeholder="n/a"
            className={cn(
              `h-[45px] w-full rounded-[3px] border-[1px] border-[#D0D5DD] bg-[#F4F4F4] px-5 placeholder:text-[#020817]`,
              { "border-0 bg-white px-0 font-semibold": isDisabled },
            )}
          />
        </div>
        <div className="flex flex-col ">
          <label className="font-semibold text-[#64748B]">Contact Number</label>
          <input
            disabled={isDisabled}
            name="phoneNumber"
            value={formData3.phoneNumber}
            onChange={handleOnChange3}
            placeholder="n/a"
            className={cn(
              `h-[45px] w-full rounded-[3px] border-[1px] border-[#D0D5DD] bg-[#F4F4F4] px-5 placeholder:text-[#020817]`,
              { "border-0 bg-white px-0 font-semibold": isDisabled },
            )}
          />
        </div>
        <div className="flex flex-col ">
          <label className="font-semibold text-[#64748B]">Contact Email</label>
          <input
            disabled={isDisabled}
            name="email"
            value={formData3.email}
            onChange={handleOnChange3}
            placeholder="n/a"
            className={cn(
              `h-[45px] w-full rounded-[3px] border-[1px] border-[#D0D5DD] bg-[#F4F4F4] px-5 placeholder:text-[#020817]`,
              { "border-0 bg-white px-0 font-semibold": isDisabled },
            )}
          />
        </div>
      </div>

      <div className="flex justify-end gap-5 pr-[53px] font-medium">
        <button
          type="button"
          onClick={() => {
            toggleEdit(), setCanUpdate(false), handleCancel();
          }}
          className={`${isDisabled ? "hidden" : ""} rounded-[2.8px] bg-[#F3F3F3] p-3 px-8 hover:bg-[#E7EAEE]`}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={toggleEdit}
          className={`${!isDisabled && "hidden"} flex gap-1 rounded-[2.8px] bg-[#1B84FF] p-3 px-8 text-white hover:bg-[#2267B9]`}
        >
          Edit
        </button>
        <button
          disabled={isSubmitted || !canUpdate}
          type="submit"
          className={`${isDisabled && "hidden"} ${isSubmitted || (!canUpdate && "cursor-not-allowed")} flex gap-1 rounded-[2.8px] bg-[#1B84FF] p-3 px-8 text-white hover:bg-[#2267B9]`}
        >
          <LucideLoader2
            className={`animate-spin ${isSubmitted ? "" : "hidden"}`}
            width={16}
          />
          {isSubmitted ? "Saving..." : "Save Changes"}
        </button>
      </div>
      {isSuccessOpen && (
        <SuccessModal
          label="Success"
          isAlertOpen={isSuccessOpen}
          toggleModal={setIsSuccessOpen}
          isUpdated={true}
          setIsUpdated={setIsSuccessOpen}
        />
      )}
      {isErrorOpen && (
        <ErrorModal
          label="Error"
          isAlertOpen={isErrorOpen}
          toggleModal={setIsErrorOpen}
          isEdit={false}
          errorMessage={error}
        />
      )}
    </form>
  );
};

export default EmergencyContacts;
