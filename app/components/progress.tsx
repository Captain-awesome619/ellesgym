import React, { useEffect, useState, useMemo } from "react";
import { useGlobalContext } from "@/app/context/globalprovider";
import { getSession } from "@/app/lib/appwrite";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import { useRecords } from "../store/records";
import { gethabits } from "@/app/lib/appwrite";

const Progress = () => {
  const { user } = useGlobalContext();

  const [data2, setData2] = useState<any>(null);
  const [data, setData] = useState<any>(null);

  const { completeCount, currentStreakk } = useRecords();

  // ======================================
  // FETCH WORKOUT SESSION
  // ======================================
  useEffect(() => {
    const fetchroutine = async (): Promise<void> => {
      try {
        const posts = await getSession(user.$id);
        setData2(posts);
      } catch (err) {
        console.log(err);
      }
    };

    if (user?.$id) {
      fetchroutine();
    }
  }, [user?.$id]);

  // ======================================
  // FETCH HABITS
  // ======================================
  useEffect(() => {
    if (!user?.$id) return;

    const fetchHabits = async () => {
      try {
        const posts = await gethabits(user.$id);
        setData(posts);
      } catch (err) {
        console.log(err);
      }
    };

    fetchHabits();
  }, [user?.$id]);

  // ======================================
  // PARSE COMPLETED WORKOUTS
  // ======================================
  const parseCompleted = (arr: string[] = []) => {
    return arr.map((item) => {
      const [date, status] = item.split(":");
      return { date, status };
    });
  };

  // ======================================
  // GET LAST 7 DAYS
  // ======================================
  const last7Days = useMemo(() => {
    const days = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toDateString());
    }

    return days;
  }, []);

  // ======================================
  // WORKOUT BAR CHART DATA
  // ======================================
  const chartData = useMemo(() => {
    const completedData = parseCompleted(
      data2?.documents?.[0]?.completed || []
    );

    return last7Days.map((day) => {
      const match = completedData.find((d) => d.date === day);

      return {
        day: new Date(day).toLocaleDateString("en-US", {
          weekday: "short",
        }),

        status: match?.status || "uncompleted",

        value: match?.status === "completed" ? 1 : 0,
      };
    });
  }, [data2, last7Days]);

  // ======================================
  // HABIT LINE GRAPH DATA
  // ======================================
 const habitChartData = useMemo(() => {
  const habits = data?.habits || [];

  let count = 0;

  return habits.map((item: string) => {
    const [date, status] = item.split(":");

    if (status?.trim() === "completed") {
      count += 1;
    }

    return {
      date: date.trim(),
      value: count,
    };
  });
}, [data]);

  return (
    <div className="flex flex-col gap-4">
      <h4 className="font-normal lg:text-[20px] text-[18px] text-white">
        Track your progress and trends
      </h4>

      <div className="flex gap-4 items-center">
        <div className="px-4 py-2 dark:bg-white/5 bg-black/70 dark:backdrop-blur-md backdrop-blur-sm rounded-lg flex flex-col items-center justify-center w-70 h-30 gap-3">
          <h4 className="font-normal lg:text-[15px] text-[15px] text-white">
            Total Workouts Completed
          </h4>

          <h4 className="font-normal lg:text-[18px] text-[16px] text-[#2ED843]">
            {completeCount}
          </h4>
        </div>

        <div className="px-4 py-2 dark:bg-white/5 bg-black/70 dark:backdrop-blur-md backdrop-blur-sm rounded-lg flex flex-col items-center justify-center w-70 h-30 gap-3">
          <h4 className="font-normal lg:text-[15px] text-[15px] text-white">
            Current Streak
          </h4>

          <h4 className="font-normal lg:text-[18px] text-[16px] text-[#2ED843]">
            {currentStreakk}
          </h4>
        </div>
      </div>

      {/* ====================================== */}
      {/* CHARTS */}
      {/* ====================================== */}

      <div className="flex lg:flex-row flex-col gap-4">
        {/* WORKOUT BAR CHART */}
        <div className="lg:w-[50%] lg:h-120 dark:bg-white/5 bg-black/70 dark:backdrop-blur-md backdrop-blur-sm h-70 border border-white/10 rounded-xl p-4">
          <h2 className="text-white font-bold mb-4">
          Workout Weekly Progress
          </h2>

          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#333"
              />

              <XAxis dataKey="day" stroke="#fff" />

              <YAxis hide />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#111",
                  border: "1px solid #2ED843",
                  color: "#fff",
                }}
              />

              <Bar
                dataKey="value"
                fill="#2ED843"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* HABIT LINE GRAPH */}
        <div className="lg:w-[50%] lg:h-120 dark:bg-white/5 bg-black/70 dark:backdrop-blur-md backdrop-blur-sm h-70 border border-white/10 rounded-xl p-4">
          <h2 className="text-white font-bold mb-4">
           Habit Trend
          </h2>

          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={habitChartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#333"
              />

              <XAxis
                dataKey="date"
                stroke="#fff"
                tick={{ fill: "#fff", fontSize: 12 }}
              />

              <YAxis
                stroke="#fff"
                domain={[0, 20]}
                ticks={[0, 1, 5, 10, 15, 20]}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#111",
                  border: "1px solid #2ED843",
                  color: "#fff",
                }}
              />

              <Line
                type="monotone"
                dataKey="value"
                stroke="#2ED843"
                strokeWidth={4}
                dot={{
                  r: 5,
                  fill: "#2ED843",
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Progress;