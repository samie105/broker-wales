"use client";
import React, { useState, useEffect } from "react";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";

export default function VerificationPage({ formDatas }) {
  const [countdown, setCountdown] = useState(120); // 2 minutes in seconds
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  useEffect(() => {
    if (isResendDisabled && countdown > 0) {
      const timerId = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      return () => clearInterval(timerId); // Cleanup on unmount
    }

    if (countdown === 0) {
      setIsResendDisabled(false);
    }
  }, [isResendDisabled, countdown]);

  const handleResendCode = () => {
    // Handle resend code logic here
    // Reset the countdown and disable the button again
    setCountdown(120);
    setIsResendDisabled(true);
  };

  const handleVerifyCode = () => {
    // Handle code verification here
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  return (
    <>
      <div className="message text-sm mb-8 text-gray-900">
        We sent a 6 digit verification code to{" "}
        <strong className="font-bold">{formDatas.email}</strong>. Please check
        your mailbox or check your provided email address for mistakes or errors
      </div>
      <div>
        <Label
          htmlFor="verificationCode"
          className="block text- font-bold text-sm mb-2"
        >
          Enter Verification Code
        </Label>
        <Input
          type="text"
          id="verificationCode"
          placeholder="Enter the code sent to your email"
          className="w-full px-4 py-4 bg-gray-200 -white text-sm rounded-lg border-none"
        />
        <Button
          type="button"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-4 px-4 rounded-lg mt-4"
          onClick={handleVerifyCode}
        >
          Verify
        </Button>
        <Button
          type="button"
          className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg mt-2"
          onClick={handleResendCode}
          disabled={isResendDisabled}
        >
          {isResendDisabled
            ? `Resend Code (${formatTime(countdown)})`
            : "Resend Code"}
        </Button>
      </div>
    </>
  );
}
