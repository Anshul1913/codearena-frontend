// codearena-frontend/code-arena-fe/src/routes/RouteComponent.jsx

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import DashboardPage from '../pages/DashboardPage';
import LeaderboardPage from '../pages/LeaderboardPage'; // ✅ New Import
import ROLES from '../utils/constants/Role';
import ProtectedRoute from '../config/ProtectedRoute';
import NotFoundPage from '../pages/404/NotFoundPage';
import RoomPage from '../pages/room/CodingRoomPage';
import MCQRoom from '../pages/room/McqQuestionRoomPage';
import McqWaitingRoomPage from '../pages/room/McqWaitingRoomPage';
import RoomResultPage from '../pages/ResultPage';
import CodingWaitingRoomPage from '../pages/room/CodingWaitingRoomPage';
import PracticeSetupPage from '../pages/practice/PracticeSetupPage';
import PracticeSessionPage from '../pages/practice/PracticeSessionPage';
import PracticeResultPage from '../pages/practice/PracticeResultPage';

const RoutesComponent = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/dashboard" element={<ProtectedRoute element={DashboardPage} allowedRoles={[ROLES.PLAYER]} />} />
        
        {/* ✅ Added Leaderboard Route */}
        <Route path="/leaderboard" element={<ProtectedRoute element={LeaderboardPage} allowedRoles={[ROLES.PLAYER]} />} />

        {/* Practice Routes */}
        <Route path="/practice" element={<ProtectedRoute element={PracticeSetupPage} allowedRoles={[ROLES.PLAYER]} />} />
        <Route path="/practice/session/:sessionId" element={<ProtectedRoute element={PracticeSessionPage} allowedRoles={[ROLES.PLAYER]} />} />
        <Route path="/practice/result/:sessionId" element={<ProtectedRoute element={PracticeResultPage} allowedRoles={[ROLES.PLAYER]} />} />

        {/* Room Routes */}
        <Route path="/unauthorized" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/room/:roomCode" element={<ProtectedRoute element={RoomPage} allowedRoles={[ROLES.PLAYER]} />} />
        <Route path="/room/:roomCode/result" element={<ProtectedRoute element={RoomResultPage} allowedRoles={[ROLES.PLAYER]} />} />
        <Route path="/mcq-room/:roomCode" element={<ProtectedRoute element={MCQRoom} allowedRoles={[ROLES.PLAYER]} />} />
        <Route path="/mcq-waiting-room/:roomCode" element={<ProtectedRoute element={McqWaitingRoomPage} allowedRoles={[ROLES.PLAYER]} />} />
        <Route path="/coding-waiting-room/:roomCode" element={<ProtectedRoute element={CodingWaitingRoomPage} allowedRoles={[ROLES.PLAYER]} />} />
      </Routes>
    </Router>
  );
};
export default RoutesComponent;