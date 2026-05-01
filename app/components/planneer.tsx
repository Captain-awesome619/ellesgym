"use client";
import React, { useState, useEffect } from "react";
import WorkoutAssignModal from "./utils/workoutmodal";
import Modal from "react-modal";
import { FaPlus, FaCheck } from "react-icons/fa";
import { IoBedOutline } from "react-icons/io5";
import { GiMuscleUp } from "react-icons/gi";
import { getBio } from "../lib/appwrite";
import {
  GiStrongMan,
  GiHeartBeats,
  GiWeightLiftingUp,
  GiMeditation,
  GiRunningShoe,
} from "react-icons/gi";

const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

const EXERCISES: Record<string, string[]> = {
  strength: ["Bench Press", "Deadlift", "Squats"],
  endurance: ["Running", "Cycling", "Jump Rope"],
  "muscle-gain": ["Pull-ups", "Leg Press", "Chest Fly"],
  "weight-loss": ["HIIT", "Burpees", "Mountain Climbers"],
  flexibility: ["Yoga", "Stretching", "Pilates"],
  "general-fitness": ["Push-ups", "Sit-ups", "Plank"],
};

const GOAL_ICONS: Record<string, any> = {
  strength: GiStrongMan,
  endurance: GiRunningShoe,
  "muscle-gain": GiMuscleUp,
  "weight-loss": GiHeartBeats,
  flexibility: GiMeditation,
  "general-fitness": GiWeightLiftingUp,
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
  return Array.from({ length: numDays }).map((_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return {
      date,
      day: DAYS[date.getDay()],
    };
  });
};

const Planneer = ({ user }: { user: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [plan, setPlan] = useState<DayPlan[] | null>(null);
  const [data, setdata] = useState<any>(null);

  // 🔥 NEW: selected day for modal
  const [selectedDay, setSelectedDay] = useState<DayPlan | null>(null);

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

      if (!data?.schedule?.includes(day) || !workout) {
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
        duration: data?.duration,
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
    if (!plan?.length) return "";
    return new Date(plan[0].date)
      .toLocaleDateString("en-US", { month: "long", year: "numeric" })
      .toUpperCase();
  };

  useEffect(() => {
    if (!user?.$id) return;

    const fetchPosts = async () => {
      try {
        const posts = await getBio(user.$id);
        setdata(posts);
      } catch (error) {
        console.log("Fetching user bio failed:", error);
      }
    };

    fetchPosts();
  }, [user?.$id]);

  const filteredExercises = Object.fromEntries(
    (data?.goal || [])
      .map((g: string) => g?.toLowerCase())
      .filter((goal: string) => EXERCISES[goal])
      .map((goal: string) => [goal, EXERCISES[goal]])
  );

  return (
    <div className="p-4 sm:p-6 min-h-screen">

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
          <div className="mb-4 lg:text-[#2ED843] text-white text-2xl font-bold">
            {getMonthLabel()}
          </div>

          {chunkIntoWeeks(plan).map((week, weekIndex) => (
            <div key={weekIndex} className="mb-6 grid">

              <div className="hidden lg:grid grid-cols-7 border-t border-b border-gray-800 py-4">
                {week.map((item, i) => (
                  <p key={i} className="text-white text-[25px] font-bold">
                    {new Date(item.date).toLocaleDateString("en-US", { weekday: "short" }).toUpperCase()}
                  </p>
                ))}
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-7 gap-2 mt-2 border-b lg:border-0 lg:pb-2 pb-4 ">
                {week.map((item, i) => (
                  <div key={i} className="grid">
<p key={i} className="text-[#2ED843] text-[12px] font-bold  lg:hidden flex mb-1">
                    {new Date(item.date).toLocaleDateString("en-US", { weekday: "long" }).toUpperCase()}
                  </p>
                    <div
                      onClick={() => setSelectedDay(item)} // 🔥 CLICK HANDLER
                      className=" grid gap-2 bg-linear-to-b from-[#2a2a2a] via-[#1a1a1a] to-black rounded-xl p-2 text-white min-h-28 cursor-pointer hover:scale-[1.02] transition"
                    >
                      <p className="text-[12px] mb-1">{item.date}</p>

                      {item.type === "rest" ? (
                        <div className="grid gap-1">
                          <IoBedOutline className="text-[#2ED843]" />
                          <p className="text-xs">Rest Day</p>
                        </div>
                      ) : (
                        <div className="grid gap-1">
                          {(() => {
                            const Icon =
                              GOAL_ICONS[item.goal as keyof typeof GOAL_ICONS] || GiMuscleUp;
                            return <Icon className="text-[#2ED843]" />;
                          })()}
                          <p className="text-xs font-semibold">{item.workout}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🔥 DETAIL MODAL */}
      <Modal
        isOpen={!!selectedDay}
        onRequestClose={() => setSelectedDay(null)}
        className="bg-[#0B0F14] text-white p-6 rounded-xl w-[90%] max-w-md mx-auto outline-none"
        overlayClassName="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      >
        {selectedDay && (
          <div className="flex flex-col gap-4">

           

            <p  className="text-xl font-bold text-center text-[#2ED843]">
              {selectedDay.date}
            </p>

            {selectedDay.type === "rest" ? (
              <div className="text-center">
                <IoBedOutline className="text-[#2ED843] text-3xl mx-auto mb-2" />
                <p>Rest Day</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">

                {(() => {
                  const Icon =
                    GOAL_ICONS[selectedDay.goal as keyof typeof GOAL_ICONS] || GiMuscleUp;
                  return <Icon className="text-[#2ED843] text-3xl" />;
                })()}

                <p className="text-lg font-semibold">
                  {selectedDay.workout}
                </p>

                <p className="text-sm text-white font-bold">
                  Goal: {selectedDay.goal}
                </p>

                <p className="text-sm">
                  Duration: {selectedDay.duration} min
                </p>

                {/* STATUS */}
                <div className="mt-2 flex items-center justify-center gap-2">
<p className="text-white font-bold text-[15px]">Status : </p>
                  {selectedDay.completed ? (
                    <p className="text-green-400 flex items-center gap-1">
                      <FaCheck /> Completed
                    </p>
                  ) : (
                    <p className="text-amber-400">
                      Not Completed
                    </p>
                  )}
                </div>

              </div>
            )}
<div className="flex items-center justify-center w-full">
            <button
              onClick={() => setSelectedDay(null)}
              className="mt-4 bg-[#2ED843] text-black py-2 rounded-xl w-[50%] cursor-pointer"
            >
              Close
            </button>
</div>
          </div>
        )}
      </Modal>

      <WorkoutAssignModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onFinish={handleAssign}
        days={data?.schedule}
        goals={data?.goals}
        duration={data?.duration}
        exercises={filteredExercises}
      />
    </div>
  );
};

export default Planneer;