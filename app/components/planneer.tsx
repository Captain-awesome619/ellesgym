"use client";

import React, { useState, useEffect } from "react";
import WorkoutAssignModal from "./utils/workoutmodal";
import Modal from "react-modal";
import { FaPlus, FaCheck } from "react-icons/fa";
import { IoBedOutline } from "react-icons/io5";
import { GiMuscleUp } from "react-icons/gi";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const USER_DAYS = ["Monday", "Wednesday", "Friday", "Sunday"];
const USER_GOALS = ["Strength", "Endurance"];
const USER_DURATION = "45 min";

const EXERCISES: Record<string, string[]> = {
  Strength: ["Bench Press", "Deadlift", "Squats"],
  Endurance: ["Running", "Cycling", "Jump Rope"],
  "Muscle Gain": ["Pull-ups", "Leg Press", "Chest Fly"],
  "Weight Loss": ["HIIT", "Burpees", "Mountain Climbers"],
  Flexibility: ["Yoga", "Stretching", "Pilates"],
  "General Fitness": ["Push-ups", "Sit-ups", "Plank"],
};

type DayPlan = {
  day: string;
  date: string;
  type: "workout" | "rest";
  workout?: string;
  goal?: string;
  duration?: string;
  completed?: boolean;
};

const getNextDays = (numDays = 28) => {
  const today = new Date();
  const start = new Date(today);

  return Array.from({ length: numDays }).map((_, i) => {
    const date = new Date(start);
    date.setDate(start.getDate() + i);

    return {
      date,
      day: DAYS[date.getDay()],
    };
  });
};

const Planneer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [plan, setPlan] = useState<DayPlan[] | null>(null);

  useEffect(() => {
    Modal.setAppElement("body");
  }, []);

  const findGoalByWorkout = (workoutName: string | undefined) => {
    if (!workoutName) return undefined;
    const found = Object.entries(EXERCISES).find(([, workouts]) =>
      workouts.includes(workoutName)
    );
    return found?.[0];
  };

  const handleAssign = (selectedWorkouts: Record<string, string>) => {
    const calendar = getNextDays(28);

    const generated: DayPlan[] = calendar.map(({ date, day }) => {
      const workout = selectedWorkouts[day];

      if (!USER_DAYS.includes(day) || !workout) {
        return {
          day,
          date: date.toDateString(),
          type: "rest",
        };
      }

      return {
        day,
        date: date.toDateString(),
        type: "workout",
        workout,
        goal: findGoalByWorkout(workout),
        duration: USER_DURATION,
        completed: false,
      };
    });

    setPlan(generated);
    setIsOpen(false);
  };

  const chunkIntoWeeks = (arr: DayPlan[], size = 7) => {
    const weeks = [];
    for (let i = 0; i < arr.length; i += size) {
      weeks.push(arr.slice(i, i + size));
    }
    return weeks;
  };

  const getMonthLabel = () => {
    if (!plan || plan.length === 0) return "";

    const firstDate = new Date(plan[0].date);

    return firstDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    }).toUpperCase();
  };

  return (
    <div className="p-4 sm:p-6  min-h-screen">
      {!plan ? (
        <div className="flex items-center justify-center h-[70vh]">
          <div className="h-36 w-32 sm:h-40 sm:w-36 rounded-xl bg-linear-to-b from-[#2a2a2a] via-[#1a1a1a] to-black flex items-center justify-center">
            <button
              onClick={() => setIsOpen(true)}
              className="border-2 border-dotted border-gray-500 p-4 w-[90%] h-[90%] rounded-lg flex flex-col items-center justify-end cursor-pointer"
            >
              <FaPlus className="text-white mb-2" />
              <p className="text-white text-sm">Add Workout</p>
            </button>
          </div>
        </div>
      ) : (
        <div>
          {/* MONTH HEADER */}
          <div className="mb-4 text-white text-2xl font-bold tracking-wide">
            {getMonthLabel()}
          </div>

          {chunkIntoWeeks(plan).map((week, weekIndex) => (
            <div key={weekIndex} className="mb-6 grid">

              {/* WEEK HEADER (RESPONSIVE 4 / 7) */}
              <div className=" hidden lg:grid grid-cols-7 border-t border-b border-gray-800 py-4">
                {week.map((item, i) => {
                  const weekday = new Date(item.date).toLocaleDateString("en-US", {
                    weekday: "short",
                  });

                  return (
                    <p
                      key={i}
                      className=" text-white text-[25px] font-bold "
                    >
                      {weekday.toUpperCase()}
                    </p>
                  );
                })}
              </div>

              {/* WEEK GRID (RESPONSIVE 4 / 7) */}
              <div className="grid grid-cols-3 sm:grid-cols-7 gap-2 mt-2">
                <>


                
              {week.map((item, i) => {
  const fullDayName = new Date(item.date).toLocaleDateString("en-US", {
    weekday: "long",
  });

  return (
    <div key={i} className=" grid">
      <p className="text-[13px] mb-1 font-bold text-[#2ED843] lg:hidden flex">
        {fullDayName}
      </p>

      <div className="bg-linear-to-b from-[#2a2a2a] via-[#1a1a1a] to-black rounded-xl p-2 text-white min-h-28">
        <p className="text-[10px] text-gray-400 mb-1">
          {item.date}
        </p>

        {item.type === "rest" ? (
          <div>
            <IoBedOutline className="text-gray-400 mb-1" />
            <p className="text-xs">Rest Day</p>
          </div>
        ) : (
          <div className="flex flex-col gap-1 h-full">
            <GiMuscleUp />

            <p className="text-xs font-semibold">{item.workout}</p>

            <p className="text-[10px] text-gray-400">
              {item.duration}
            </p>
          </div>
        )}
      </div>
    </div>
  );
})}

</>
              </div>

            </div>
          ))}
        </div>
      )}

      <WorkoutAssignModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onFinish={handleAssign}
        days={USER_DAYS}
        goals={USER_GOALS}
        duration={USER_DURATION}
        exercises={EXERCISES}
      />
    </div>
  );
};

export default Planneer;