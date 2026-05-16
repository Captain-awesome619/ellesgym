import React, { useState, useEffect } from "react";
import { FiPlus } from "react-icons/fi";
import { HiOutlineDotsVertical } from "react-icons/hi";
import ClipLoader from "react-spinners/ClipLoader";
import { useGlobalContext } from "@/app/context/globalprovider";
import { databases, appwriteConfig } from "@/app/lib/appwrite";
import { gethabits } from "@/app/lib/appwrite";

const HabitChecklist = ({ data }: any) => {
  const { user } = useGlobalContext();
  const [data2, setData2] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [habits, setHabits] = useState([
    { id: 1, text: "Stretch", checked: false },
    { id: 2, text: "Hydrate", checked: false },
    { id: 3, text: "Walk", checked: false },
  ]);

  const [showMenu, setShowMenu] = useState<number | null>(null);
  const [newHabit, setNewHabit] = useState("");

  // =========================================
  // FETCH APPWRITE DATA
  // =========================================
  useEffect(() => {
    if (!user?.$id) return;

    const fetchHabits = async () => {
      try {
        const posts = await gethabits(user.$id);
        setData2(posts);
      } catch (err) {
        console.log(err);
      }
    };

    fetchHabits();
  }, [user?.$id]);

  // =========================================
  // LOCAL STORAGE (ONLY FOR UI HABITS)
  // =========================================
  const habitsKey = `habits_${user?.$id || "guest"}`;

  useEffect(() => {
    const savedHabits = localStorage.getItem(habitsKey);

    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }
  }, [habitsKey]);

  const saveHabits = (updated: any[]) => {
    setHabits(updated);
    localStorage.setItem(habitsKey, JSON.stringify(updated));
  };

  // =========================================
  // 🔥 COMPLETED TODAY FROM APPWRITE (FIX)
  // =========================================
  const today = new Date().toISOString().split("T")[0];

  const completedToday =
    data2?.habits?.some((item: string) =>
      item.startsWith(today)
    ) ?? false;

  // =========================================
  // TOGGLE HABIT
  // =========================================
  const toggleHabit = (id: number) => {
    if (completedToday) return;

    const updated = habits.map((habit) =>
      habit.id === id ? { ...habit, checked: !habit.checked } : habit
    );

    saveHabits(updated);
  };

  // =========================================
  // ADD HABIT
  // =========================================
  const addHabit = () => {
    if (!newHabit.trim()) return alert("Habit cannot be empty");

    const updated = [
      ...habits,
      { id: Date.now(), text: newHabit, checked: false },
    ];

    saveHabits(updated);
    setNewHabit("");
  };

  // =========================================
  // DELETE HABIT
  // =========================================
  const deleteHabit = (id: number) => {
    const updated = habits.filter((h) => h.id !== id);
    saveHabits(updated);
    setShowMenu(null);
  };

  // =========================================
  // EDIT HABIT
  // =========================================
  const editHabit = (id: number) => {
    const habit = habits.find((h) => h.id === id);
    if (!habit) return;

    const updatedText = prompt("Edit habit", habit.text);
    if (!updatedText) return;

    const updated = habits.map((h) =>
      h.id === id ? { ...h, text: updatedText } : h
    );

    saveHabits(updated);
    setShowMenu(null);
  };

  // =========================================
  // DONE BUTTON (APPWRITE ONLY)
  // =========================================
  const submitHabits = async () => {
    try {
      setLoading(true);

      const allCompleted = habits.every((h) => h.checked);
      if (!allCompleted) {
        setLoading(false);
        return alert("Complete all habits first");
      }

      const entry = `${today}: completed`;

      try {
        const existing = await databases.getDocument(
          appwriteConfig.databaseId,
          appwriteConfig.habitID,
          user.$id
        );

        const updatedHabits = [...(existing.habits || []), entry];

        await databases.updateDocument(
          appwriteConfig.databaseId,
          appwriteConfig.habitID,
          user.$id,
          {
            habits: updatedHabits,
            users: user.$id,
          }
        );
      } catch {
        await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.habitID,
          user.$id,
          {
            habits: [entry],
            users: user.$id,
          }
        );
      }

      const reset = habits.map((h) => ({ ...h, checked: false }));
      saveHabits(reset);

      alert("Done for today 🎉 Check back tomorrow!");
      const updatedEntry = `${today}: completed`;

setData2((prev: any) => {
  if (!prev?.habits) {
    return {
      ...prev,
      habits: [updatedEntry],
    };
  }

  return {
    ...prev,
    habits: [...prev.habits, updatedEntry],
  };
});
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // UI (UNCHANGED)
  // =========================================
  return (
    <div className=" bg-white/10 backdrop-blur-none border border-white/10 rounded-2xl lg:w-80 w-full lg:min-h-125 p-5 flex flex-col">
      <h2 className="text-white font-bold text-[22px] mb-6">
        Habit Checklist
      </h2>

      <div className={`flex flex-col ${completedToday ? "" : "flex-1"}`}>
        {habits.map((habit) => (
          <div
            key={habit.id}
            className="flex items-center justify-between py-4 border-b border-gray-500/40"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={habit.checked}
                disabled={completedToday}
                onChange={() => toggleHabit(habit.id)}
                className={`w-4 h-4 accent-[#2ED843] ${
                  completedToday
                    ? "cursor-not-allowed opacity-40"
                    : "cursor-pointer"
                }`}
              />

              <h4
                className={`text-[15px] font-medium ${
                  habit.checked
                    ? "text-[#2ED843] line-through"
                    : "text-white"
                }`}
              >
                {habit.text}
              </h4>
            </div>

            <div className="relative">
              <button
                disabled={completedToday}
                onClick={() =>
                  setShowMenu(showMenu === habit.id ? null : habit.id)
                }
              >
                <HiOutlineDotsVertical size={18} className="cursor-pointer" />
              </button>

              {showMenu === habit.id && (
                <div className="absolute right-0 top-7 bg-[#111] border border-white/10 rounded-lg w-28">
                  <button
                    onClick={() => editHabit(habit.id)}
                    className="w-full px-4 py-2 text-white hover:bg-white/10"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteHabit(habit.id)}
                    className="w-full px-4 py-2 text-red-400 hover:bg-white/10"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {!completedToday && habits.length < 5 && (
        <div className="mt-5 flex flex-col gap-3">
          <input
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            placeholder="New habit"
            className="bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white"
          />
          <button
            onClick={addHabit}
            className="flex items-center justify-center gap-2 border border-[#2ED843] text-[#2ED843] py-3 rounded-lg font-semibold hover:bg-[#2ED843]/10 transition cursor-pointer"
          >
            <FiPlus /> Add Habit
          </button>
        </div>
      )}

      {completedToday ? (
        <div className="mt-5 text-center text-[#2ED843] border border-white/10 p-4 rounded-lg font-normal">
          🎉 You're done for today <br />
          Come back tomorrow to continue your streak
        </div>
      ) : (
        <button
          onClick={submitHabits}
          disabled={loading}
          className="mt-6 bg-[#2ED843] text-black font-bold py-3 rounded-lg"
        >
          {loading ? (
            <ClipLoader color="black" size={20} />
          ) : (
            "Done"
          )}
        </button>
      )}
    </div>
  );
};

export default HabitChecklist;  