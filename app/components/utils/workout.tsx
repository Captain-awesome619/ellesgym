"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  IoArrowBack,
  IoPlay,
  IoPause,
  IoRefresh,
  IoCheckmarkCircle,
IoShareSocialOutline,
} from "react-icons/io5";
import Modal from "react-modal";
import { ClipLoader } from "react-spinners";
import { useGlobalContext } from "@/app/context/globalprovider";
import tip from "../../../public/fitnesstip.svg";
import weight from '../../../public/weight.svg'
import Image from "next/image";
import clock from '../../../public/clock.svg'
import { databases } from "@/app/lib/appwrite";
import completee from '../../../public/complete.svg'
import { IoIosWarning } from "react-icons/io";
import { appwriteConfig } from "@/app/lib/appwrite";
import badge from '../../../public/badge.svg'
import { useRecords } from "@/app/store/records";
Modal.setAppElement("body");


const Workout = ({
  data,
  onBack,
  duration,
  awards,
  onWorkoutSaved
}: {
  awards : any;
  data: any;
  onBack: () => void;
  duration: number;
  onWorkoutSaved: (entry: string) => void;
}) => {
  const item = data?.item;


const {
  completeCount,
  longestStreakk,
  setComplete,
  setLongestStreak,
} = useRecords();

const setCompletee = useRecords(
  (state) => state.setComplete
);




  // UNIQUE STORAGE KEY
 const STORAGE_KEY = useMemo(() => {
  return `workout-${new Date(data.date).toDateString()}-${item?.routine}`;
}, [item, data.date]);
  const [hydrated, setHydrated] =
    useState(false);

const { user } = useGlobalContext();

  const [isRunning, setIsRunning] =
    useState(false);

  const [timeLeft, setTimeLeft] =
    useState(duration * 60);

  const [checkedSets, setCheckedSets] =
    useState<Record<string, boolean>>(
      {}
    );

  const [setTimes, setSetTimes] =
    useState<Record<string, number>>(
      {}
    );

  const [showCompleteModal, setShowCompleteModal] =
    useState(false);

  const [showIncompleteModal, setShowIncompleteModal] =
    useState(false);

  const [showSkipModal, setShowSkipModal] =
    useState(false);

  const [loading, setLoading] =
    useState(false);
  const [elapsedSeconds, setElapsedSeconds] =
    useState(0);

const [showSuccessView, setShowSuccessView] =
  useState(false);

  // stores last completed set timestamp
  const lastCheckpointRef = useRef(0);

  // TOTAL SETS
  const totalSets =
    item?.exercises?.length * 3;

  // COMPLETED SETS
  const completedSets =
    Object.keys(checkedSets).length;

  // ALL COMPLETE
  const allSetsCompleted =
    completedSets === totalSets &&
    totalSets > 0;

// LOAD SAVED WORKOUT
useEffect(() => {
  if (!item) return;

  const savedWorkout = localStorage.getItem(STORAGE_KEY);

  if (savedWorkout) {
    const parsed = JSON.parse(savedWorkout);

    // today's date
    const today = new Date().toDateString();

    // saved date
    const savedDate = parsed.savedDate;

    // if saved workout is from another day → clear it
    if (savedDate !== today) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      // restore workout
      setTimeLeft(
        parsed.timeLeft ?? duration * 60
      );

      setElapsedSeconds(
        parsed.elapsedSeconds ?? 0
      );

      setCheckedSets(
        parsed.checkedSets ?? {}
      );

      setSetTimes(
        parsed.setTimes ?? {}
      );

      setIsRunning(
        parsed.isRunning ?? false
      );

      lastCheckpointRef.current =
        parsed.lastCheckpoint ?? 0;
    }
  }

  setHydrated(true);
}, [item, STORAGE_KEY, duration]);

useEffect(() => {
  if (!hydrated) return;

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      savedDate: new Date().toDateString(),

      timeLeft,
      elapsedSeconds,
      checkedSets,
      setTimes,
      isRunning,

      lastCheckpoint:
        lastCheckpointRef.current,
    })
  );
}, [
  hydrated,
  STORAGE_KEY,
  timeLeft,
  elapsedSeconds,
  checkedSets,
  setTimes,
  isRunning,
]);

  // SHOW MODAL WHEN COMPLETE
  useEffect(() => {
    if (allSetsCompleted) {
      setShowCompleteModal(true);

      setIsRunning(false);
    }
  }, [allSetsCompleted]);

  // TIMER
  useEffect(() => {
    if (!hydrated) return;

    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          // RESET TIMER WHEN IT HITS 0
          if (prev <= 1) {
            return duration * 60;
          }

          return prev - 1;
        });

        setElapsedSeconds(
          (prev) => prev + 1
        );
      }, 1000);
    }

    return () =>
      clearInterval(interval);
  }, [
    isRunning,
    hydrated,
    duration,
  ]);

  const formatTime = (
    secs: number
  ) => {
    const m = Math.floor(secs / 60);

    const s = secs % 60;

    return `${m}:${s
      .toString()
      .padStart(2, "0")}`;
  };

  const toggleSet = (
    key: string
  ) => {
    // prevent unchecking
    if (checkedSets[key]) return;

    const currentElapsed =
      elapsedSeconds;

    // difference between this click and previous checkpoint
    const diff =
      currentElapsed -
      lastCheckpointRef.current;

    // update checkpoint
    lastCheckpointRef.current =
      currentElapsed;

    setCheckedSets((prev) => ({
      ...prev,
      [key]: true,
    }));

    setSetTimes((prev) => ({
      ...prev,
      [key]: diff,
    }));
  };

  // RESET EVERYTHING
  const resetWorkout = () => {
    localStorage.removeItem(
      STORAGE_KEY
    );

    setIsRunning(false);

    setCheckedSets({});

    setSetTimes({});

    setElapsedSeconds(0);

    setTimeLeft(duration * 60);

    lastCheckpointRef.current = 0;

    setShowCompleteModal(false);
  };

  // SAVE TO APPWRITE
const saveWorkoutStatus = async (
  status: "completed" | "uncompleted"
) => {
  try {
    setLoading(true);

    // 1. Get existing document
    const doc = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.workoutplanID,
      user.$id
    );

    // 2. Append new record
const newEntry = `${new Date(data.date).toDateString()}:${status}`;

const updatedCompleted = [
  ...(doc.completed || []),
  newEntry,
];
    // 3. Update document
    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.workoutplanID,
      user.$id,
      {
        completed: updatedCompleted,
      }
    );
onWorkoutSaved(newEntry);
    alert("Your daily workout has been saved.");
   
  
  } catch (error) {
    console.log(error);
    alert("Something went wrong saving your workout.");
  } finally {
    setLoading(false);
    setShowIncompleteModal(false);
    setShowSkipModal(false);
  }
};

  // FINISH WORKOUT
  const handleFinishWorkout =
  async () => {
    // ALL COMPLETE
    if (allSetsCompleted) {
      await saveWorkoutStatus(
        "completed"
      );

      // close modal
      setShowCompleteModal(false);

      // show success screen
      setShowSuccessView(true);

      return;
    }

    // NOT COMPLETE
    setShowIncompleteModal(
      true
    );
  };
  // SKIP WORKOUT
  const handleSkipWorkout =
    () => {
      setShowSkipModal(true);
    };



// COMPLETED WORKOUTS ONLY
const completedWorkouts =
  awards?.filter((entry: string) =>
    entry.includes(":completed")
  ) || [];

// TOTAL COMPLETED
const completedCount =
  completedWorkouts.length;

// BADGE MILESTONES
const milestones = [1, 5, 10, 15, 20];

// CURRENT BADGE
const currentBadge =
  milestones
    .filter(
      (m) => completedCount >= m
    )
    .pop();

// NEXT BADGE
const nextBadge =
  milestones.find(
    (m) => completedCount < m
  );

// DID USER JUST UNLOCK BADGE?
const showNewBadge =
  milestones.includes(
    completedCount
  );

// WORKOUTS LEFT
const workoutsLeft =
  nextBadge
    ? nextBadge - completedCount
    : 0;


const progress =
  nextBadge
    ? (completedCount /
        nextBadge) *
      100
    : 100;

useEffect(() => {
  if (completeCount !== undefined) {
    setCompletee(completedCount);
  }
  console.log("Complete count updated:", completeCount);
  console.log(completedCount)
}, [completedCount, completeCount]);

if (showSuccessView) {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-6 py-10">
      {/* BACKGROUND */}
       

      {/* CONTENT */}
      <div className="relative z-20 w-full max-w-4xl flex flex-col items-center text-center lg:gap-12 gap-8">
        {/* ICON */}
        <div className="flex items-center justify-center">
         <Image 
          src={completee}
        
         alt="done"
         className="lg:w-20 w-15"
         />
        </div>

        {/* TEXT */}
        <div className="space-y-2">
          <h1 className="text-4xl lg:text-6xl font-bold text-white">
            Workout Completed
          </h1>

          <p className="text-white/70 text-lg">
            Great job - you're one step closer
            to your goal.
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full max-w-2xl">
          {/* DURATION */}
          <div className="bg-white/10 backdrop-blur-none border border-white/10 rounded-2xl py-4  flex flex-col items-center justify-center gap-2">
         <div className="flex gap-4 items-center justify-center">
           <div className="flex items-center justify-center">
         <Image 
          src={clock}
         
         alt="done"
         className="lg:w-8 w-5"
         />
        </div>

            <h3 className=" text-xl lg:text-2xl font-bold text-white">
            {duration}
              min
            </h3>
</div>
            <p className="text-white/70">
              Duration
            </p>
          </div>



   {/* EXERCISES */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-2">

         

            <h3 className="text-xl lg:text-2xl font-bold text-white">
            685 Kcal
            </h3>
 
            <p className="text-white/70">
           Calories Burned
            </p>
           
          </div>

          {/* EXERCISES */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl py-4 flex flex-col items-center justify-center gap-2">
<div  className="flex gap-4 items-center justify-center" >
           <Image 
          src={weight}
         alt="done"
         className="lg:w-5 w-4"
         />

            <h3 className="text-xl lg:text-2xl font-bold text-white">
              {
                item.exercises
                  ?.length
              }
            </h3>
 </div>
            <p className="text-white/70">
              Exercises Completed
            </p>
           
          </div>
        </div>

     {/* BADGE + PROGRESS */}
<div
  className={`grid gap-5 w-full max-w-4xl ${
    showNewBadge
      ? "lg:grid-cols-2"
      : "grid-cols-1"
  }`}
>
  
  {/* NEW BADGE */}
 
<div className="lg:hidden flex">
 {showNewBadge && (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 w-full flex flex-col items-center gap-3">
      
      {/* PLACEHOLDER BADGE */}
     <Image 
          src={badge}
         alt="done"
         className="lg:w-20 w-15"
         />

      <h3 className="text-3xl font-bold text-white text-center">
        New Badge Unlocked
      </h3>

      <p className="text-white/70 text-center">
        {completedCount} Workout
        {completedCount > 1 && "s"} Completed
      </p>

      <div className="bg-[#2ED843]/20 px-4 py-2 rounded-full">
        <p className="text-[#2ED843] font-semibold">
          {currentBadge} Day Badge
        </p>
      </div>
    </div>
  )}
</div>




  {/* PROGRESS CARD */}
  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 w-full flex flex-col gap-5 justify-center">
    {/* PROGRESS BAR */}
    <div className="w-full h-2 bg-white rounded-full overflow-hidden">
      <div
        className="h-full bg-[#2ED843] rounded-full transition-all duration-500"
        style={{
          width: `${progress}%`,
        }}
      />
    </div>

   
    <div className="flex justify-between text-sm text-white/90">

     {nextBadge ? (
       <div className="">
<div className="flex items-center gap-1  text-sm text-white/90">
  <p>Next Badge :</p>
  <p>{workoutsLeft}</p>

  {workoutsLeft <= 1 ? (
    <p>workout</p>
  ) : (
    <p>workouts</p>
  )}

  <p>left</p>
</div>
     
    </div>
      ) : (
        <p className="text-white/70">
          All badges unlocked 🎉
        </p>
      )}

    </div>
  </div>

<div className="lg:flex hidden">
 {showNewBadge && (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 w-full flex flex-col items-center gap-3">
      
      {/* PLACEHOLDER BADGE */}
     <Image 
          src={badge}
         alt="done"
         className="lg:w-20 w-15"
         />

      <h3 className="text-3xl font-bold text-white text-center">
        New Badge Unlocked
      </h3>

      <p className="text-white/70 text-center">
        {completedCount} Workout
        {completedCount > 1 && "s"} Completed
      </p>

      <div className="bg-[#2ED843]/20 px-4 py-2 rounded-full">
        <p className="text-[#2ED843] font-semibold">
          {currentBadge} Day Badge
        </p>
      </div>
    </div>
  )}
</div>

</div>

        {/* BUTTONS */}
        <div className="flex flex-col lg:flex-row gap-4 w-full max-w-3xl">
          <button
             onClick={() => {
              resetWorkout();

              setShowSuccessView(
                false
              );

              onBack();
            }}
            className="flex-1 border border-white text-white py-4 rounded-2xl font-bold text-lg cursor-pointer"
          >
            View Weekly Progress
          </button>

          <button
            onClick={() => {
              resetWorkout();

              setShowSuccessView(
                false
              );

              onBack();
            }}
            className="flex-1 bg-[#2ED843] text-black py-4 rounded-2xl font-bold text-lg cursor-pointer"
          >
            Back to Dashboard
          </button>

          <button className="flex items-center justify-center gap-2 border border-white text-white py-4 px-8 rounded-2xl font-bold text-lg cursor-pointer">
            <IoShareSocialOutline
              size={22}
            />

            Share
          </button>
        </div>
      </div>
    </div>
  );
}


  if (item.type === "rest") {
    return (
      <div className="min-h-screen ">
        <div className="p-6 grid gap-4">
          <button
            onClick={onBack}
            className="text-[#2ED843] cursor-pointer"
          >
            <IoArrowBack size={26} />
          </button>

          <div>
            <h1 className="text-2xl font-bold mb-2 text-[#2ED843]">
              Rest Day 🛌
            </h1>

            <p className="text-white">
              Recovery, hydration,
              stretching, and sleep.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* COMPLETE MODAL */}
      <Modal
        isOpen={showCompleteModal}
        onRequestClose={() =>
          setShowCompleteModal(false)
        }
        className="bg-[#111111] border border-[#2ED843] rounded-2xl p-8 w-[90%] max-w-md mx-auto outline-none"
        overlayClassName="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      >
        <div className="flex flex-col items-center text-center gap-5">
          <div className="w-20 h-20 rounded-full bg-[#2ED843] flex items-center justify-center">
            <span className="text-black text-4xl font-bold">
              ✓
            </span>
          </div>

          <h2 className="text-3xl font-bold text-white">
            Workout Complete
          </h2>

          <p className="text-white/70">
            Great job. You completed all
            your sets for today.
          </p>

          <button
            onClick={() =>
              setShowCompleteModal(
                false
              )
            }
            className="w-full bg-[#2ED843] text-black font-bold py-3 rounded-xl cursor-pointer"
          >
            Awesome 🚀
          </button>
        </div>
      </Modal>

      {/* INCOMPLETE MODAL */}
      <Modal
        isOpen={
          showIncompleteModal
        }
        onRequestClose={() =>
          setShowIncompleteModal(
            false
          )
        }
        className="bg-[#111111] border border-[#2ED843] rounded-2xl p-8 w-[90%] max-w-md mx-auto outline-none"
        overlayClassName="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      >
        <div className="flex flex-col gap-5 text-center items-center justify-center">
          <h2 className="text-2xl font-bold text-white">
            Incomplete Workout
          </h2>
  <IoIosWarning size={25} className="text-amber-400 flex items-center justify-center" />
          <p className="text-white/70">
          You have not completed all
            sets for today hence today would be marked as incomplete.
          </p>

          <p className="text-white/70">
            Do you still want to finish
            the workout?
          </p>

          <div className="flex gap-4 w-full">
            <button
              onClick={() =>
                setShowIncompleteModal(
                  false
                )
              }
              className="flex-1 border border-white text-white cursor-pointer py-3 rounded-xl font-semibold"
            >
              Cancel
            </button>

            <button
              disabled={loading}
              onClick={() =>
                saveWorkoutStatus(
                  "uncompleted"
                )
              }
              className="flex-1 bg-[#2ED843] text-black py-3 rounded-xl font-bold flex items-center justify-center cursor-pointer"
            >
              {loading ? (
                <ClipLoader
                  size={20}
                  color="#000"
                />
              ) : (
                "Finish"
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* SKIP MODAL */}
      <Modal
        isOpen={showSkipModal}
        onRequestClose={() =>
          setShowSkipModal(false)
        }
        className="bg-[#111111] border border-[#2ED843] rounded-2xl p-8 w-[90%] max-w-md mx-auto outline-none"
        overlayClassName="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      >
        <div className="flex flex-col gap-5 text-center">
          <h2 className="text-2xl font-bold text-white">
            Skip Workout?
          </h2>

          <p className="text-white/70">
            Are you sure you want to skip
            this workout?
          </p>

          <div className="flex gap-4  ">
            <button
              onClick={() =>
                setShowSkipModal(false)
              }
              className="flex-1 border border-white text-white py-3 rounded-xl font-semibold cursor-pointer"
            >
              Cancel
            </button>

            <button
              disabled={loading}
              onClick={() =>
                saveWorkoutStatus(
                  "uncompleted"
                )
              }
              className="flex-1 bg-[#2ED843] text-black py-3 rounded-xl font-bold flex items-center justify-center cursor-pointer"
            >
              {loading ? (
                <ClipLoader
                  size={20}
                  color="#000"
                />
              ) : (
                "Skip"
              )}
            </button>
          </div>
        </div>
      </Modal>

      <div className="min-h-screen w-full grid">
        {/* HEADER */}
        <div className="flex flex-col gap-4">
          <button
            onClick={onBack}
            className="text-[#2ED843] cursor-pointer"
          >
            <IoArrowBack size={26} />
          </button>

          <div className="flex flex-col items-center justify-center gap-2 lg:items-start lg:justify-start mb-5">
            <h2 className="font-bold text-[15px] lg:text-[30px] text-white">
              <span className="text-[#2ED843]">
                Goal:
              </span>{" "}
              {item.goal}
            </h2>

            <h3 className="font-semibold text-[14px] lg:text-[20px] text-white">
              <span className="text-[#2ED843]">
                Routine:
              </span>{" "}
              {item.routine}
            </h3>
          </div>
        </div>

        <div className="grid lg:grid-cols-[60%_40%] grid-cols-1 gap-8 ">
          {/* EXERCISES */}
          <div className="flex flex-col gap-6">
            {/* TIMER */}
            <div className="flex justify-center items-center gap-2">
              <h3 className="text-[#2ED843] font-bold text-xl">
                {formatTime(timeLeft)}
              </h3>

              {/* SWITCH TO RESET ICON WHEN COMPLETE */}
              {allSetsCompleted ? (
                <button
                  onClick={
                    resetWorkout
                  }
                  className="text-[#2ED843]"
                >
                  <IoRefresh
                    size={28}
                    className="cursor-pointer"
                  />
                </button>
              ) : (
                <button
                  onClick={() =>
                    setIsRunning(
                      (prev) =>
                        !prev
                    )
                  }
                  className="text-[#2ED843]"
                >
                  {isRunning ? (
                    <IoPause
                      size={28}
                      className="cursor-pointer"
                    />
                  ) : (
                    <IoPlay
                      size={28}
                      className="cursor-pointer"
                    />
                  )}
                </button>
              )}
            </div>

            {item.exercises?.map(
              (
                ex: string,
                idx: number
              ) => (
                <div
                  key={idx}
                  className="bg-white/5 backdrop-blur-md border border-white/10 text-white  rounded-xl p-4"
                >
                  {/* EXERCISE NAME */}
                  <h4 className="font-bold text-lg mb-4 text-white">
                    {ex}
                  </h4>

                  {/* SETS */}
                  {[
                    {
                      set: 1,
                      reps: 12,
                    },
                    {
                      set: 2,
                      reps: 10,
                    },
                    {
                      set: 3,
                      reps: 8,
                    },
                  ].map((s, i) => {
                    const key = `${idx}-set-${s.set}`;

                    return (
                      <div
                        key={i}
                        className="flex items-center justify-between border-b border-white/10 py-2"
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={
                              !!checkedSets[
                                key
                              ]
                            }
                            disabled={
                              !isRunning ||
                              allSetsCompleted
                            }
                            onChange={() =>
                              toggleSet(
                                key
                              )
                            }
                            className="accent-[#2ED843] cursor-pointer"
                          />

                          <p className="text-sm">
                            Set {s.set}
                            <span className="mx-2">
                              •
                            </span>
                            {s.reps} reps
                          </p>
                        </div>

                        <span className="text-xs text-[#2ED843]">
                          {setTimes[
                            key
                          ]
                            ? formatTime(
                                setTimes[
                                  key
                                ]
                              )
                            :<div className="text-white"> --:--</div>}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )
            )}
          </div>

          {/* MOBILE BUTTONS */}
          <div className="lg:hidden flex items-center justify-between lg:w-[90%] mt-1">
            <button
              onClick={
                handleSkipWorkout
              }
              className="lg:w-50 w-40 border py-2 rounded-lg text-white bg-transparent border-white font-bold cursor-pointer"
            >
              Skip Exercise
            </button>

            <button
              onClick={
                handleFinishWorkout
              }
              disabled={loading}
              className="lg:w-50 w-40 border py-2 rounded-lg text-black bg-[#2ED843] border-[#2ED843] font-bold cursor-pointer flex items-center justify-center"
            >
              {loading ? (
                <ClipLoader
                  size={20}
                  color="#000"
                />
              ) : (
                "Finish Workout"
              )}
            </button>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 w-80 h-full flex flex-col gap-3 p-6 rounded-xl">
            <div className="grid gap-2">
              <h3 className="font-semibold text-white lg:text-[25px] text-[18px]">
                Bench Press
              </h3>

              <Image
                src={tip}
                alt="Fitness Tip"
                className="lg:w-60 lg:h-70 rounded-xl "
                loading="lazy"
              />

              <p className="text-white font-normal lg:text-[20px] text-[15px]">
                Equipment; Barbell
              </p>
            </div>

            <div className="grid gap-2">
              <p className="font-semibold text-white lg:text-[22px] text-[18px]">
                Tips
              </p>

              <p className="text-white font-normal lg:text-[17px] text-[15px]">
                Keep your back flat,
                Exhale on push, Set your
                feet correctly, Grip the
                bar tightly
              </p>
            </div>
          </div>
        </div>

        {/* DESKTOP BUTTONS */}
        <div className="hidden lg:flex items-center justify-between lg:w-[90%] mt-7">
          <button
            onClick={
              handleSkipWorkout
            }
            className="lg:w-50 w-40 border py-2 rounded-lg text-white bg-transparent border-white font-bold cursor-pointer"
          >
            Skip Exercise
          </button>

          <button
            onClick={
              handleFinishWorkout
            }
            disabled={loading}
            className="lg:w-50 w-40 border py-2 rounded-lg text-black bg-[#2ED843] border-[#2ED843] font-bold cursor-pointer flex items-center justify-center"
          >
            {loading ? (
              <ClipLoader
                size={20}
                color="#000"
              />
            ) : (
              "Finish Workout"
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default Workout;