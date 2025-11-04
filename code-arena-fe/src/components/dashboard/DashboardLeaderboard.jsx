import React from "react";

export default function DashboardLeaderboard({ players }) {
  return (
    <section id="leaderboard" className="mb-16">
      <h3 className="text-2xl font-display font-semibold mb-6 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Top Players
      </h3>
      <div className="bg-surface/60 backdrop-blur-md border border-border rounded-radius-lg shadow-shadow-soft p-6">
        <div className="grid grid-cols-4 text-sm font-medium text-muted border-b border-border pb-2 mb-3">
          <span>Rank</span>
          <span>Player</span>
          <span>Wins</span>
          <span>Streak</span>
        </div>
        {players.map((p) => (
          <div
            key={p.rank}
            className="grid grid-cols-4 py-2 border-b border-border/50 last:border-0"
          >
            <span className="text-primary">#{p.rank}</span>
            <span>{p.name}</span>
            <span>{p.wins}</span>
            <span>{p.streak}🔥</span>
          </div>
        ))}
      </div>
    </section>
  );
}
