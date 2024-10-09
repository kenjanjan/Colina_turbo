"use client";
import {
  generateOTPCode,
  verifyOTPCode,
} from "@/app/api/forgot-pass-api/otp-code";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

interface OTPCodeProps {
  isOTP: boolean;
  setIsOTP: (value: boolean) => void;
  forgotPassEmail: string;
  setIsResetPass: (value: boolean) => void;
  isResetPass: boolean;
  variant: string;
  rememberMe: boolean;
}

const OTPCode = ({
  isOTP,
  setIsOTP,
  forgotPassEmail,
  setIsResetPass,
  isResetPass,
  variant,
  rememberMe,
}: OTPCodeProps) => {
  const router = useRouter();
  const [otp, setOTP] = useState(new Array(6).fill(""));
  const inputs = useRef<HTMLInputElement[]>([]);
  const [isVerify, setIsVerify] = useState(false);
  const [currentInputIndex, setCurrentInputIndex] = useState(0);
  const [isNewCode, setIsNewCode] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(60);
  const [isError, setIsError] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);

  const handleOTPChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const { value } = e.target;
    if (value.length > 0 && /\d/.test(value)) {
      const newOTP = [...otp];
      newOTP[index] = value;
      setOTP(newOTP);
      for (let i = 0; i < index; i++) {
        if (inputs.current[i].value === "") {
          setCurrentInputIndex(i);
          inputs.current[i].focus();
          return;
        }
      }
      // If all previous inputs are not empty, find the first empty input
      const nextInputIndex = inputs.current.findIndex(
        (input) => input.value === "",
      );
      if (nextInputIndex !== -1) {
        setCurrentInputIndex(nextInputIndex);
        inputs.current[nextInputIndex].focus();
      }
    }
  };

  useEffect(() => {
    if (!otp.includes("")) {
      handleSubmit();
    }
  }, [otp]);

  console.log(otp);

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace") {
      const newOTP = [...otp];
      if (newOTP[index] === "") {
        // If the current input is empty, delete the previous input
        if (index > 0) {
          newOTP[index - 1] = "";
          setCurrentInputIndex(index - 1);
          inputs.current[index - 1].focus();
        }
      } else {
        // If the current input is not empty, delete the current input
        newOTP[index] = "";
        setIsError(false);
        if (index > 0 && otp[index - 1] !== "") {
          inputs.current[index - 1].focus();
          setCurrentInputIndex(index - 1);
        }
      }
      setOTP(newOTP);
    }
  };

  const handleClick = (
    e: React.MouseEvent<HTMLInputElement>,
    index: number,
  ) => {
    const { value } = e.target as HTMLInputElement;
    if (value.length > 0) {
      // Find the next empty input field
      let nextInputIndex = index + 1;
      while (
        nextInputIndex < inputs.current.length &&
        inputs.current[nextInputIndex].value !== ""
      ) {
        nextInputIndex++;
      }
      if (nextInputIndex < inputs.current.length) {
        setCurrentInputIndex(nextInputIndex);
        inputs.current[nextInputIndex].focus();
      }
    } else {
      // If the input field is empty, focus on it
      setCurrentInputIndex(index);
      inputs.current[index].focus();
    }
  };

  console.log(variant, "var");
  const handleSubmit = async () => {
    setIsVerify(true);
    try {
      console.log(otp.join(""));
      if (otp.findLastIndex((digit) => digit === "") !== -1) {
        console.log("Please fill all the fields");
        return;
      } else {
        const response = await verifyOTPCode(
          otp.join(""),
          forgotPassEmail,
          variant,
          rememberMe,
        );
        if (response.isValid) {
          if (variant === "signIn") {
            router.push("/dashboard");
          } else if (variant === "forgotPass") {
            setIsResetPass(true);
            setIsOTP(false);
            setOTP(new Array(6).fill(""));
          }
        } else {
          setIsError(true);
        }
      }
    } catch (error) {
      console.error(error);
      // Display error message to the user
    } finally {
      setIsVerify(false);
    }
  };

  const handleSendNewCode = async (e: any) => {
    e.preventDefault();
    setIsSending(true);
    try {
      if (forgotPassEmail !== "") {
        const response = await generateOTPCode(forgotPassEmail, variant);
        setIsSending(false);
        setIsNewCode(true);
        setCountdown(60); // Reset countdown to 60 seconds
        const intervalId = setInterval(() => {
          setCountdown((prevCountdown) => prevCountdown - 1);
        }, 1000);

        // Clear interval after 1 minute (60 seconds)
        setTimeout(() => {
          clearInterval(intervalId);
          setIsNewCode(false);
        }, 60000);
        if (response) {
          console.log("Email Sent Successfully.");
        }
      }
    } catch (error: any) {
      // Handle error
    }
  };

  function maskEmail(email: string): string {
    const segments = email.split("@");
    const username = segments[0];
    const domain = segments[1];

    const maskedUsername =
      username.charAt(0) +
      "*".repeat(Math.max(0, username.length - 2)) +
      username.slice(-1);
    const maskedDomain =
      domain?.charAt(0) +
      "*".repeat(Math.max(0, domain?.length - 5)) +
      domain?.slice(-4);

    return maskedUsername + "@" + maskedDomain;
  }

  const maskedEmail = maskEmail(forgotPassEmail);

  return (
    <div
      className={`fixed flex h-full max-w-[400px] flex-col items-center justify-center px-[30px] transition duration-500 md:w-full md:px-0 lg:max-w-[560px] ${
        isOTP
          ? "z-50 opacity-100"
          : isResetPass
            ? "-translate-x-[1000px] opacity-0"
            : "z-50 translate-x-[1000px] opacity-0"
      }`}
    >
      <h1 className="mb-3 font-medium text-white md:mb-0 md:text-2xl md:text-[20px] md:text-[#020817] lg:mb-3">
        Enter your verification code!
      </h1>
      <p className="mb-5 text-center text-white md:px-0 md:text-[#020817]">
        We’ve sent the verification code to {maskedEmail}.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setIsVerify(true);
          handleSubmit();
        }}
        className="flex w-full flex-col items-center justify-center"
      >
        <div className="flex items-center justify-center gap-1 text-center md:gap-3">
          {otp.map((digit, index) => (
            <input
              className={`max-h-[57px] max-w-[50px] text-center text-[50px] font-medium caret-[#007C85] focus:outline-none md:max-h-[90px] md:max-w-[83px] ${
                otp[index] !== ""
                  ? "bg-[#007C85] text-white"
                  : "border border-[#007C85] bg-white md:bg-[#FAFAFA]"
              } ${isError ? "bg-[#db3956]" : ""} `}
              key={index}
              type="text"
              id={`otpInput${index + 1}`}
              maxLength={1}
              value={digit}
              ref={(ref: HTMLInputElement) => (inputs.current[index] = ref)}
              onChange={(e) => handleOTPChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onClick={(e) => handleClick(e, index)}
              tabIndex={-1}
            />
          ))}
        </div>

        <div className="flex w-full items-center justify-between">
          {isError && (
            <p className="w-full text-[#db3956]">
              Verification code not valid!
            </p>
          )}
          {isSending ? (
            <p className="my-2 w-full cursor-pointer text-end text-white md:text-[#020817]">
              Sending...
            </p>
          ) : isNewCode ? (
            <p className="my-2 w-full cursor-pointer text-end text-white md:text-[#020817]">
              Send a new code in: {countdown} seconds.
            </p>
          ) : (
            <p
              className="my-2 w-full cursor-pointer text-end text-white underline md:text-[#020817]"
              onClick={handleSendNewCode}
            >
              Send a new code
            </p>
          )}
        </div>

        <button
          disabled={isVerify}
          className={` ${isVerify ? "cursor-not-allowed" : "cursor-pointer"} inline-block h-[60px] w-full max-w-[400px] items-center bg-[#007C85] px-6 py-3 text-center text-[15px] font-medium text-white transition duration-300 ease-in-out hover:bg-[#0E646A] md:max-w-[565px]`}
          type="submit"
        >
          {isVerify ? (
            <div className="flex w-full items-center justify-center">
              <Loader2 size={20} className="animate-spin" /> &nbsp; Verifying...
            </div>
          ) : (
            "Verify"
          )}
        </button>
      </form>
      <p
        className="absolute bottom-28 cursor-pointer text-white md:text-[#020817]"
        onClick={() => {
          setIsOTP(!isOTP);
        }}
      >
        Back to login
      </p>
    </div>
  );
};

export default OTPCode;
