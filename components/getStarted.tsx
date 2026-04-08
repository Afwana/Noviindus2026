"use client";

import { useState } from "react";
import OtpLogin from "./OtpLogin";
import flag from "../public/images/flag.png";
import Image from "next/image";
import { useAppDispatch } from "@/store/hooks";
import { sendOtpThunk } from "@/features/auth/auth-slice";

export default function GetStarted() {
  const dispatch = useAppDispatch();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGetStart = async () => {
    if (phoneNumber === "") {
      alert("Please provide a phone number");
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      alert("Invalid mobile number, please provide valid one");
      return;
    }

    setLoading(true);
    try {
      const mobile = `+91${phoneNumber}`;
      const response = await dispatch(sendOtpThunk({ mobile })).unwrap();

      if (response.success) {
        setStarted(true);
      } else {
        alert(response.message || "Failed to send OTP");
      }
    } catch (error) {
      alert((error as string) || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!started ? (
        <div className="flex flex-col justify-between h-full p-7">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3 text-[#1C3141]">
              <h2 className="text-2xl font-semibold">
                Enter your phone number
              </h2>
              <p className="text-base">
                We use your mobile number to identify your account
              </p>
            </div>
            <div className="relative w-full">
              <div className="flex items-center h-16 w-full border border-[#CECECE] rounded-xl px-4 gap-3 bg-white">
                <label
                  htmlFor="phoneNumber"
                  className="absolute -top-2 left-4 bg-white px-1 text-xs text-[#8A8A8A]"
                >
                  Phone number
                </label>
                <Image
                  src={flag}
                  width={18}
                  height={19}
                  objectFit="contain"
                  alt="flag"
                />
                <span className="text-gray-700 text-sm font-medium">+91</span>

                <input
                  id="phoneNumber"
                  type="text"
                  placeholder="1234 567891"
                  className="flex-1 outline-none text-[#1C3141] placeholder-gray-400 text-base"
                  value={phoneNumber}
                  onChange={(e) =>
                    setPhoneNumber(e.target.value.replace(/\s+/g, ""))
                  }
                />
              </div>
            </div>
            <p className="text-xs">
              <span>By tapping Get started, you agree to the</span>{" "}
              <span className="font-medium">Terms & Conditions</span>
            </p>
          </div>
          <div>
            <button
              type="button"
              disabled={loading}
              onClick={() => handleGetStart()}
              className="btn rounded-[10px] h-[45px] w-full bg-[#1C3141] text-white text-base cursor-pointer"
            >
              {loading ? "Send OTP..." : "Get started"}
            </button>
          </div>
        </div>
      ) : (
        <OtpLogin phoneNumber={`+91${phoneNumber}`} />
      )}
    </>
  );
}
