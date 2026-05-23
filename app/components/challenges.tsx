import React from "react";
import { getBio, getSession } from "../lib/appwrite";
import { useState, useEffect } from "react";
import { useGlobalContext } from "../context/globalprovider";
import dumbbell from "../../public/dumbell.svg";
import Image from "next/image";
import Modal from "react-modal";
import { databases, appwriteConfig } from "../lib/appwrite";

Modal.setAppElement("body");

interface ChallengeObj {
  type: number;
  streak: number;
  completed: boolean;
  lastUpdated: string;
}

const Challenges = () => {
  const [data, setData] = useState<any>(null);
  const [data2, setData2] = useState<any>(null);
  const [restDays, setRestDays] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [blockModal, setBlockModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Challenge States
  const [activeChallenge, setActiveChallenge] = useState<number | null>(null);
  const [progressMap, setProgressMap] = useState<Record<number, number>>({});
  const [completedMap, setCompletedMap] = useState<Record<number, boolean>>({});
  const [selectedChallenge, setSelectedChallenge] = useState<number | null>(null);

  // Appwrite Aggregate Stat States
  const [totalWorkoutsTracked, setTotalWorkoutsTracked] = useState<number>(0);
  const [challengesCompletedCount, setChallengesCompletedCount] = useState<number>(0);

  const { user } = useGlobalContext();
  const challengeList = [5, 10, 15, 20];

  const fetchFreshAppwriteRecords = async () => {
    if (!user?.$id) return;
    try {
      const bioRes = await getBio(user.$id);
      setData(bioRes); 
      const sessionRes = await getSession(user.$id);
      setData2(sessionRes); 
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // INITIAL DATA MOUNT FETCH
  // =========================================
  useEffect(() => {
    if (user?.$id) {
      fetchFreshAppwriteRecords();
    }
  }, [user?.$id]);

  // Compute rest days
  useEffect(() => {
    if (!data?.schedule) return;
    const allDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const missingDays = allDays.filter((day) => !data.schedule.includes(day));
    setRestDays(missingDays);
  }, [data]);

  // =========================================
  // PARSE CHALLENGES & PROCESS METRICS
  // =========================================
  useEffect(() => {
    if (!data) return;

    const rawChallenges: string[] = data.challenges || [];
    
    // Parse Appwrite strings safely
    const challenges: ChallengeObj[] = rawChallenges.map((str) => {
      const [type, streak, completed, lastUpdated] = str.split("|");
      return {
        type: Number(type) || 0,
        streak: Number(streak) || 0,
        completed: completed === "true",
        lastUpdated: lastUpdated || "",
      };
    });

    // Compute aggregate metrics
    const completedCount = challenges.filter((c) => c.completed).length;
    const totalStreakVolume = challenges.reduce((sum, c) => sum + c.streak, 0);

    setChallengesCompletedCount(completedCount);
    setTotalWorkoutsTracked(totalStreakVolume);

    const active = challenges.find((c) => !c.completed);
    setActiveChallenge(active ? active.type : null);

    const newProgressMap: Record<number, number> = {};
    const newCompletedMap: Record<number, boolean> = {};
    
    challenges.forEach((c) => {
      newProgressMap[c.type] = c.streak;
      newCompletedMap[c.type] = c.completed;
    });
    
    setProgressMap(newProgressMap);
    setCompletedMap(newCompletedMap);
  }, [data]);

  // =========================================
  // ISOLATED BACKGROUND AUTOMATED PROGRESSION CHECK
  // =========================================
  // =========================================
// FIXED: BACKGROUND AUTOMATED PROGRESSION CHECK (WITH REST DAY PROTECTION)
// =========================================
useEffect(() => {
  if (!data || !data2?.documents?.[0] || !user?.$id) return;

  const rawChallenges: string[] = data.challenges || [];
  const completedEntries: string[] = data2.documents[0].completed || [];
  const todayStr = new Date().toDateString();

  const challenges: ChallengeObj[] = rawChallenges.map((str) => {
    const [type, streak, completed, lastUpdated] = str.split("|");
    return {
      type: Number(type) || 0,
      streak: Number(streak) || 0,
      completed: completed === "true",
      lastUpdated: lastUpdated || "",
    };
  });

  const active = challenges.find((c) => !c.completed);
  if (!active) return;

  const todayWorkoutFinished = completedEntries.some((entry) => {
    const [dateStr, status] = entry.split(":");
    return new Date(dateStr).toDateString() === todayStr && status === "completed";
  });

  let shouldUpdateBackend = false;
  let nextStreak = active.streak;
  let isFinished = active.completed;
  let trackingDateStamp = active.lastUpdated;

  // 1. FIRST: PASSIVE CHECK FOR HISTORICAL SKIPPED DAYS
  if (active.lastUpdated && active.lastUpdated !== todayStr) {
    const lastWorkoutDate = new Date(active.lastUpdated);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    let trackingDate = new Date(lastWorkoutDate);
    let skippedWorkoutDays = 0;

    while (trackingDate < yesterday) {
      trackingDate.setDate(trackingDate.getDate() + 1);
      
      const currentDayName = trackingDate.toLocaleDateString("en-US", { weekday: "long" });
      const trackingDateStr = trackingDate.toDateString();

      const wasDayCompleted = completedEntries.some(entry => {
        const [dateStr, status] = entry.split(":");
        return new Date(dateStr).toDateString() === trackingDateStr && status === "completed";
      });

      if (!wasDayCompleted && !restDays.includes(currentDayName)) {
        skippedWorkoutDays++;
      }
    }

    // If they missed a workout day in the past, drop them straight to 0
    if (skippedWorkoutDays > 0) {
      nextStreak = 0;
      trackingDateStamp = yesterday.toDateString(); // Moves baseline up to yesterday
      shouldUpdateBackend = true;
    }
  }

  // 2. SECOND: INCREMENT IF THEY FINISHED TODAY'S WORKOUT
  // FIXED: Check trackingDateStamp here so it knows if Step 1 already moved the timeline baseline forward
  if (todayWorkoutFinished && trackingDateStamp !== todayStr) {
    nextStreak = nextStreak + 1; 
    isFinished = nextStreak >= active.type;
    trackingDateStamp = todayStr;
    shouldUpdateBackend = true;
  }

  // 3. THIRD: SYNC CHANGES TO APPWRITE IF NEEDED
  if (shouldUpdateBackend) {
    const updatedRawStrings = challenges.map((c) => {
      if (c.type === active.type) {
        return `${c.type}|${nextStreak}|${isFinished}|${trackingDateStamp}`;
      }
      return `${c.type}|${c.streak}|${c.completed}|${c.lastUpdated}`;
    });

    databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.bioID,
      user.$id,
      { challenges: updatedRawStrings }
    ).then(() => {
      setData((prev: any) => ({ ...prev, challenges: updatedRawStrings }));
    }).catch(err => console.error("Failed to sync challenge progress:", err));
  }
}, [data2, user?.$id, restDays]); // Added restDays as a dynamic dependency// Decoupled dependencies prevent execution circular references

  const getButtonText = (days: number) => {
    if (completedMap[days]) return "Completed";
    if (activeChallenge === days) return "In Progress";
    return "Start Challenge";
  };

  // =========================================
  // ATOMIC ACTION METHOD
  // =========================================
  const handleStartChallenge = async () => {
    if (!selectedChallenge || !user?.$id) return;

    try {
      const freshBio = await getBio(user.$id);
      const existing: string[] = freshBio?.challenges || [];
      
      const freshSession = await getSession(user.$id);
      const completedEntries: string[] = freshSession?.documents?.[0]?.completed || [];
      const todayStr = new Date().toDateString();

      const parsedExistingChallenges = existing.map((str) => {
        const [type, , completed] = str.split("|");
        return { type: Number(type), completed: completed === "true" };
      });

      const hasActiveChallengeInDB = parsedExistingChallenges.some(c => !c.completed);

      if (hasActiveChallengeInDB) {
        setModalOpen(false);
        setBlockModal(true);
        return;
      }

      const todayWorkoutFinished = completedEntries.some((entry) => {
        const [dateStr, status] = entry.split(":");
        return new Date(dateStr).toDateString() === todayStr && status === "completed";
      });

      const initialStreak = todayWorkoutFinished ? 1 : 0;
      const isFinished = initialStreak >= selectedChallenge;

      const newChallengeString = `${selectedChallenge}|${initialStreak}|${isFinished}|${todayStr}`;
      const updatedChallenges = [...existing, newChallengeString];

      // Structural layout transaction directly targets Appwrite column fields
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.bioID,
        user.$id,
        { challenges: updatedChallenges }
      );

      // Perform optimistic UI state preservation seamlessly
      setData((prev: any) => ({ ...prev, challenges: updatedChallenges }));
      setModalOpen(false);
    } catch (err) {
      console.error("Critical error during Challenge initiation sequence:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-50">
        <p className="text-white/70 animate-pulse text-[15px]">Loading challenges...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* HEADER */}
      <div className="flex flex-col gap-2">
        <h4 className="lg:text-[20px] text-[17px] text-white font-semibold">Challenges</h4>
        <h4 className="lg:text-[16px] text-[15px] text-white font-normal">
          Complete Challenges to earn rewards
        </h4>
      </div>

      {/* METRICS RENDERING BLOCK */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md">
        <div className="flex flex-col gap-1">
          <span className="text-white/60 text-[12px] uppercase tracking-wider font-semibold">
            Challenge Workouts
          </span>
          <span className="text-2xl font-bold text-[#2ED843]">
            {totalWorkoutsTracked}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-white/60 text-[12px] uppercase tracking-wider font-semibold">
            Completed Milestones
          </span>
          <span className="text-2xl font-bold text-white">
            {challengesCompletedCount} / {challengeList.length}
          </span>
        </div>
        <div className="flex flex-col gap-1 col-span-2 md:col-span-1">
          <span className="text-white/60 text-[12px] uppercase tracking-wider font-semibold">
            Current Target
          </span>
          <span className="text-xl font-bold text-white/90">
            {activeChallenge ? `${activeChallenge} Day Challenge` : "None Active"}
          </span>
        </div>
      </div>

      {/* CARDS */}
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
        {challengeList.map((days) => (
          <div
            key={days}
            className="px-4 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg flex justify-center w-full min-h-[140px] gap-4"
          >
            {/* Added Next.js standard image dimension signatures to eliminate viewport flickering */}
            <div className="flex-shrink-0">
              <Image src={dumbbell} alt="Dumbbell Icon" width={40} height={40} />
            </div>

            <div className="flex flex-col gap-2 w-full justify-between">
              <h4 className="lg:text-[17px] text-[15px] text-white font-bold">
                Complete {days} Workouts
              </h4>

              {/* PROGRESS BAR */}
              {activeChallenge === days && (
                <div className="flex flex-col gap-1">
                  <p className="text-white text-[13px]">
                    {progressMap[days] || 0}/{days}
                  </p>
                  <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#2ED843] transition-all duration-300"
                      style={{
                        width: `${Math.min(((progressMap[days] || 0) / days) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* ACTION BUTTON */}
              <div className="flex items-end justify-end">
                <button
                  disabled={completedMap[days]}
                  onClick={() => {
                    if (activeChallenge !== null && activeChallenge !== days) {
                      setBlockModal(true);
                      return;
                    }
                    if (activeChallenge === days) {
                      return;
                    }
                    setSelectedChallenge(days);
                    setModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-md border border-white/10 text-[#2ED843] text-[14px] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {getButtonText(days)}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CONFIRMATION MODAL */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        style={{
          overlay: { backgroundColor: "rgba(0,0,0,0.7)", zIndex: 1000 },
          content: {
            background: "#111",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "16px",
            width: "90%",
            maxWidth: "420px",
            margin: "auto",
            inset: "50% auto auto 50%",
            transform: "translate(-50%, -50%)",
            padding: "24px",
            color: "white",
          },
        }}
      >
        <div className="flex flex-col gap-5">
          <h2 className="text-[22px] font-bold text-white">Start Challenge</h2>
          <p className="text-white/80 text-[15px] leading-relaxed">
            You are about to begin the{" "}
            <span className="text-[#2ED843] font-semibold">
              Complete {selectedChallenge} Workouts
            </span>{" "}
            challenge.
          </p>

          <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex flex-col gap-2">
            <p className="text-white text-[14px]">
              • Complete workouts for {selectedChallenge} valid days
            </p>
            <p className="text-white text-[14px]">• Rest days do not break your streak</p>
            <p className="text-white text-[14px]">• Missing a workout day resets progress</p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-md border border-white/10 text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleStartChallenge}
              className="px-4 py-2 rounded-md bg-[#2ED843] text-black font-semibold cursor-pointer"
            >
              Start
            </button>
          </div>
        </div>
      </Modal>

      {/* BLOCKED MODAL */}
      <Modal
        isOpen={blockModal}
        onRequestClose={() => setBlockModal(false)}
        style={{
          overlay: { backgroundColor: "rgba(0,0,0,0.7)", zIndex: 1000 },
          content: {
            background: "#111",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "16px",
            width: "90%",
            maxWidth: "420px",
            margin: "auto",
            inset: "50% auto auto 50%",
            transform: "translate(-50%, -50%)",
            padding: "24px",
            color: "white",
          },
        }}
      >
        <h2 className="text-white font-bold text-[18px]">A Challenge is Already currently Active</h2>
        <p className="text-white/80 mt-2">
          Finish your current challenge before starting a new one.
        </p>
        <button
          onClick={() => setBlockModal(false)}
          className="mt-4 px-4 py-2 bg-[#2ED843] text-black rounded-md font-semibold hover:opacity-90 transition"
        >
          OK
        </button>
      </Modal>
    </div>
  );
};

export default Challenges;