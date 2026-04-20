"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { databases } from "../lib/appwrite";
import { appwriteConfig } from "../lib/appwrite";
import { Query } from "appwrite";
import ClipLoader from "react-spinners/ClipLoader";
import { useGlobalContext } from "../context/globalprovider";

export default function OAuthPage() {
  const router = useRouter();
  const { user } = useGlobalContext();

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const run = async () => {
      try {
        // ⏳ If user is not ready, wait a bit then treat as new user
        if (!user?.$id) {
          timeout = setTimeout(() => {
            router.push("/success");
          }, 1500);
          return;
        }

        // 🔍 Check if bio exists
        const res = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.bioID,
          [Query.equal("users", user.$id)]
        );

        const hasBio = res.documents.length > 0;

        // 🚀 Redirect
        if (hasBio) {
          router.push("/Dashboard");
        } else {
          router.push("/success");
        }

      } catch (error) {
        console.error("OAuth error:", error);

        // fallback → treat as new user
        router.push("/success");
      }
    };

    run();

    // 🧹 cleanup timeout if component unmounts
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [user, router]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-4 text-white">
        <ClipLoader size={40} color="#2ED843" />
        <p className="text-lg">Signing you in...</p>
      </div>
    </div>
  );
}