"use client";

import { useEffect, useState } from "react";
import {
  FiMenu,
  FiX,
  FiBell,
  FiSettings,
  FiHome,
  FiCalendar,
  FiBookOpen,
  FiTrendingUp,
  FiAward,
  FiUsers,
  FiUser,
  FiActivity,
} from "react-icons/fi";
import dashicon from "../../public/dashicon.svg";
import Image from "next/image";
import { useGlobalContext } from "../context/globalprovider";
import { IoNotifications } from "react-icons/io5";
import Dashboard from "../components/dashboard";
import Planneer from "../components/planneer";
import Profile from "../components/profile";
import Progress from "../components/progress";
import Challenges from "../components/challenges";
import Libray from "../components/libray";
import { ModeToggle } from "../components/utils/toogle";
import { useTheme } from "next-themes";

const navItems = [
  { name: "Dashboard", icon: FiHome },
  { name: "Planner", icon: FiCalendar },
  { name: "Meal Guide", icon: FiBookOpen },
  { name: "Progress", icon: FiTrendingUp },
  { name: "Challenges", icon: FiAward },
  { name: "Leaderboard", icon: FiUsers },
  { name: "Library", icon: FiActivity },
  { name: "Profile", icon: FiUser },
];

export default function FitnessDashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const [mounted, setMounted] = useState(false); // 1. Added mounted state to prevent hydration mismatch

  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true); // 2. Flip mounted to true once running on client browser
    
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuOpen]);

  const { loading, isLogged, setUser, setIsLogged, user } = useGlobalContext();

  const initial = user?.fullname?.trim()?.charAt(0)?.toUpperCase() || "";
  const initial2 = user?.name?.trim()?.charAt(0)?.toUpperCase() || "";
  
  // 3. Fall back gracefully if next-themes hasn't fully loaded yet
  const isDarkMode = mounted ? theme === "dark" : false;

  function Start() {
    setSelected('Planner');
  }

  const backgroundImages: Record<string, string> = {
    Dashboard: "shapelift.jpg",
    Profile: "medals.jpg",
    Progress: "progress.jpg",
    Challenges: "challenge.jpg",
    Library: 'library.jpg'
  };

  return (
    <div className="relative h-screen w-screen flex overflow-hidden">
      
      {/* Background Image Container */}
      <div
        className="absolute inset-0 bg-cover bg-center  bg-no-repeat"
        style={{
          backgroundImage: `url(${
            isDarkMode 
              ? (backgroundImages[selected] || "shapelift.jpg") 
              : "lunges.jpg"
          })`,
        }}
      />

      {/* Dark + Blur Overlay */}
      <div className="absolute inset-0 dark:bg-[#121417]/88 dark:backdrop-blur-md backdrop-blur-[7px]" />

      {/* Main Content */}
      <div className="relative z-10 h-screen w-screen flex overflow-hidden">
        {/* Overlay */}
        {menuOpen && (
          <div
            className="fixed inset-0 bg-black/70 z-30 lg:hidden"
            onClick={() => setMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed lg:static top-0 left-0 z-40 h-screen w-72 bg-[#1E232B66] backdrop-blur-md flex flex-col lg:gap-6 gap-6 transform transition-transform duration-300
          ${menuOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
        >
          
          {/* Top */}
          <div className="p-6 flex items-center gap-2 lg:gap-1">
            <Image src={dashicon} alt="Dashboard Icon" className="lg:w-10 lg:h-7 w-5 h-5" />
            <h1 className="text-white lg:text-[30px] text-[20px] font-bold">
              Fitness
            </h1>
          </div>

          {/* Middle */}
          <nav className="flex flex-col gap-4 lg:gap-3 px-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = selected === item.name;
              return (
                <div
                  key={item.name}
                  onClick={() => {
                    setSelected(item.name);
                    setMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer border transition-all duration-200
                  ${
                    active
                      ? "border-[#2ED843] text-[#2ED843]"
                      : "border-transparent text-white"
                  }`}
                >
                  <Icon size={22} />
                  <span className="text-lg">{item.name}</span>
                </div>
              );
            })}
          </nav>

          {/* Bottom */}
          <div className="p-6 text-white border border-gray-600 lg:h-20 mb-6 mt-4 lg:mt-0 w-full flex ">
            <div className="flex items-center justify-center gap-3">
              {user ? (
                <div className="lg:w-10 lg:h-10 w-8 h-8 rounded-full bg-[#2ED843] flex items-center justify-center lg:text-[20px] text-[17px] text-black font-bold " >
                  {initial2 || initial}
                </div>
              ) : <div className="w-10 h-10 rounded-full bg-gray-500" />}
              <div className="flex flex-col">
                <h4 className="text-[15px] font-normal text-white">{user?.fullname || user?.name}</h4>
                <h4 className="text-[13px] font-normal text-white">{user?.email}</h4>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Area */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* Topbar */}
          <header className="h-20 border-b dark:border-gray-600 border-white flex items-center justify-between px-6">
            {/* Mobile Menu */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden text-[#2ED843] text-3xl"
            >
              {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>

            <div className="ml-auto flex items-center gap-5">
              <ModeToggle/>
              <FiSettings
                className="text-white text-2xl cursor-pointer"
                onClick={() => setSelected("Profile")}
              />
              <IoNotifications className="text-white text-2xl cursor-pointer" />
              {user ? (
                <div className="lg:w-10 lg:h-10 w-8 h-8 rounded-full bg-[#2ED843] flex items-center justify-center lg:text-[20px] text-[17px] font-bold text-black" >
                  {initial2 || initial}
                </div>
              ) : <div className="w-10 h-10 rounded-full bg-gray-500" />}
            </div>
          </header>

          {/* Scrollable Content */}
          <main className="flex-1 overflow-y-auto p-6">
            {selected === "Dashboard" && (
              <div className=" ">
                <Dashboard user={user} start={Start} />
              </div>
            )}

            {selected === "Planner" && (
              <div className="">
                <Planneer user={user} />
              </div>
            )}

            {selected === "Meal Guide" && (
              <div className=" text-white text-3xl font-bold">
                Meal Guide Page Content
              </div>
            )}

            {selected === "Progress" && (
              <div className=" ">
                <Progress />
              </div>
            )}

            {selected === "Challenges" && (
              <div className=" text-white text-3xl font-bold">
                <Challenges />
              </div>
            )}

            {selected === "Leaderboard" && (
              <div className=" text-white text-3xl font-bold">
                Leaderboard Page Content
              </div>
            )}

            {selected === "Library" && (
              <div className=" text-white text-3xl font-bold">
                <Libray />
              </div>
            )}

            {selected === "Profile" && (
              <div className=" text-3xl font-bold">
                <Profile />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}