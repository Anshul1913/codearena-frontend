import React, { useState } from "react";
import Navbar from "../components/Navbar";
import UserStats from "../components/dashboard/UserStats";
import ActionButtons from "../components/dashboard/ActionButton";
import DashboardLeaderboard from "../components/dashboard/DashboardLeaderBoard";
import RecentBattles from "../components/dashboard/RecentBattles";
import JoinRoomModal from "../components/room/JoinRoomModal";
import CreateRoomModal from "../components/room/CreateRoomModal";
import RoomApi from "../services/RoomService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const user = { name: "Anshul", rank: 12, wins: 42, losses: 18, streak: 5 };
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
const navigate = useNavigate();
  const handleCreateRoom = async(roomData) => {
    
    try {
    console.log("Creating room with:", roomData);
    const response = await RoomApi.createRoom(roomData);
      if(response.data.questionType === "MCQ Question"){
        navigate("/mcq-waiting-room/"+response.data.roomCode);
        // navigate("/mcq-room/"+response.data.roomCode);
      }
    toast.success("🎉 Room created successfully!");
    console.log("Room creation response:", response);

    // Optional: navigate or update UI
    // navigate(`/room/${response.roomId}`);

  } catch (error) {
    console.error("❌ Error creating room:", error);

    // Try to extract readable message from backend
    const message =
      error?.response?.data?.message ||
      "Something went wrong while creating the room.";

    toast.error(`⚠️ ${message}`);
  }
  };

  const handleJoinRoom = async(roomId) => {
    console.log("Joining room:", roomId);
    try {
    const response = await RoomApi.joinRoom(roomId);
    console.log("Join room response:", response);
    navigate("/mcq-waiting-room/"+roomId);
    } catch (error) {
      console.error("❌ Error joining room:", error);
    }

  };
  //   const players = [
  //     { rank: 1, name: "Aarav", wins: 120, streak: 10 },
  //     { rank: 2, name: "Riya", wins: 98, streak: 8 },
  //     { rank: 3, name: "Karan", wins: 90, streak: 6 },
  //   ];

  //   const battles = [
  //     { opponent: "Riya", type: "Coding", result: "Win" },
  //     { opponent: "Aarav", type: "Quiz", result: "Loss" },
  //     { opponent: "Karan", type: "Coding", result: "Win" },
  //   ];

  return (
    <div className="min-h-screen bg-bg text-text font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-transparent blur-3xl" />
      <Navbar user={user} />

      <main className="px-6 md:px-16 py-12 relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-display font-bold">
            Welcome back, <span className="text-primary">{user.name}</span> 👋
          </h2>
          <p className="text-muted mt-2">
            Ready to battle, learn, and climb the leaderboard?
          </p>
        </div>

        <UserStats user={user} />
        <ActionButtons
          onCreate={() => setShowCreateModal(true)}
          onJoin={() => setShowJoinModal(true)}
          onPractice={() => console.log("Practice Mode")}
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
        {/* <DashboardLeaderboard players={players} />
        <RecentBattles battles={battles} /> */}
      </main>
    </div>
  );
}
