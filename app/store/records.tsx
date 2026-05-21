import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WorkoutStore {
  completeCount: number;
  longestStreakk: number;

  setComplete: (value: number) => void;
  setLongestStreak: (value: number) => void;
}

export const useRecords = create<WorkoutStore>()(
  persist(
    (set) => ({
      completeCount: 0,
      longestStreakk: 0,

      setComplete: (value) =>
        set({ completeCount: value }),

      setLongestStreak: (value) =>
        set({ longestStreakk: value }),
    }),
    {
      name: "workout-storage",
    }
  )
);