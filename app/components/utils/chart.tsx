import React, { ReactElement, useEffect, useState, useMemo } from "react";
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
} from "recharts";

const Chart = (): ReactElement => {
  const { user } = useGlobalContext();
  const [data2, setData2] = useState<any>(null);

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
  // PARSE APPWRITE DATA
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
  // BUILD CHART DATA
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
  // UI
  // ======================================
  return (
    <div className="w-full lg:h-120 bg-white/5 backdrop-blur-md h-70 border-white/10 rounded-xl p-4">
      <h2 className="text-white font-bold mb-4">
        Weekly Progress
      </h2>

      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />

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
  );
};

export default Chart;