import React from "react";
import { FiPlus } from "react-icons/fi";
import { useState, useEffect } from "react";
import { getSession } from "../lib/appwrite";
import bigcircle from '../../public/bigcircle.svg'
import smallircle from '../../public/smallcircle.svg'
import Image from "next/image";
import ClipLoader from "react-spinners/ClipLoader";
import { FaShuffle } from "react-icons/fa6";

const Dashboard = ({ user, start }: { user: any; start: () => void }) => {
  const name = user?.fullname?.trim().split(" ")[0];
  const name2 = user?.name?.trim().split(" ")[0];
const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

useEffect(() => {
  if (!user?.$id) return;

  const fetchBio = async () => {
    try {
      setLoading(true);

      const posts = await getSession(user.$id);

      const parsed = posts?.documents?.[0]?.session?.map((item: string) =>
        JSON.parse(item)
      );

      setData({
        ...posts?.documents?.[0],
        session: parsed,
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  fetchBio();
}, [user?.$id]);

  // check if session exists and has values
const hasSession =
  Array.isArray(data?.session) &&
  data.session.length > 0;

const getDayIndex = (startDate: string) => {
  const start = new Date(startDate);
  const today = new Date();

  const diffTime = today.getTime() - start.getTime();

  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

const dayIndex = data?.startDate
  ? Math.min(
      getDayIndex(data.startDate),
      data.session.length - 1
    )
  : 0;

  const todayWorkout = data?.session?.[dayIndex];


  const backgroundMap: Record<any, string> = {
  strength: "strength1.jpg",
  'weight-loss': "weightloss.jpg",
  endurance: "endurance.jpg",
  "general-fitness" : 'generalfitness.jpg',
 "muscle-gain": "musclegain2.jpg",
  "flexibility": 'fleixble3.jpg'
};
  
  return (
    <div className="grid gap-6">
     
      <div className="flex flex-col gap-1">
        <h2 className="font-semibold lg:text-[40px] text-[20px] text-white">
          Welcome, {name || name2}
        </h2>

        <h4 className="font-normal lg:text-[25px] text-[17px] text-white">
          Here's your training dashboard.
        </h4>
        
      </div>

    
{loading ? (
  <div className="flex items-center justify-center h-[60vh]">
    <ClipLoader color="#2ED843" size={60} />
  </div>
) : hasSession ? (
  <div className="flex flex-col gap-5 w-full lg:items-center">
    <div className="flex lg:flex-row flex-col lg:gap-8 gap-6">
      <div className="flex flex-col p-5 bg-white/10 backdrop-blur-none lg:w-70 gap-10 rounded-lg">
        <div className="flex justify-between items-center w-full">
          <h4 className="font-semibold lg:text-[18px] text-[15px] text-white">
            Dailty Streak
          </h4>

          <Image
            src={smallircle}
            alt="streak"
            className="w-5 h-5"
          />
        </div>

        <div className="flex items-center">
          <div className="flex flex-col gap-4 items-center">
            <h4 className="font-semibold lg:text-[15px] text-[15px] text-white">
              7 Days
            </h4>

            <h4 className="font-semibold lg:text-[15px] text-[13px] text-white">
              Keep it up
            </h4>
          </div>

          <Image
            src={bigcircle}
            alt="streak"
            className="w-15 ml-auto"
          />
        </div>

        <h4 className="font-semibold lg:text-[13px] text-[12px] text-white mt-auto">
          Your longest streak: 12 Days
        </h4>
      </div>

<div
  className="relative lg:w-180 lg:h-80 rounded-lg w-full h-60 bg-cover bg-center overflow-hidden flex flex-col gap-5 lg:px-8 lg:py-3 p-4"
  style={{
    backgroundImage: `url(/${
      backgroundMap[todayWorkout?.goal] || "gymbackground2.jpg"
    })`,
  }}
>
  {/* DARK OVERLAY */}
  <div className="absolute inset-0 bg-black/40" />

  {/* CONTENT */}
  <div className="relative z-10 flex justify-between items-center">
    <h4 className="lg:text-[21px] text-[16px] font-bold text-white">
      Today's Workout
    </h4>
    <div className="lg:px-4 py-[0.5] px-3 bg-black flex items-center justify-center rounded-xl">
  <h5 className="lg:text-[15px] text-[13px] font-normal text-[#2ED843] ">
 DAY {todayWorkout?.day}
</h5>
</div>

  </div>
<div className="flex flex-col lg:gap-4 gap-4 relative z-10"> 
<div className="flex items-center  gap-4"> 
 <h4 className="lg:text-[25px] text-[18px] font-bold text-white">
      {todayWorkout.routine}
    </h4>
    <FaShuffle className="lg:text-[21px] text-[18px] text-[#2ED843] cursor-pointer" />
  </div>
  <div className="flex items-center gap-2"> 
<h4 className="lg:text-[15px] text-[13px] font-bold text-white">
    {todayWorkout?.duration}min.
    </h4>
<h4 className="lg:text-[15px] text-[13px] font-bold text-white">
    {todayWorkout?.equipment}.
    </h4>
<h4 className="lg:text-[15px] text-[13px] font-bold text-white">
    {todayWorkout?.level}.
    </h4>

  </div>
</div>

<div className="relative z-10  flex justify-between lg:mt-5 mt-0 h-full"> 
<div>
<button   className="lg:w-50 w-40 border py-2 rounded-lg text-black bg-[#2ED843] border-[#2ED843] font-bold cursor-pointer flex items-center justify-center" 
 onClick={start}
>
Start Workout
</button>
</div>
<div className="flex items-end justify-end mt-auto">
<button   className="lg:w-50 w-40 border py-2 rounded-lg text-black bg-[#2ED843] border-[#2ED843] font-bold cursor-pointer " >
Print Workout Card
</button>
</div>
  </div>

</div>


    </div>
  </div>
) : (
  <div className="flex flex-col items-center justify-center bg-transparent border border-[#2ED843]/30 rounded-3xl py-14 px-6 text-center shadow-lg shadow-[#2ED843]/10">
    {/* Plus Button */}
    <button
      className="w-20 h-20 rounded-full bg-[#2ED843] flex items-center justify-center shadow-lg shadow-[#2ED843]/40 hover:scale-105 transition-all duration-300 cursor-pointer"
      onClick={start}
    >
      <FiPlus className="text-black text-4xl" />
    </button>

    {/* Text */}
    <h3 className="text-white font-semibold text-2xl mt-6">
      No Workout Plan Yet 💪
    </h3>

    <p className="text-gray-400 text-sm lg:text-base mt-2 max-w-md">
      Your fitness journey starts with a single step. Tap the button above
      to create your personalized workout plan and crush your goals.
    </p>

    {/* Fake CTA */}
    <button
      className="mt-6 bg-white text-black font-medium px-6 py-3 rounded-full hover:bg-[#2ED843] hover:text-black transition-all duration-300 cursor-pointer"
      onClick={start}
    >
      Start Creating
    </button>
  </div>
)}
    </div>
  );
};

export default Dashboard;