import React, { useState } from "react";
import { useRecords } from "../store/records";
import Image from "next/image";
import workout from '../../public/workout.svg'
import habit from '../../public/habitt.svg'
import { FaQuestionCircle } from "react-icons/fa";
import Settings from "./utils/settings";
const Profile = () => {
  const {
    completeCount,
    longestStreakk,
   
  } = useRecords();

  const [activeTab, setActiveTab] = useState<"achievements" | "settings">(
    "achievements"
  );


 const milestones = [1, 5, 10, 15, 20];

const nextMilestone =
  milestones.find((m) => m > completeCount) || 20;

const previousMilestone =
  [...milestones].reverse().find((m) => m <= completeCount) || 0;

const range = nextMilestone - previousMilestone;

const rawProgress =
  range === 0 ? 1 : (completeCount - previousMilestone) / range;

// 🔥 KEY FIX: boost early perception + enforce minimum visible fill
const eased = Math.pow(rawProgress, 0.65);

// 👇 THIS is what fixes your issue
const minVisible = 15; // always show at least 8% inside a segment

const progress = Math.min(
  100,
  Math.max(minVisible, eased * 100)
);


const streakMilestones = [1, 5, 10, 15, 20];

const nextStreakMilestone =
  streakMilestones.find((m) => m > longestStreakk) || 20;

const previousStreakMilestone =
  [...streakMilestones].reverse().find((m) => m <= longestStreakk) || 0;

const streakRange = nextStreakMilestone - previousStreakMilestone;

const streakRaw =
  streakRange === 0
    ? 1
    : (longestStreakk - previousStreakMilestone) / streakRange;

const streakEased = Math.pow(streakRaw, 0.65);

const streakProgress = Math.min(
  100,
  Math.max(15, streakEased * 100)
);



const noWorkouts = completeCount ===0;
const noStreak = longestStreakk === 0;


  return (
    <div className="w-full flex flex-col gap-5">
    
      <div className="flex items-center lg:gap-8 gap-4 mb-5">


 <div
          onClick={() => setActiveTab("settings")}
          className="cursor-pointer pb-1 lg:text-[35px] text-white text-[25px] font-semibold"
          style={{
            borderBottom:
              activeTab === "settings"
                ? "2px solid #2ED843"
                : "2px solid transparent",
          }}
        >
          Settings
        </div>

        <div
          onClick={() => setActiveTab("achievements")}
          className="cursor-pointer pb-1 lg:text-[35px] text-white text-[25px] font-semibold"
          style={{
            borderBottom:
              activeTab === "achievements"
                ? "2px solid #2ED843"
                : "2px solid transparent",
          }}
        >
          Achievements
        </div>

       
      </div>

      {/* Views */}
      <div>
      {activeTab === "achievements" && (
  <div className="flex flex-col gap-8">

    {/* ===================== */}
    {/* WORKOUT COMPLETIONS */}
    


{
   noWorkouts ? (
    
  <div className="p-6 dark:bg-white/5 bg-black/70 dark:backdrop-blur-md backdrop-blur-sm border text-center flex flex-col gap-3 items-center justify-center lg:w-[50%]">
    <FaQuestionCircle className="text-[#2ED843] text-[30px]" />

    <h3 className="text-white text-[20px] font-semibold">
      No workouts yet
    </h3>

    <p className="text-white/60 text-sm">
      Complete your first workout to start unlocking badges.
    </p>

  </div>
) : (
   
   <div className="flex flex-col gap-3">
      <h2 className="lg:text-[30px] font-normal text-white border-b dark:border-gray-500 border-white w-full pb-2 ">
        Workout Achievements
      </h2>
{/* PROGRESS CARD */}


<div className="px-4 py-5 dark:bg-white/5 bg-black/70 dark:backdrop-blur-md backdrop-blur-sm rounded-lg flex flex-col gap-5 lg:gap-6 shadow-lg">

  {/* TEXT */}
  <div className="flex justify-between items-center">
    {completeCount < 20 ? (
<div className="flex items-center gap-2">
    <FaQuestionCircle className="lg:text-[25px] text-[#2ED843] text-[22px]" />
      <h3 className="text-white font-semibold text-[18px] lg:text-[25px]">
        Next badge: {nextMilestone - completeCount} workouts left
      </h3>
</div>
    ) : (
      <h3 className="text-[#2ED843] font-medium">
        All badges unlocked 🎉
      </h3>
    )}
  </div>

  {/* PROGRESS BAR (towards next badge) */}
  <div className="w-full h-2 bg-white rounded-full overflow-hidden relative">
  
  {/* BACKGROUND TRACK */}
  <div className="absolute inset-0 bg-white/10" />

  {/* GREEN FILL */}
  <div
    className="h-full rounded-full transition-all duration-300"
    style={{
      width: `${progress}%`,
      backgroundColor: "#2ED843",
      minWidth: completeCount >= 1 ? "6px" : "0px", // ensures you SEE green at 1
    }}
  />
</div>

  {/* LABELS */}
  
</div>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {completeCount >= 1 && (
          <div className="p-4  dark:bg-white/5 bg-black/70 dark:backdrop-blur-md backdrop-blur-sm rounded-lg flex flex-col h-65 items-center justify-center gap-4 shadow-lg">
            <Image src={workout} alt="Workout" className=" h-20" />
            <div className="flex flex-col gap-2 items-center justify-center">
                <h3 className="font-semibold text-white lg:text-[22px] text-[16px]">First Workout</h3>
                <h4 className="font-normal text-white lg:text-[17px] text-[15px] text-center">Completed your first workout</h4>
            </div>
          </div>
        )}

        {completeCount >= 5 && (
          <div className="p-4  dark:bg-white/5 bg-black/70 dark:backdrop-blur-md backdrop-blur-sm rounded-lg flex flex-col h-65 items-center justify-center gap-4 shadow-lg">
            <Image src={workout} alt="Workout" className="w-20 h-20" />
            <div className="flex flex-col gap-2 items-center justify-center">
                <h3 className="font-semibold text-white lg:text-[22px] text-[16px]">First 5 Workouts</h3>
                <h4 className="font-normal text-white lg:text-[17px] text-[15px] text-center">Completed your first 5 workouts</h4>
            </div>
          </div>
        )}

        {completeCount >= 10 && (
          <div className="p-4  dark:bg-white/5 bg-black/70 dark:backdrop-blur-md backdrop-blur-sm rounded-lg flex flex-col h-65 items-center justify-center gap-4 shadow-lg">
            <Image src={workout} alt="Workout" className="w-20 h-20" />
            <div className="flex flex-col gap-2 items-center justify-center">
                <h3 className="font-semibold text-white lg:text-[22px] text-[16px]">First 10 Workouts</h3>
                <h4 className="font-normal text-white lg:text-[17px] text-[15px] text-center">Completed your first 10 workouts</h4>
            </div>
          </div>
        )}

        {completeCount >= 15 && (
          <div className="p-4  dark:bg-white/5 bg-black/70 dark:backdrop-blur-md backdrop-blur-sm rounded-lg flex flex-col h-65 items-center justify-center gap-4 shadow-lg">
            <Image src={workout} alt="Workout" className="w-20 h-20" />
            <div className="flex flex-col gap-2 items-center justify-center">
                <h3 className="font-semibold text-white lg:text-[22px] text-[16px]">First 15 Workouts</h3>
                <h4 className="font-normal text-white lg:text-[17px] text-[15px] text-center">Completed your first 15 workouts</h4>
            </div>
          </div>
        )}

        {completeCount >= 20 && (
          <div className="p-4  dark:bg-white/5 bg-black/70 dark:backdrop-blur-md backdrop-blur-sm rounded-lg flex flex-col h-65 items-center justify-center gap-4 shadow-lg">
            <Image src={workout} alt="Workout" className="w-20 h-20" />
            <div className="flex flex-col gap-2 items-center justify-center">
                <h3 className="font-semibold text-white lg:text-[22px] text-[16px]">First 20 Workouts</h3>
                <h4 className="font-normal text-white lg:text-[17px] text-[15px] text-center">Completed your first 20 workouts</h4>
            </div>
          </div>
        )}
      </div>
    </div>
)
      }


    {/* ===================== */}
    {/* STREAK ACHIEVEMENTS */}
    {/* ===================== */}
  {/* ===================== */}
{/* STREAK ACHIEVEMENTS */}
{/* ===================== */}



{
    noStreak ? (
  <div className="p-6  dark:bg-white/5 bg-black/70 dark:backdrop-blur-md backdrop-blur-sm rounded-lg text-center flex flex-col gap-3 items-center justify-center lg:w-[50%]">
    <FaQuestionCircle className="text-[#2ED843] text-[30px]" />

    <h3 className="text-white text-[20px] font-semibold">
      No streak yet
    </h3>

    <p className="text-white/60 text-sm">
      Keep showing up daily to build your first streak.
    </p>

   
  </div>
) : (
<div className="flex flex-col gap-3">

  <h2 className="lg:text-[30px] text-white font-normal border-b dark:border-gray-500  border-whitew-full pb-2">
    Streak Achievements
  </h2>

  {/* PROGRESS CARD */}
  <div  className="px-4 py-5  dark:bg-white/5 bg-black/70 dark:backdrop-blur-md backdrop-blur-sm rounded-lg flex flex-col gap-5 lg:gap-6 shadow-lg">

    {/* TEXT */}
    <div className="flex justify-between items-center">
      {longestStreakk < 20 ? (
        <div className="flex items-center gap-2">
             <FaQuestionCircle className="lg:text-[25px] text-[#2ED843] text-[22px]" />
        <h3 className="text-white font-semibold text-[18px] lg:text-[25px]">
          Next badge: {nextStreakMilestone - longestStreakk} days left
        </h3>
        </div>
      ) : (
        <h3 className="text-[#2ED843] font-semibold">
          All streak badges unlocked 🎉
        </h3>
      )}
    </div>

    {/* PROGRESS BAR */}
    <div className="w-full h-2 bg-white rounded-full overflow-hidden relative">

      <div className="absolute inset-0 bg-white/10" />

      <div
        className="h-full rounded-full transition-all duration-300"
        style={{
          width: `${streakProgress}%`,
          backgroundColor: "#2ED843",
          minWidth: longestStreakk >= 1 ? "6px" : "0px",
        }}
      />
    </div>
  </div>

  {/* BADGES GRID */}
  <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">

    {longestStreakk >= 1 && (
      <div className="p-4  dark:bg-white/5 bg-black/70 dark:backdrop-blur-md backdrop-blur-sm rounded-lg flex flex-col h-65 items-center justify-center gap-4 shadow-lg">
        <Image src={habit} alt="Streak" className="w-20 h-20" />
        <div className="flex flex-col gap-2 items-center justify-center">
          <h3 className="font-semibold text-white lg:text-[25px] text-[16px]">
            1 Day Streak
          </h3>
          <h4 className="font-normal text-white lg:text-[17px] text-[15px] text-center">
            Started your streak
          </h4>
        </div>
      </div>
    )}

    {longestStreakk >= 5 && (
      <div className="p-4  dark:bg-white/5 bg-black/70 dark:backdrop-blur-md backdrop-blur-sm rounded-lg flex flex-col h-65 items-center justify-center gap-4 shadow-lg">
        <Image src={habit} alt="Streak" className="w-20 h-20" />
        <div className="flex flex-col gap-2 items-center justify-center">
          <h3 className="font-semibold text-white lg:text-[25px] text-[16px]">
            5 Day Streak
          </h3>
          <h4 className="font-normal text-white lg:text-[17px] text-[15px] text-center">
            Built momentum
          </h4>
        </div>
      </div>
    )}

    {longestStreakk >= 10 && (
      <div className="p-4  dark:bg-white/5 bg-black/70 dark:backdrop-blur-md backdrop-blur-sm rounded-lg flex flex-col h-65 items-center justify-center gap-4 shadow-lg">
        <Image src={habit} alt="Streak" className="w-20 h-20" />
        <div className="flex flex-col gap-2 items-center justify-center">
          <h3 className="font-semibold text-white lg:text-[25px] text-[16px]">
            10 Day Streak
          </h3>
          <h4 className="font-normal text-white lg:text-[17px] text-[15px] text-center">
            Strong consistency
          </h4>
        </div>
      </div>
    )}

    {longestStreakk >= 15 && (
      <div className="p-4  dark:bg-white/5 bg-black/70 dark:backdrop-blur-md backdrop-blur-sm rounded-lg flex flex-col h-65 items-center justify-center gap-4 shadow-lg">
        <Image src={habit} alt="Streak" className="w-20 h-20" />
        <div className="flex flex-col gap-2 items-center justify-center">
          <h3 className="font-semibold text-white lg:text-[25px] text-[16px]">
            15 Day Streak
          </h3>
          <h4 className="font-normal text-white lg:text-[17px] text-[15px] text-center">
            Very disciplined
          </h4>
        </div>
      </div>
    )}

    {longestStreakk >= 20 && (
      <div className="p-4  dark:bg-white/5 bg-black/70 dark:backdrop-blur-md backdrop-blur-sm rounded-lg flex flex-col h-65 items-center justify-center gap-4 shadow-lg">
        <Image src={habit} alt="Streak" className="w-20 h-20" />
        <div className="flex flex-col gap-2 items-center justify-center">
          <h3 className="font-semibold text-white lg:text-[25px] text-[16px]">
            20 Day Streak
          </h3>
          <h4 className="font-normal text-white lg:text-[17px] text-[15px] text-center">
            Elite consistency
          </h4>
        </div>
      </div>
    )}

  </div>
</div>
     ) }


      
  </div>
)}

        {activeTab === "settings" && (
          <div>
           <Settings />
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;