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

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuOpen]);


 const { loading, isLogged,setUser,setIsLogged,user } = useGlobalContext()

  return (
    <div className="relative h-screen w-screen flex overflow-hidden">
     
     
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('shapelift.jpg')",
        }}
      />

      {/* Dark + Blur Overlay */}
      <div className="absolute inset-0 bg-[#121417]/90 backdrop-blur-md" />

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
          className={`fixed lg:static top-0 left-0 z-40 h-screen w-72 bg-[#1E232B66] backdrop-blur-md flex flex-col justify-between transform transition-transform duration-300
          ${menuOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
        >
          {/* Top */}
          <div className="p-6 flex items-center gap-3">
            <Image src={dashicon} alt="Dashboard Icon" className="w-5 h-5" />
            <h1 className="text-white lg:text-[30px] text-[18px] font-bold">
              Fitness
            </h1>
          </div>

          {/* Middle */}
          <nav className="flex flex-col gap-3 px-4">
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
          <div className="p-6 text-white border border-gray-600 lg:h-20 mb-4 w-full flex ">
            
          <div className="flex items-center justify-center gap-3">
{user?.avatar ? (
  <Image
    src={user.avatar}
    alt="User Avatar"
    width={40}
    height={40}
    className="rounded-full "
  />
) :  <div className="w-10 h-10 rounded-full bg-gray-500" />}
<div className="flex flex-col">
<h4 className="text-[15px] font-normal text-white">{user?.fullname}</h4>
<h4 className="text-[15px] font-normal text-white">{user?.email}</h4>
</div>
          </div>
            
            </div>
        </aside>

        {/* Main Area */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* Topbar */}
          <header className="h-20 border-b border-gray-600 flex items-center justify-between px-6">
            {/* Mobile Menu */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden text-[#2ED843] text-3xl"
            >
              {menuOpen ? <FiX /> : <FiMenu />}
            </button>

            <div className="ml-auto flex items-center gap-5">
              
              <FiSettings className="text-white text-2xl cursor-pointer" />
              <IoNotifications className="text-white text-2xl cursor-pointer" />
              {user?.avatar ? (
  <Image
    src={user.avatar}
    alt="User Avatar"
    width={40}
    height={40}
    className="rounded-full "
  />
) :  <div className="w-10 h-10 rounded-full bg-gray-500" />}
             
            </div>
          </header>

          {/* Scrollable Content */}
          <main className="flex-1 overflow-y-auto p-6">
            {selected === "Dashboard" && (
              <div className="min-h-375 text-white text-3xl font-bold">
                Dashboard Page Content
              </div>
            )}

            {selected === "Planner" && (
              <div className="min-h-375 text-white text-3xl font-bold">
                Planner Page Content
              </div>
            )}

            {selected === "Meal Guide" && (
              <div className="min-h-375 text-white text-3xl font-bold">
                Meal Guide Page Content
              </div>
            )}

            {selected === "Progress" && (
              <div className="min-h-375 text-white text-3xl font-bold">
                Progress Page Content
              </div>
            )}

            {selected === "Challenges" && (
              <div className="min-h-375 text-white text-3xl font-bold">
                Challenges Page Content
              </div>
            )}

            {selected === "Leaderboard" && (
              <div className="min-h-375 text-white text-3xl font-bold">
                Leaderboard Page Content
              </div>
            )}

            {selected === "Library" && (
              <div className="min-h-375 text-white text-3xl font-bold">
                Library Page Content
              </div>
            )}

            {selected === "Profile" && (
              <div className="min-h-375 text-white text-3xl font-bold">
                Profile Page Content
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}