import React from "react";
import { Trophy, Sword, KeyRound, Flame } from "lucide-react";
import { motion } from "framer-motion";

export default function UserStats({ user }) {
  const stats = [
    { label: "Rank", value: `#${user.rank}`, icon: <Trophy /> },
    { label: "Wins", value: user.wins, icon: <Sword /> },
    { label: "Losses", value: user.losses, icon: <KeyRound /> },
    // { label: "Streak", value: `${user.streak}🔥`, icon: <Flame /> },
  ];

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.05 }}
          className="bg-surface/70 backdrop-blur-md border border-border p-6 rounded-radius-lg shadow-shadow-soft flex flex-col items-center justify-center text-center"
        >
          <div className="text-primary mb-2">{stat.icon}</div>
          <h3 className="text-xl font-semibold font-display">{stat.value}</h3>
          <p className="text-muted text-sm">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
