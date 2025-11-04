import React from "react";

export default function RecentBattles({ battles }) {
  return (
    <section className="mb-24">
      <h3 className="text-2xl font-display font-semibold mb-6 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Recent Battles
      </h3>
      <div className="bg-surface/60 backdrop-blur-md border border-border rounded-radius-lg shadow-shadow-soft p-6">
        {battles.map((b, i) => (
          <div
            key={i}
            className="flex justify-between py-3 border-b border-border/50 last:border-0 text-sm"
          >
            <span className="text-text">{b.opponent}</span>
            <span className="text-muted">{b.type}</span>
            <span
              className={
                b.result === "Win" ? "text-success" : "text-error"
              }
            >
              {b.result}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
