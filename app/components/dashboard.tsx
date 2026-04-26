import React from "react";
import { FiPlus } from "react-icons/fi";

const Dashboard = ({ user }: { user: any }) => {
  const name = user?.fullname?.trim().split(" ")[0];
  const name2 = user?.name?.trim().split(" ")[0];

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

      <div className="flex flex-col items-center justify-center bg-transparent border border-[#2ED843]/30 rounded-3xl py-14 px-6 text-center shadow-lg shadow-[#2ED843]/10">
        {/* Plus Button */}
        <button className="w-20 h-20 rounded-full bg-[#2ED843] flex items-center justify-center shadow-lg shadow-[#2ED843]/40 hover:scale-105 transition-all duration-300 cursor-pointer">
          <FiPlus className="text-black text-4xl " />
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
        <button className="mt-6 bg-white text-black font-medium px-6 py-3 rounded-full hover:bg-[#2ED843] hover:text-black transition-all duration-300 cursor-pointer">
          Start Creating
        </button>
      </div>
    </div>
  );
};

export default Dashboard;