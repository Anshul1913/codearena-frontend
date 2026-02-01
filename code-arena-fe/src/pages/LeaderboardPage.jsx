// codearena-frontend/code-arena-fe/src/pages/LeaderboardPage.jsx

import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import UserProfileApi from "../services/UserProfileService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function LeaderboardPage() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await UserProfileApi.getLeaderboard();
        setPlayers(response.data); 
      } catch (error) {
        console.error("❌ Leaderboard Error:", error);
        toast.error("Failed to load rankings");
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  // ✅ New Efficiency Calculation (Score excluded)
  // Formula: (Wins * 100) - (Losses * 20) + (TotalBattles * 1)
  const calculateEfficiency = (p) => {
    return (p.totalWin * 100) - (p.totalLoss * 20) + (p.totalBattle * 1);
  };

  return (
    <div className="min-h-screen bg-bg text-text font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-transparent blur-3xl" />
      <Navbar />

      <main className="px-6 md:px-16 py-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          <button 
            onClick={() => navigate(-1)} 
            className="mb-6 flex items-center gap-2 text-muted hover:text-primary transition-colors"
          >
            ← Back to Dashboard
          </button>

          <div className="text-center mb-10">
            <h2 className="text-4xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent uppercase tracking-widest">
              🏆 Hall of Fame
            </h2>
            <p className="text-muted mt-2">Elite Warriors ranked by Battle Efficiency</p>
          </div>

          <div className="bg-surface/60 backdrop-blur-md border border-border rounded-radius-lg shadow-shadow-soft overflow-hidden">
            {/* Updated Grid: 7 columns (Score Removed) */}
            <div className="grid grid-cols-7 text-[10px] md:text-xs font-semibold text-muted bg-surface/80 p-4 border-b border-border uppercase tracking-wider text-center">
              <span className="text-left">Rank</span>
              <span className="text-left">Warrior</span>
              <span className="col-span-2 text-left pl-4">Gmail</span>
              <span>Battles</span>
              <span>Win/Loss</span>
              <span className="text-secondary">Efficiency</span>
            </div>

            {loading ? (
              <div className="p-20 text-center text-primary animate-pulse font-medium">
                Evaluating Arena Performance...
              </div>
            ) : (
              players.map((player) => {
                const efficiency = calculateEfficiency(player);
                
                return (
                  <div
                    key={player.id}
                    className="grid grid-cols-7 p-5 border-b border-border/50 last:border-0 hover:bg-white/5 transition-all items-center text-center"
                  >
                    {/* Rank */}
                    <span className={`text-xl font-bold text-left ${
                      player.userRank === 1 ? "text-yellow-400" : 
                      player.userRank === 2 ? "text-gray-300" : 
                      player.userRank === 3 ? "text-orange-400" : "text-primary"
                    }`}>
                      #{player.userRank}
                    </span>

                    {/* Name */}
                    <span className="font-semibold text-left truncate pr-2">{player.name}</span>

                    {/* Gmail */}
                    <span className="col-span-2 text-left pl-4 text-muted text-sm truncate pr-4">
                      {player.email}
                    </span>

                    {/* Total Battles */}
                    <span className="font-medium text-text">{player.totalBattle}</span>

                    {/* Win/Loss Record */}
                    <div className="text-sm font-medium">
                      <span className="text-green-400">{player.totalWin}W</span>
                      <span className="mx-1 text-muted">/</span>
                      <span className="text-red-400">{player.totalLoss}L</span>
                    </div>

                    {/* ✅ Efficiency Rating Column */}
                    <span className={`font-display font-bold text-xl ${efficiency >= 0 ? 'text-secondary' : 'text-red-500'}`}>
                      {efficiency}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}