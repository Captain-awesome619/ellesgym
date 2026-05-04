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
import { FaPause, FaPlay } from "react-icons/fa";
import { useGlobalContext } from "../context/globalprovider";
import { getSession } from "../lib/appwrite";
import { ClipLoader } from "react-spinners";

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
  const [routine, setRoutine] = useState<any>(null);
const [loading, setLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState<DayPlan | null>(null);
const [timeLeft, setTimeLeft] = useState<number | null>(null);
const [isRunning, setIsRunning] = useState(false);


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

const fetchBioData = async () => {
  if (!user?.$id) return;

  try {
    const posts = await getBio(user.$id);
    setdata(posts);
  } catch (error) {
    console.log("Fetching user bio failed:", error);
  }
};

  const filteredExercises = Object.fromEntries(
    (data?.goal || [])
      .map((g: string) => g?.toLowerCase())
      .filter((goal: string) => EXERCISES[goal])
      .map((goal: string) => [goal, EXERCISES[goal]])
  );


 const fetchSessionData = async () => {
  if (!user?.$id) return;

  try {
    const posts = await getSession(user.$id);
    setRoutine(posts);

    if (posts?.session?.length) {
      const generatedPlan = buildPlanFromSession(posts.session);
      setPlan(generatedPlan);
    }
  } catch (error) {
    console.log("Fetching user session failed:", error);
  }
};

useEffect(() => {
  if (!user?.$id) return;

  const fetchAll = async () => {
    setLoading(true);
    await Promise.all([fetchBioData(), fetchSessionData()]);
    setLoading(false);
  };

  fetchAll();
}, [user?.$id]);


const buildPlanFromSession = (session: string[]): DayPlan[] | null => {
  if (!session?.length) return null;

  const parsed = session.map((item) => JSON.parse(item));

  const sessionMap: Record<string, string> = {};

  parsed.forEach(({ day, exercise }) => {
    sessionMap[day] = exercise;
  });

  const calendar = getNextDays(28);

  return calendar.map(({ date, day }) => {
    const workout = sessionMap[day];

    if (!workout) {
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
};




const getStorageKey = (date: string) => `workout-timer-${date}`;

const saveTimer = (date: string, payload: any) => {
  localStorage.setItem(getStorageKey(date), JSON.stringify(payload));
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const Todayy = (dateString: string) => {
  const today = new Date();
  const d = new Date(dateString);
  return (
    today.getFullYear() === d.getFullYear() &&
    today.getMonth() === d.getMonth() &&
    today.getDate() === d.getDate()
  );
};
useEffect(() => {
  if (!selectedDay) return;

  const saved = localStorage.getItem(getStorageKey(selectedDay.date));

  if (!saved) {
    setTimeLeft(null);
    setIsRunning(false);
    return;
  }

  const parsed = JSON.parse(saved);

  if (parsed.isRunning) {
    const elapsed = Math.floor((Date.now() - parsed.savedAt) / 1000);
    const newTime = parsed.timeLeft - elapsed;

    if (newTime > 0) {
      setTimeLeft(newTime);
      setIsRunning(true);
    } else {
      setTimeLeft(0);
      setIsRunning(false);
      localStorage.removeItem(getStorageKey(selectedDay.date));
    }
  } else {
    setTimeLeft(parsed.timeLeft);
    setIsRunning(false);
  }
}, [selectedDay]);


useEffect(() => {
  if (!isRunning || timeLeft === null) return;

  if (timeLeft <= 0) {
    setIsRunning(false);
    if (selectedDay) {
      localStorage.removeItem(getStorageKey(selectedDay.date));
    }
    return;
  }

  const interval = setInterval(() => {
    setTimeLeft((prev) => (prev ? prev - 1 : 0));
  }, 1000);

  return () => clearInterval(interval);
}, [isRunning, timeLeft, selectedDay]);


const startWorkout = () => {
  if (!data?.duration || !selectedDay) return;

  const totalSeconds = data.duration * 60;

  setTimeLeft(totalSeconds);
  setIsRunning(true);

  saveTimer(selectedDay.date, {
    timeLeft: totalSeconds,
    isRunning: true,
    savedAt: Date.now(),
  });
};

if (loading) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <ClipLoader color="#2ED843" size={50} />
    </div>
  );
}


const isToday = (dateString: string) => {
  const today = new Date();
  const cardDate = new Date(dateString);

  return (
    today.getFullYear() === cardDate.getFullYear() &&
    today.getMonth() === cardDate.getMonth() &&
    today.getDate() === cardDate.getDate()
  );
};
  return (
    <div className="p-4 sm:p-6 min-h-screen">

      {!plan && !routine?.session?.length ? (
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

          {plan && chunkIntoWeeks(plan).map((week, weekIndex) => (
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
  onClick={() => setSelectedDay(item)}
  className={`relative grid gap-2 rounded-xl p-2 text-white min-h-28 cursor-pointer hover:scale-[1.02] transition
    ${
      isToday(item.date)
        ? "today-card"
        : "bg-linear-to-b from-[#2a2a2a] via-[#1a1a1a] to-black"
    }
  `}
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
      )
      
      
      }



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
                  Duration: {data?.duration} min
                </p>




{/* 🔥 TIMER SECTION */}
{Todayy(selectedDay.date) && selectedDay.type === "workout" && (
  <div className="mt-3 flex items-center justify-center gap-3">

    {timeLeft === null ? (
      <button
        onClick={startWorkout}
        className="bg-[#2ED843] text-black px-4 py-2 rounded-lg font-semibold"
      >
        Start Workout
      </button>
    ) : (
      <div className="flex items-center gap-3 bg-black px-4 py-2 rounded-lg border border-[#2ED843]">

        <span className="text-[#2ED843] font-bold">
          {formatTime(timeLeft)}
        </span>

        {isRunning ? (
          <FaPause
            className="cursor-pointer text-[#2ED843]"
            onClick={() => {
              setIsRunning(false);
              saveTimer(selectedDay.date, {
                timeLeft,
                isRunning: false,
                savedAt: Date.now(),
              });
            }}
          />
        ) : (
          <FaPlay
            className="cursor-pointer text-[#2ED843]"
            onClick={() => {
              setIsRunning(true);
              saveTimer(selectedDay.date, {
                timeLeft,
                isRunning: true,
                savedAt: Date.now(),
              });
            }}
          />
        )}

      </div>
    )}

  </div>
)}
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
              className="mt-4 bg-white text-black py-2 rounded-xl w-[50%] cursor-pointer"
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
        onsucess={fetchSessionData}
        days={data?.schedule}
        goals={data?.goals}
        duration={data?.duration}
        exercises={filteredExercises}
      />
    </div>
  );
};
export default Planneer;