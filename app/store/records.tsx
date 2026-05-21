import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WorkoutStore {
  completeCount: number;
  longestStreakk: number;
currentStreakk: number;
  setComplete: (value: number) => void;
  setLongestStreak: (value: number) => void;
  setCurrentStreak: (value: number) => void;
}

export const useRecords = create<WorkoutStore>()(
  persist(
    (set) => ({
      completeCount: 0,
      longestStreakk: 0,
      currentStreakk: 0,
      setComplete: (value) =>
        set({ completeCount: value }),

      setLongestStreak: (value) =>
        set({ longestStreakk: value }),

      setCurrentStreak: (value) =>
        set({ currentStreakk: value }),
    }),
    {
      name: "workout-storage",
    }
  )
);