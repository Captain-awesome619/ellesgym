"use client";

import React, { useState } from "react";
import Modal from "react-modal";
import { FaArrowLeft } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import { appwriteConfig, databases } from "@/app/lib/appwrite";
import { useGlobalContext } from "@/app/context/globalprovider";
import { ID } from "appwrite";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onFinish: (data: Record<string, string>) => void;
  days: string[];
  goals: string[];
  duration: string;
  exercises: Record<string, string[]>;
  onsucess: () => void;
};

const WorkoutModal = ({
  isOpen,
  onClose,
  onFinish,
  days,
  duration,
  exercises,
  onsucess
}: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [loading, setLoader] = useState(false);
  const { user } = useGlobalContext();

  const currentDay = days?.[currentIndex];

  const availableExercises = Object.entries(exercises || {}).flatMap(
    ([goal, list]) =>
      (list || []).map((exercise) => ({
        name: exercise,
        goal,
      }))
  );

  const handleSelect = (exercise: { name: string; goal: string }) => {
    setSelected((prev) => ({
      ...prev,
      [currentDay]: exercise.name,
    }));
  };

  const handleNext = () => {
    if (!selected[currentDay]) return;

    if (currentIndex < days.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onFinish(selected);
      setCurrentIndex(0);
      setSelected({});
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

async function submitsession() {
  setLoader(true);

  try {
    if (
      !user ||
      !user.$id ||
      !days?.length ||
      Object.keys(selected).length !== days.length
    ) {
      alert("Please complete all workout selections before submitting.");
      return;
    }

    const sessionData = Object.entries(selected).map(
      ([day, exercise]) =>
        JSON.stringify({
          day,
          exercise,
        })
    );

    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.workoutplanID,
      user.$id,
      {
        users: user.$id,
        session: sessionData,
      }
    );

    console.log("Workout plan saved successfully");

    alert("Workout plan created successfully!");

    // 🔥 refresh / re-fetch data FIRST
    if (onsucess) {
      await onsucess();
    }

    // then reset UI
    setSelected({});
    setCurrentIndex(0);
    onClose();

  } catch (error) {
    console.error("Error saving workout:", error);
    alert("Something went wrong while saving your data");
  } finally {
    setLoader(false);
  }
}
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      shouldCloseOnOverlayClick
      className="bg-black text-white p-5 sm:p-6 rounded-xl w-full lg:max-w-[40%] max-w-[90%] mx-auto outline-none"
      overlayClassName="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
    >
      <div className="flex flex-col relative">
        {currentIndex > 0 && (
          <button
            onClick={handleBack}
            className="absolute left-0 top-0 text-[#2ED843] text-sm p-2 cursor-pointer"
          >
            <FaArrowLeft />
          </button>
        )}

        <h2 className="text-lg font-bold text-center mb-2">
          Assign Workout for
        </h2>

        <p className="text-center text-sm text-[#2ED843] mb-2 font-bold">
          {currentDay}
        </p>

        <p className="text-center font-bold text-sm text-white mb-4">
          duration: {duration} min
        </p>
      </div>

      {/* EXERCISES */}
      <div className="grid grid-cols-2 gap-2 max-h-62.5 overflow-y-auto">
        {availableExercises?.map((ex, i) => (
          <button
            key={i}
            onClick={() => handleSelect(ex)}
            className={`p-2 rounded text-sm cursor-pointer ${
              selected[currentDay] === ex.name
                ? "bg-[#2ED843] text-black"
                : "bg-[#0B0F14]"
            }`}
          >
            <p className="font-bold">{ex.name}</p>
            <p className="text-[13px]">{ex.goal}</p>
          </button>
        ))}
      </div>

      {/* CONTROLS */}
      <div className="flex justify-between mt-6 cursor-pointer">
        <button onClick={onClose} className="text-sm cursor-pointer">
          Cancel
        </button>

        <button
          onClick={
            currentIndex === days?.length - 1
              ? submitsession
              : handleNext
          }
          disabled={!selected[currentDay] || loading}
          className="bg-[#2ED843] text-black px-4 py-2 rounded text-sm disabled:opacity-40 flex items-center justify-center min-w-20 cursor-pointer"
        >
          {loading ? (
            <ClipLoader size={18} color="#2ED843" />
          ) : currentIndex === days?.length - 1 ? (
            "Finish"
          ) : (
            "Next"
          )}
        </button>
      </div>
    </Modal>
  );
};

export default WorkoutModal;