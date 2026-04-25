"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { databases } from "../lib/appwrite";
import { appwriteConfig } from "../lib/appwrite";
import { Query, ID } from "appwrite";
import ClipLoader from "react-spinners/ClipLoader";
import { useGlobalContext } from "../context/globalprovider";

export default function OAuthPage() {
  const router = useRouter();
  const { user, refreshUser, loading } = useGlobalContext();

  const ran = useRef(false);

  // -----------------------------
  // 1. CREATE OR SYNC USER PROFILE
  // -----------------------------
  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const syncUserProfile = async () => {
      try {
        // ⛔ wait for auth hydration
        const authUser = user?.$id ? user : null;

        // fallback: ensure we always have session user
        const sessionUser = authUser || (await refreshUser());

        if (!sessionUser?.$id) return;

        // check if profile exists
        try {
          await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            sessionUser.$id
          );

          console.log("User already exists");

          await refreshUser(); // sync global state
          return;
        } catch {
          // not found → create profile
        }

        await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.userCollectionId,
          sessionUser.$id,
          {
            accountid: ID.unique(),
            fullname: sessionUser.name,
            email: sessionUser.email,
          }
        );

        console.log("User profile created");

        await refreshUser(); // sync after creation
      } catch (err) {
        console.error("Profile sync error:", err);
      }
    };

    syncUserProfile();
  }, []);

  // -----------------------------
  // 2. HANDLE REDIRECT LOGIC
  // -----------------------------
  useEffect(() => {
    const run = async () => {
      // ⛔ wait until auth is ready
      if (loading) return;

      // ⛔ still no user → stay on loader
      if (!user?.$id) return;

      try {
        const res = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.bioID,
          [Query.equal("users", user.$id)]
        );

        const hasBio = res.documents.length > 0;

        if (hasBio) {
          router.replace("/Dashboard");
        } else {
          router.replace("/success");
        }
      } catch (error) {
        console.error("OAuth redirect error:", error);
        router.replace("/success");
      }
    };

    run();
  }, [user, loading, router]);

  // -----------------------------
  // 3. UI LOADING STATE
  // -----------------------------
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-4 text-white">
        <ClipLoader size={40} color="#2ED843" />
        <p className="text-lg">Signing you in...</p>
      </div>
    </div>
  );
}