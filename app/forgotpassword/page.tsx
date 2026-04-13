"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { accountt } from "../lib/appwrite";// adjust path
import { ClipLoader } from "react-spinners";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || !secret) {
      setError("Invalid or expired reset link.");
    }
  }, [userId, secret]);

  const handleReset = async () => {
    setError(null);

    if (!password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await accountt.updateRecovery({
        userId: userId!,
        secret: secret!,
        password,
      });
alert("Password reset successful. Please log in with your new password.");
      router.push("/");
    } catch (err: any) {
      setError(err?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
    className="h-screen w-screen flex flex-col justify-center items-center  "
       style={{
    backgroundImage: "url('forgot.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "top",
    backgroundRepeat: "no-repeat",
  }}
    >
      <div className="lg:w-full w-[95%] max-w-md bg-[#121417F2] backdrop-blur-md rounded-2xl shadow-lg p-6">
        
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Reset Password
        </h1>

        <div className="flex flex-col gap-3">
          <h3>New Password </h3>
          <input
            type="text"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 p-3 text-black bg-white rounded-lg focus:outline-none"
          />
  <h3>Confirm Password </h3>
          <input
            type="text"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-gray-300 text-black bg-white p-3 rounded-lg focus:outline-none"
          />

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
<div className="flex items-center justify-center w-full pt-2  ">
          <button
            onClick={handleReset}
            disabled={loading}
            className="py-3 px-3 items-center  cursor-pointer rounded-lg  text-black"
            style={{ backgroundColor: "#2ED843" }}
          >
            {loading ? <ClipLoader size={20} color='black' /> : "Reset Password"}
          </button>
          </div>
        </div>
      </div>

      {/* white decorative element */}
      <div className="absolute top-10 right-10 w-24 h-24 bg-white opacity-10 rounded-full" />
    </div>
  );
}