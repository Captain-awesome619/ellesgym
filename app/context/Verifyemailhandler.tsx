"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { accountt } from "../lib/appwrite"; // adjust path

export default function VerifyEmailHandler() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const userId = searchParams.get("userId");
    const secret = searchParams.get("secret");

    const verifyEmail = async () => {
      if (!userId || !secret) return;

      try {
        await accountt.updateVerification(userId, secret);

        alert("Email verified successfully ✅");
      } catch (error) {
        console.log("Verification failed:", error);
      }
    };

    verifyEmail();
  }, [searchParams]);

  return null;
}