import React, { useState } from "react";
import { ChevronDown, LogOut, User, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar({ user }) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="flex justify-between items-center px-8 py-5 border-b border-border bg-surface/60 backdrop-blur-lg shadow-shadow-soft relative z-50">
      {/* Logo */}
      <h1 className="text-2xl font-display font-extrabold tracking-wide">
        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          CodeArena
        </span>
      </h1>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        {/* Leaderboard Shortcut */}
        <a
          // href="#leaderboard"
          className="flex items-center gap-2 text-muted text-sm font-medium hover:text-primary transition-colors hover:underline cursor-pointer"
        >
          <Trophy size={18} />
          Leaderboard
        </a>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 bg-surface/70 border border-border px-3 py-2 rounded-radius-lg hover:bg-surface/90 transition-all"
          >
            <img
              src={
                user?.avatar ||
                `https://api.dicebear.com/7.x/identicon/svg?seed=${user?.name}`
              }
              alt="profile"
              className="w-8 h-8 rounded-full border border-primary/40"
            />
            <span className="text-sm font-medium">{user?.name}</span>
            <ChevronDown
              size={16}
              className={`transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-44 bg-surface border border-border rounded-radius-lg shadow-shadow-strong overflow-hidden"
              >
                <div className="flex flex-col text-sm text-muted">
                  <button className="flex items-center gap-2 px-4 py-3 hover:bg-surface/80 transition-colors text-left">
                    <User size={16} /> View Profile
                  </button>
                  <button className="flex items-center gap-2 px-4 py-3 hover:bg-surface/80 transition-colors text-left">
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}
