// src/components/dashboard/UserStats.jsx

import React from "react";
import { Trophy, Sword, ShieldAlert, Swords } from "lucide-react";
import { motion } from "framer-motion";

export default function UserStats({ user }) {
  // Debugging log to verify the dynamic data from backend
  console.log("Dashboard User Data:", user);

  const stats = [
    { 
      label: "Global Rank", 
      value: `#${user?.userRank || "N/A"}`, 
      icon: <Trophy />, 
      color: "text-yellow-400" 
    },
    { 
      label: "Total Battles", 
      value: user?.totalBattle || 0, 
      icon: <Swords />, 
      color: "text-primary" 
    },
    { 
      label: "Wins", 
      value: user?.totalWin || 0, 
      icon: <Sword />, 
      color: "text-green-400" 
    },
    { 
      label: "Losses", 
      value: user?.totalLoss || 0, 
      icon: <ShieldAlert />, 
      color: "text-red-400" 
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.05 }}
          className="bg-surface/70 backdrop-blur-md border border-border p-6 rounded-radius-lg shadow-shadow-soft flex flex-col items-center justify-center text-center transition-all hover:border-primary/40"
        >
          <div className={`${stat.color} mb-3`}>{stat.icon}</div>
          <h3 className="text-2xl font-bold font-display">{stat.value}</h3>
          <p className="text-muted text-sm font-medium mt-1">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
}