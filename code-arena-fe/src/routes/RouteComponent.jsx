import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
const RoutesComponent = () => {

  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<LandingPage />} /> */}
        {/* <Route path="/login" element={<LoginPage />} /> */}
        {/* <Route path="/signup" element={<RegisterPage />} /> */}
      </Routes>
    </Router>
  );
};
export default RoutesComponent;
