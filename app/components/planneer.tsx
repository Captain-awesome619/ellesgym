"use client";
import React, { useState, useEffect } from "react";

import {
  getBio,
  getSession,
  databases,
  appwriteConfig,
} from "../lib/appwrite";

import {
  GiStrongMan,
  GiHeartBeats,
  GiWeightLiftingUp,
  GiMeditation,
  GiRunningShoe,
  GiMuscleUp 
} from "react-icons/gi";
import { IoIosBed } from "react-icons/io";
import { ClipLoader } from "react-spinners";

const EXERCISES: Record<
  string,
  {
    routine: string;
    exercises: string[];
  }[]
> = {
  strength: [
    {
      routine: "Upper Body Strength",
      exercises: ["Push-ups", "Bench Press", "Pull-ups", "Shoulder Press", "Chest Fly"],
    },
    {
      routine: "Lower Body Strength",
      exercises: ["Squats", "Deadlift", "Leg Press", "Lunges", "Calf Raises"],
    },
    {
      routine: "Core Strength",
      exercises: ["Plank", "Russian Twists", "Hanging Leg Raises", "Cable Crunches"],
    },
  ],

  endurance: [
    {
      routine: "Cardio Endurance",
      exercises: ["Running", "Cycling", "Jump Rope", "Rowing", "Swimming"],
    },
    {
      routine: "Stamina Training",
      exercises: ["Burpees", "Battle Ropes", "Sprint Intervals", "Box Jumps"],
    },
  ],

  "muscle-gain": [
    {
      routine: "Upper Body Hypertrophy",
      exercises: ["Incline Bench Press", "Lat Pulldown", "Chest Fly", "Bicep Curls"],
    },
    {
      routine: "Lower Body Hypertrophy",
      exercises: ["Leg Press", "Romanian Deadlift", "Bulgarian Split Squats", "Hamstring Curl"],
    },
  ],

  "weight-loss": [
    {
      routine: "Fat Burning Cardio",
      exercises: ["HIIT", "Mountain Climbers", "Jump Rope", "Treadmill Sprints"],
    },
    {
      routine: "Full Body Burn",
      exercises: ["Burpees", "Kettlebell Swings", "Jump Squats", "Battle Ropes"],
    },
  ],

  flexibility: [
    {
      routine: "Mobility Training",
      exercises: ["Dynamic Stretching", "Hip Openers", "Shoulder Mobility", "Foam Rolling"],
    },
    {
      routine: "Mind & Body Flexibility",
      exercises: ["Yoga", "Pilates", "Static Stretching", "Breathing Exercises"],
    },
  ],

  "general-fitness": [
    {
      routine: "Bodyweight Basics",
      exercises: ["Push-ups", "Sit-ups", "Plank", "Air Squats"],
    },
    {
      routine: "Functional Fitness",
      exercises: ["Farmer Walks", "Step-ups", "Medicine Ball Slams", "Bear Crawls"],
    },
  ],
};

const GOAL_ICONS: Record<string, any> = {
  strength: GiStrongMan,
  endurance: GiRunningShoe,
  "muscle-gain": GiMuscleUp,
  "weight-loss": GiHeartBeats,
  flexibility: GiMeditation,
  "general-fitness": GiWeightLiftingUp,
};

const Planneer = ({ user }: { user: any }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [creatingPlan, setCreatingPlan] = useState(false);
  const [workoutPlan, setWorkoutPlan] = useState<any[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);

  // FETCH BIO
  useEffect(() => {
    if (!user?.$id) return;

    const fetchBio = async () => {
      try {
        const posts = await getBio(user.$id);
        setData(posts);
      } catch (err) {
        console.log(err);
      }
    };

    fetchBio();
  }, [user?.$id]);

  // GENERATE PLAN
  useEffect(() => {
    if (!data || !user?.$id || creatingPlan) return;

    const generateWorkoutPlan = async () => {
      setCreatingPlan(true);
      setLoading(true);

      try {
        const existing = await getSession(user.$id);

        // ✅ EXISTING PLAN
        if ((existing?.documents?.length ?? 0) > 0) {
          const saved = existing?.documents[0];

          const parsed = saved?.session.map((item: string) =>
            JSON.parse(item)
          );

          console.log("Existing plan found");
          setWorkoutPlan(parsed);

          // reconstruct start date (fallback: today)
          setStartDate(saved?.startDate ? new Date(saved.startDate) : new Date());

          return;
        }

        const goals: string[] = data.goal || [];
        const validGoals = goals.filter((g) => EXERCISES[g]);

        if (!validGoals.length) return;

    const generated: any[] = [];
let i = 0;
let dayOffset = 0;

// generate only scheduled workout days (not fixed 30)
while (i < 30) {
  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() + dayOffset);

  const workoutDay = isWorkoutDay(baseDate);

  if (!workoutDay) {
    generated.push({
      type: "rest",
    });

    dayOffset++;
    continue;
  }

  const goal = validGoals[i % validGoals.length];
  const routines = EXERCISES[goal];
  const pick = routines[Math.floor(Math.random() * routines.length)];

  generated.push({
    type: "workout",
    goal,
    routine: pick.routine,
    exercises: pick.exercises,
  });

  i++;
  dayOffset++;
}

        // shuffle
        for (let i = generated.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [generated[i], generated[j]] = [generated[j], generated[i]];
        }

        const sessionData = generated.map((item) => JSON.stringify(item));

        const now = new Date();
        setStartDate(now);

        await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.workoutplanID,
          user.$id,
          {
            users: user.$id,
            session: sessionData,
          
          }
        );

        console.log("Workout plan created");
        setWorkoutPlan(generated);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
        setCreatingPlan(false);
      }
    };

    generateWorkoutPlan();
  }, [data, user]);

  // helpers
const chunkIntoWeeks = (arr: any[]) => {
  const weeks = [];
  const days = arr.length;

  for (let i = 0; i < days; i += 7) {
    weeks.push(arr.slice(i, i + 7));
  }

  return weeks;
};
  const getDayDate = (index: number) => {
    const base = startDate ? new Date(startDate) : new Date();
    base.setDate(base.getDate() + index);
    return base;
  };

const isToday = (date: Date) => {
  const today = new Date();

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
};

const getScheduledDays = () => {
  // supports: ["monday", "wednesday"] OR [1,3,5]
  return (data?.schedule || []).map((d: string) => d.toLowerCase());
};

const isWorkoutDay = (date: Date) => {
  const schedule = getScheduledDays();

  const weekday = date
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase();

  return schedule.includes(weekday);
};

  return (
    <div className="py-4 lg:p-6 min-h-screen">
      {loading ? (
        <div className="flex justify-center items-center h-[60vh]">
          <ClipLoader color="#2ED843" size={40} />
        </div>
      ) : (
        <div>
          {workoutPlan.length > 0 && (
            <div className="mt-2">
<div className="mb-5 text-white text-2xl font-bold ">
  {startDate
    ? startDate.toLocaleDateString("en-US", { month: "long" })
    : new Date().toLocaleDateString("en-US", { month: "long" })}

</div>
              {chunkIntoWeeks(workoutPlan).map((week, weekIndex) => (
                <div key={weekIndex} className="mb-6 grid items-start justify-start">

                 <div className="hidden lg:grid grid-cols-7 border-t border-b border-gray-800 py-4 mb-1 ">
  {week.map((_, i) => {
    const globalIndex = weekIndex * 7 + i;
    const date = getDayDate(globalIndex);

    const weekdayShort = date
      .toLocaleDateString("en-US", { weekday: "short" })
      .toUpperCase();

    return (
      <p key={i} className="text-white font-bold">
        {weekdayShort} 
      </p>
    );
  })}
</div>

                  <div className="grid grid-cols-3 lg:grid-cols-7 lg:gap-4 gap-5 mt-2">

                    {week.map((item, i) => {
                      const globalIndex = weekIndex * 7 + i;
                      const date = getDayDate(globalIndex);

const Icon =
  item.type === "rest"
    ? IoIosBed
    : GOAL_ICONS[item.goal] || GiMuscleUp;

                      return (
                        <div key={i} className="grid">
<p className="text-[#2ED843] text-[15px] font-bold lg:hidden mb-1 mt-auto">
  {date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase()}{" "}

</p>

                <div
  className={`rounded-xl p-3 min-h-25 text-white flex flex-col relative overflow-hidden cursor-pointer
    ${
      isToday(date)
        ? "today-card"
        : "bg-linear-to-b from-[#2a2a2a] via-[#1a1a1a] to-black"
    }
  `}
>

                            <p className="text-[12px] text-white">
                              {date.toDateString()}
                            </p>

                            <Icon className="text-[#2ED843] my-2 text-[16px]" />

                         {item.type === "rest" ? (
  <div className="flex flex-col items-start gap-2">
   
    <p className="text-xs font-semibold">Rest Day</p>
  
  </div>
) : (
  <>
    <p className="text-xs font-semibold my-1">
      {item.routine}
    </p>

   
    <h4 className="mt-auto text-[13px] text-[#2ED843]">
  {data?.duration} mins
</h4>
  </>
)}

                          </div>
                          
                        </div>
                      );
                    })}

                  </div>
                </div>
              ))}

            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Planneer;