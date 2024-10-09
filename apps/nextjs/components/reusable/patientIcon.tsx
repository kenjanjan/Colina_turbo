"use client";
import { fetchPatientProfileImage } from "@/app/api/patients-api/patientProfileImage.api";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const PatientIcon = ({ patientId, className, width, height }: any) => {
  const router = useRouter();
  const [patientImage, setPatientImage] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const imgResponse = await fetchPatientProfileImage(patientId, router);

        if (!imgResponse.data || imgResponse.data.length === 0) {
          setPatientImage("");
        } else {
          const buffer = Buffer.from(imgResponse.data);
          const dataUrl = `data:image/jpeg;base64,${buffer.toString("base64")}`;
          setPatientImage(dataUrl);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [patientId]);

  return (
    <>
      {patientImage ? (
        <Image
          className={cn(
            "max-h-[50px] min-h-[50px] min-w-[50px] max-w-[50px] rounded-full object-cover",
            className,
          )}
          width={width || 50}
          height={height || 50}
          src={patientImage}
          alt="profile"
        />
      ) : (
        <Image
          className={cn(
            "max-h-[50px] min-h-[50px] min-w-[50px] max-w-[50px] rounded-full object-cover",
            className,
          )}
          width={width || 50}
          height={height || 50}
          src={isLoading ? "/imgs/loading.gif" : "/imgs/user-no-icon.svg"}
          alt="profile"
        />
      )}
    </>
  );
};

export default PatientIcon;
