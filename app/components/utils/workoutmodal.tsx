"use client";

import React, { useState } from "react";
import Modal from "react-modal";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onFinish: (data: Record<string, string>) => void;
  days: string[];
  goals: string[];
  duration: string;
  exercises: Record<string, string[]>;
};

const WorkoutModal = ({
  isOpen,
  onClose,
  onFinish,
  days,
  goals,
  duration,
  exercises,
}: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<Record<string, string>>({});

  const currentDay = days[currentIndex];

  // 🔥 get exercises based on goals
 const availableExercises = goals.flatMap((goal) =>
  (exercises[goal] || []).map((exercise) => ({
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

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      shouldCloseOnOverlayClick
      className="bg-[#0B0F14] text-white p-5 sm:p-6 rounded-xl w-[90%] max-w-md mx-auto outline-none"
      overlayClassName="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
    >
      <h2 className="text-lg font-bold text-center mb-2">
        Assign Workout
      </h2>

      <p className="text-center text-sm text-gray-400 mb-4">
        {currentDay} • {duration}
      </p>

      {/* EXERCISE LIST */}
      <div className="grid grid-cols-2 gap-2 max-h-62.5 overflow-y-auto">
      {availableExercises.map((ex, i) => (
  <button
    key={i}
    onClick={() => handleSelect(ex)}
    className={`p-2 rounded text-sm ${
      selected[currentDay] === ex.name
        ? "bg-[#2ED843] text-black"
        : "bg-gray-800"
    }`}
  >
    <p>{ex.name}</p>
    <p className="text-[10px] ">{ex.goal}</p>
  </button>
))}
      </div>

      {/* CONTROLS */}
      <div className="flex justify-between mt-6">
        <button onClick={onClose} className="text-sm">
          Cancel
        </button>

        <button
          onClick={handleNext}
          disabled={!selected[currentDay]}
          className="bg-[#2ED843] text-black px-4 py-2 rounded text-sm disabled:opacity-40"
        >
          {currentIndex === days.length - 1 ? "Finish" : "Next"}
        </button>
      </div>
    </Modal>
  );
};

export default WorkoutModal;