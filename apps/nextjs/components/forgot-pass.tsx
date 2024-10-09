import { generateOTPCode } from "@/app/api/forgot-pass-api/otp-code";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
interface ForgotPassProps {
  isForgotPassword: boolean;
  setIsForgotPassword: (value: boolean) => void;
  isInvalid: boolean;
  forgotPassEmail: string;
  setForgotPassEmail: (value: string) => void;
  isEmailFocused: boolean;
  handleEmailFocus: () => void;
  handleEmailBlur: () => void;
  isOTP: boolean;
  setIsOTP: (value: boolean) => void;
}
const ForgotPass = ({
  isForgotPassword,
  setIsForgotPassword,
  isInvalid,
  forgotPassEmail,
  setForgotPassEmail,
  isEmailFocused,
  handleEmailFocus,
  handleEmailBlur,
  isOTP,
  setIsOTP,
}: ForgotPassProps) => {
  const [isSent, setIsSent] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSent(true);

    try {
      if (forgotPassEmail !== "") {
        const response = await generateOTPCode(forgotPassEmail, "forgotPass");

        if (response) {
          setIsError(false);
          setIsSent(false);
          setIsOTP(!isOTP);
          setIsForgotPassword(!isForgotPassword);
          console.log("Email Sent Successfully.");
          // onSuccess();
          // setToastMessage("Email Sent Successfully.");
          // setShowToast(true);
        }
      }
    } catch (error: any) {
      if (error.message === "User not found.") {
        setIsError(true);
      }
    }
    setIsSent(false);
  };

  return (
    <div
      className={`fixed flex h-full flex-col items-center justify-center px-8 transition duration-500 sm:w-full md:w-[825.24px] md:px-0 lg:w-[1091px] ${
        isForgotPassword
          ? "z-50 opacity-100"
          : isOTP
            ? "-z-10 -translate-x-[1000px] opacity-0"
            : "-z-10 translate-x-[1000px] opacity-0"
      }`}
    >
      <h1 className="mb-3 font-medium text-white md:mb-0 md:text-2xl md:text-[20px] md:text-[#020817] lg:mb-3">
        Forgot Password?
      </h1>
      <p className="mb-5 text-white md:text-[#020817]">
        Enter your email below to receive your password reset instructions.
      </p>
      <div className="relative mb-4 flex w-full flex-col md:max-w-[642.27px]">
        <form
          action=""
          onSubmit={(e) => {
            handleSubmit(e);
          }}
        >
          <div className="flex h-full w-full flex-col gap-5">
            <input
              id="email"
              type="email"
              className={`${isError ? "ring-1 ring-[#db3956]" : ""} text-md h-[60px] w-full bg-[#D9D9D94D] px-3 py-6 pb-2 pl-5 text-white focus:bg-opacity-10 md:bg-[#FAFAFA] md:text-[#020817]`}
              value={forgotPassEmail}
              onFocus={handleEmailFocus}
              onBlur={handleEmailBlur}
              onChange={(e) => setForgotPassEmail(e.target.value)}
              required
            />
            <label
              htmlFor="email"
              className={`absolute left-5 cursor-text select-none text-white transition-all duration-300 ${
                isEmailFocused || forgotPassEmail
                  ? "top-2 text-[12px] md:text-[#64748b]"
                  : "top-5 text-[15px]"
              } ${isError ? "md:text-[#64748b]" : "md:text-[#64748b]"}`}
            >
              {isError ? "Email" : "Email"}
            </label>
            <p className={`${isError ? "block" : "hidden"} error mt-2`}>
              User email not found. Please try again.
            </p>

            <button
              disabled={isSent}
              className={` ${isSent ? "cursor-not-allowed" : "cursor-pointer"} inline-block h-[60px] w-full max-w-[642.27px] items-center bg-[#007C85] px-6 text-center text-[15px] font-normal text-white transition duration-300 ease-in-out hover:bg-[#0E646A]`}
              type="submit"
            >
              {isSent ? (
                <div className="flex w-full items-center justify-center">
                  <Loader2 size={20} className="animate-spin" /> &nbsp;
                  Sending...
                </div>
              ) : (
                "Send"
              )}
            </button>
          </div>
        </form>
      </div>
      <p
        className="absolute bottom-28 cursor-pointer text-white md:text-[#020817]"
        onClick={() => setIsForgotPassword(!isForgotPassword)}
      >
        Back to login
      </p>
    </div>
  );
};

export default ForgotPass;
