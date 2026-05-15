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
import Workout from './utils/workout'
import { EXERCISES } from "./utils/data";


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
const [view, setView] = useState<"calendar" | "workout">("calendar");
const [selectedDay, setSelectedDay] = useState<any>(null);
const [completedDays, setCompletedDays] = useState<string[]>([]);


const isPlanExpired = (start: Date) => {
  const today = new Date();

  const expiry = new Date(start);
  expiry.setDate(expiry.getDate() + 30);

  return today > expiry;
};

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

      // =========================================
      // EXISTING PLAN
      // =========================================
      if ((existing?.documents?.length ?? 0) > 0) {
        const saved = existing?.documents[0];

        const savedStartDate = saved?.startDate
          ? new Date(saved.startDate)
          : new Date();

        // CHECK IF PLAN EXPIRED
        const expired = isPlanExpired(savedStartDate);

        // =========================================
        // USE EXISTING PLAN
        // =========================================
        if (!expired) {
          const parsed = saved?.session.map((item: string) =>
            JSON.parse(item)
          );

          setWorkoutPlan(parsed);
          setCompletedDays(saved?.completed || []);
          setStartDate(savedStartDate);

          setLoading(false);
          setCreatingPlan(false);

          return;
        }

        // =========================================
        // DELETE OLD PLAN IF EXPIRED
        // =========================================
        if (saved) {
          await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.workoutplanID,
            saved.$id
          );
        }
      }

      // =========================================
      // CREATE NEW PLAN
      // =========================================

      const goals: string[] = data.goal || [];

      const validGoals = goals.filter((g) => EXERCISES[g]);

      if (!validGoals.length) return;

      const now = new Date();

      const generated: any[] = [];

      // GENERATE EXACTLY 30 DAYS
      for (let i = 0; i < 30; i++) {
        const currentDate = new Date(now);

        currentDate.setDate(now.getDate() + i);

        const workoutDay = isWorkoutDay(currentDate);

        // =========================================
        // REST DAY
        // =========================================
        if (!workoutDay) {
          generated.push({
            day: i + 1,
            type: "rest",
          });

          continue;
        }

        // =========================================
        // WORKOUT DAY
        // =========================================
        const goal = validGoals[i % validGoals.length];

        const routines = EXERCISES[goal];

        // USER EXPERIENCE LEVEL
        const userLevel =
          data?.experience?.charAt(0).toUpperCase() +
          data?.experience?.slice(1).toLowerCase();

        // FILTER ROUTINES BY EXPERIENCE LEVEL
        const filteredRoutines = routines.filter(
          (item) => item.level === userLevel
        );

        // FALLBACK IF NO MATCH
        const availableRoutines =
          filteredRoutines.length > 0
            ? filteredRoutines
            : routines;

        // RANDOM PICK FROM MATCHED LEVEL
        const pick =
          availableRoutines[
            Math.floor(
              Math.random() * availableRoutines.length
            )
          ];

        generated.push({
          day: i + 1,
          type: "workout",
          goal,
          level: pick.level,
          muscleGroup: pick.muscleGroup,
          routine: pick.routine,
          exercises: pick.exercises,
duration : data?.duration ,
          // NEW ENRICHED FIELDS
          description: pick.description,
          equipment: pick.equipment,
          overview: pick.overview,
          tips: pick.tips,
          commonMistakes: pick.commonMistakes,
        });
      }

      const sessionData = generated.map((item) =>
        JSON.stringify(item)
      );

      await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.workoutplanID,
        user.$id,
        {
          users: user.$id,
          session: sessionData,
          startDate: now.toISOString(),
          completed: [],
        }
      );

      setWorkoutPlan(generated);
      setStartDate(now);
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


const getDayStatus = (date: Date) => {
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);

  const match = completedDays.find((entry) => {
    const [savedDate] = entry.split(":");

    const normalizedSavedDate = new Date(savedDate);
    normalizedSavedDate.setHours(0, 0, 0, 0);

    return (
      normalizedSavedDate.toDateString() ===
      normalizedDate.toDateString()
    );
  });

  if (!match) return null;

  return match.split(":")[1];
};

  
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

const isAccessibleDay = (date: Date) => {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const checkDate = new Date(date);

  checkDate.setHours(0, 0, 0, 0);

  return checkDate <= today;
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
 const handleWorkoutSaved = (entry: string) => {
  setCompletedDays((prev) => [...prev, entry]);
};

const isToday = (date: Date) => {
  const today = new Date();

  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};
  return (
    <div className="py-4 lg:p-6 min-h-screen">
      {console.log(workoutPlan)}
       {view === "calendar" && (
      <>
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
                      const status = getDayStatus(date);

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
 className={`rounded-xl p-3 min-h-25 text-white flex flex-col relative overflow-hidden
${
  isAccessibleDay(date)
    ? isToday(date)
      ? "today-card cursor-pointer"
      : "bg-linear-to-b from-[#2a2a2a] via-[#1a1a1a] to-black cursor-not-allowed"
    : "bg-linear-to-b from-[#2a2a2a] via-[#1a1a1a] to-black cursor-not-allowed opacity-70"
}
`}
 onClick={() => {
  if (!isAccessibleDay(date)) return;

  // ✅ already completed
  if (status === "completed" || status === "uncompleted") return;

  setSelectedDay({ item, date });
  setView("workout");
}}
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
{status === "completed" && (

    <div className="flex flex-col items-center justify-center py-2 gap-2">
    <div className=" w-full h-0.5 bg-[#2ED843] ">
       </div>
      <p className="text-green-500 text-xs font-bold">
       Completed  ✓
      </p>
     
    </div>
 
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
      </>
         )}
         {view === "workout" && selectedDay && (
  <Workout
    data={selectedDay}
    duration={data?.duration}
      onWorkoutSaved={handleWorkoutSaved}
      awards={completedDays}
    onBack={() => {
      setView("calendar");
      setSelectedDay(null);
    }}
  />
)}
    </div>
  );
};

export default Planneer;