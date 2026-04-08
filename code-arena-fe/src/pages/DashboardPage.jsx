// codearena-frontend/code-arena-fe/src/pages/DashboardPage.jsx

import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import UserStats from "../components/dashboard/UserStats";
import ActionButtons from "../components/dashboard/ActionButton";
import JoinRoomModal from "../components/room/JoinRoomModal";
import CreateRoomModal from "../components/room/CreateRoomModal";
import RoomApi from "../services/RoomService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import UserProfileApi from "../services/UserProfileService";

export default function DashboardPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    let mounted = true;
    const fetchUserProfile = async () => {
      try {
        const response = await UserProfileApi.getUserProfile();
        if (mounted) {
          setUserProfile(response.data);
        }
      } catch (error) {
        console.error("❌ Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
    return () => { mounted = false; };
  }, []);

  const handleCreateRoom = async (roomData) => {
    try {
      const response = await RoomApi.createRoom(roomData);
      if (response.data.questionType === "MCQ Question") {
        navigate("/mcq-waiting-room/" + response.data.roomCode);
      } else {
        navigate("/coding-waiting-room/" + response.data.roomCode);
      }
      toast.success("🎉 Room created successfully!");
    } catch (error) {
      const message = error?.response?.data?.message || "Something went wrong while creating the room.";
      toast.error(`⚠️ ${message}`);
    }
  };

  const handleJoinRoom = async (roomId) => {
    try {
      const response = await RoomApi.joinRoom(roomId);
      if (response.questionType === "MCQ Question") {
        navigate("/mcq-waiting-room/" + roomId);
      } else {
        navigate("/coding-waiting-room/" + roomId);
      }
    } catch (error) {
      console.error("❌ Error joining room:", error);
      toast.error("Failed to join room.");
    }
  };

  if (!userProfile) {
    return <div className="text-center p-10 text-primary animate-pulse">Loading Arena...</div>;
  }

  return (
    <div className="min-h-screen bg-bg text-text font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-transparent blur-3xl" />
      <Navbar user={userProfile} />

      <main className="px-6 md:px-16 py-12 relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-display font-bold">
            Welcome back, <span className="text-primary">{userProfile?.name}</span> 👋
          </h2>
          <div className="flex flex-col items-center gap-2 mt-2">
            <p className="text-muted">Ready to battle, learn, and climb the leaderboard?</p>
            {/* Added dynamic link to Leaderboard */}
            <button 
              onClick={() => navigate("/leaderboard")}
              className="text-secondary font-semibold hover:underline flex items-center gap-1 transition-all"
            >
              🏆 View Global Leaderboard
            </button>
          </div>
        </div>

        <UserStats user={userProfile} />
        
        <ActionButtons
          onCreate={() => setShowCreateModal(true)}
          onJoin={() => setShowJoinModal(true)}
          onPractice={() => navigate("/practice")}
        />

        <CreateRoomModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateRoom}
        />

        <JoinRoomModal
          isOpen={showJoinModal}
          onClose={() => setShowJoinModal(false)}
          onJoin={handleJoinRoom}
        />
      </main>
    </div>
  );
}