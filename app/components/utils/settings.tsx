
import React, { useState } from "react";
import Modal from "react-modal";
import { FiLogOut, FiTarget } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import { IoChevronForward, IoClose } from "react-icons/io5";
import { accountt, databases, appwriteConfig } from "../../lib/appwrite";
import { Query } from "appwrite";
import { useRouter } from "next/navigation";

Modal.setAppElement("body");

const Settings = () => {
  const router = useRouter();

  const [logoutModal, setLogoutModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const settingsOptions = [
    {
      title: "Edit Goals",
      description: "Update your fitness and workout goals",
      icon: <FiTarget />,
      color: "text-[#2ED843]",
    },
    {
      title: "Log Out",
      description: "Sign out of your account securely",
      icon: <FiLogOut />,
      color: "text-white",
    },
    {
      title: "Delete Account",
      description: "Permanently remove your account and data",
      icon: <MdDeleteOutline />,
      color: "text-red-500",
    },
  ];

  // LOGOUT
  const handleLogout = async () => {
    try {
      setLoading(true);

      await accountt.deleteSession("current");

      router.push("/");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setLogoutModal(false);
    }
  };

  // DELETE ACCOUNT
  const handleDeleteAccount = async () => {
    try {
      setLoading(true);

      const user = await accountt.get();

      // EXAMPLE COLLECTION CLEANUPS
      // Delete user documents from collections where userId exists

      const collections = [
        appwriteConfig.habitID,
        appwriteConfig.workoutplanID,
        appwriteConfig.bioID,
        appwriteConfig.userCollectionId
      ];

      for (const collectionId of collections) {
        const response = await databases.listDocuments(
          appwriteConfig.databaseId,
          collectionId,
          [Query.equal("userId", user.$id)]
        );

        for (const document of response.documents) {
          await databases.deleteDocument(
            appwriteConfig.databaseId,
            collectionId,
            document.$id
          );
        }
      }

      // DELETE AUTH SESSION
      await accountt.deleteSession("current");

      // IMPORTANT
      // Client SDK CANNOT fully delete auth users.
      // You must use Appwrite Admin SDK / Function for actual auth deletion.

      router.push("/");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setDeleteModal(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6 w-full">
        {/* heading */}
        <div className="flex flex-col gap-2">
          <h2 className="text-white lg:text-[28px] text-[22px] font-semibold">
            Settings
          </h2>

          <p className="text-white/60 lg:text-[16px] text-[14px]">
            Manage your account preferences and actions
          </p>
        </div>

        {/* settings cards */}
        <div className="flex flex-col gap-4">
          {settingsOptions.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                if (item.title === "Log Out") {
                  setLogoutModal(true);
                }

                if (item.title === "Delete Account") {
                  setDeleteModal(true);
                }
              }}
              className="group flex items-center justify-between bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 cursor-pointer hover:border-[#2ED843]/40 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                {/* icon */}
                <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center text-[22px] border border-white/10">
                  <span className={item.color}>{item.icon}</span>
                </div>

                {/* text */}
                <div className="flex flex-col gap-1">
                  <h3 className="text-white font-semibold lg:text-[18px] text-[16px]">
                    {item.title}
                  </h3>

                  <p className="text-white/50 lg:text-[14px] text-[13px]">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* arrow */}
              <IoChevronForward className="text-white/40 text-[20px] group-hover:text-[#2ED843] transition-all duration-300" />
            </div>
          ))}
        </div>
      </div>

      {/* LOGOUT MODAL */}
      <Modal
        isOpen={logoutModal}
        onRequestClose={() => setLogoutModal(false)}
        className="bg-[#0B0B0B] border border-white/10 rounded-2xl p-6 max-w-md mx-auto mt-40 outline-none"
        overlayClassName="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-start z-50 px-4"
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-white text-[22px] font-semibold">
              Log Out
            </h2>

            <IoClose
              onClick={() => setLogoutModal(false)}
              className="text-white text-[24px] cursor-pointer"
            />
          </div>

          <p className="text-white/60 text-[15px] leading-relaxed">
            Are you sure you want to log out of your account?
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => setLogoutModal(false)}
              className="flex-1 h-12 rounded-xl bg-white/10 text-white font-semibold cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={handleLogout}
              className="flex-1 h-12 rounded-xl bg-[#2ED843] text-black font-semibold cursor-pointer"
            >
              {loading ? "Logging out" : "Log Out"}
            </button>
          </div>
        </div>
      </Modal>

      {/* DELETE ACCOUNT MODAL */}
      <Modal
        isOpen={deleteModal}
        onRequestClose={() => setDeleteModal(false)}
        className="bg-[#0B0B0B] border border-white/10 rounded-2xl p-6 max-w-md mx-auto mt-40 outline-none"
        overlayClassName="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-start z-50 px-4"
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-white text-[22px] font-semibold">
              Delete Account
            </h2>

            <IoClose
              onClick={() => setDeleteModal(false)}
              className="text-white text-[24px] cursor-pointer"
            />
          </div>

          <p className="text-white/60 text-[15px] leading-relaxed">
            This action is permanent and cannot be undone.
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => setDeleteModal(false)}
              className="flex-1 h-12 rounded-xl bg-white/10 text-white font-semibold cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={handleDeleteAccount}
              className="flex-1 h-12 rounded-xl bg-red-500 text-white font-semibold cursor-pointer"
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Settings;


