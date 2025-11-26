import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import DashboardPage from '../pages/DashboardPage';
import ROLES from '../utils/constants/Role';
import ProtectedRoute from '../config/ProtectedRoute';
import NotFoundPage from '../pages/404/NotFoundPage';
import RoomPage from '../pages/room/CodingRoomPage';
import MCQRoom from '../pages/room/McqQuestionRoomPage';
import McqWaitingRoomPage from '../pages/room/McqWaitingRoomPage';
const RoutesComponent = () => {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<ProtectedRoute element={DashboardPage} allowedRoles={[ROLES.PLAYER]} />} />

        <Route path="/unauthorized" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} /> 
        <Route path="/room" element={<ProtectedRoute element={RoomPage} allowedRoles={[ROLES.PLAYER]} />} /> 
        <Route path="/mcq-room/:roomCode" element={<ProtectedRoute element={MCQRoom} allowedRoles={[ROLES.PLAYER]} />} /> 
        <Route path="/mcq-waiting-room/:roomCode" element={<ProtectedRoute element={McqWaitingRoomPage} allowedRoles={[ROLES.PLAYER]} />} /> 
      </Routes>
    </Router>
  );
};
export default RoutesComponent;
