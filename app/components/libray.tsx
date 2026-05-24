import React, { useState } from "react";
import { EXERCISE_GUIDES } from "./utils/data2";
import { IoSearchSharp } from "react-icons/io5";

const Libray = () => {
  const [selected, setSelected] = useState("All");
  const [search, setSearch] = useState("");

  const options = ["All", "Triceps", "Glutes", "Core", "Legs", "Back"];

  // 1. Filter by muscle group
  const muscleFiltered =
    selected === "All"
      ? EXERCISE_GUIDES
      : EXERCISE_GUIDES.filter((exercise) =>
          exercise.musclesWorked.some(
            (m) => m.group.toLowerCase() === selected.toLowerCase()
          )
        );

  // 2. Filter by search (header)
  const filteredExercises = muscleFiltered.filter((exercise) =>
    exercise.header.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:gap-4 gap-6">
      <h4 className="lg:text-[21px] text-[18px] text-white font-semibold">
        Browse and learn exercises
      </h4>

      {/* SEARCH */}
      <div className="flex items-center justify-center lg:gap-5 pl-2 bg-[#00000080] rounded-md border-[#00000080] border gap-1 h-14">
        <IoSearchSharp className="text-[#2ED843] lg:text-[20px] text-[18px]" />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="outline-none bg-transparent px-2 text-[#ffffff] placeholder:text-white/40 placeholder:font-normal placeholder:text-[18px] w-full text-[15px]"
          placeholder="Search exercise (e.g. Squats, Push-ups)"
        />
      </div>

      {/* FILTER OPTIONS */}
      <div className="flex lg:gap-8 flex-wrap gap-4">
        {options.map((option) => {
          const isActive = selected === option;

          return (
            <div
              key={option}
              onClick={() => setSelected(option)}
              className={`cursor-pointer px-5 py-2 rounded-xl border border-black transition-all duration-200 lg:text-[18px] text-[14px]
              ${
                isActive
                  ? "text-[#2ED843] bg-linear-to-r  from-[#D9D9D9]/40 via-[#737373]/30 to-[#00000080]/40  "
                  : "text-white bg-linear-to-r from-[#D9D9D9]/40 via-[#737373]/30 to-[#00000080]/40"
              }`}
            >
              {option}
            </div>
          );
        })}
      </div>

      {/* GRID OR EMPTY STATE */}
      {filteredExercises.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-60 rounded-xl border border-[#2ED843] bg-black/40 text-white">
          <p className="text-[#2ED843] font-semibold text-lg">
            Exercise not found
          </p>
          <p className="text-white/60 text-sm mt-2">
            Try searching another exercise name
          </p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
          {filteredExercises.map((exercise, index) => (
            <div key={index}>
              <div className="flex flex-col gap-4 bg-white/5 backdrop-blur-md border border-white/10 h-90 rounded-lg">
                <div
                  className="w-full h-[70%]"
                  style={{
                    backgroundImage: `url(${
                      exercise.piture || "shapelift.jpg"
                    })`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                />

                <div className="flex justify-between items-center px-4">
                  <div className="flex flex-col gap-3">
                    <h5 className="text-white font-semibold lg:text-[18px] text-[16px]">
                      {exercise.header}
                    </h5>

                    <p className="text-white/60 lg:text-[16px] text-[14px] font-normal">
                      {exercise.musclesWorked
                        .map((muscle) => muscle.group)
                        .join(" • ")}
                    </p>
                  </div>

                  <button className="px-6 py-2 rounded-md bg-[#2ED843] text-black font-semibold cursor-pointer text-[15px]">
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Libray;