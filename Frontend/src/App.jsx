import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Layout from "./pages/Layout";
import axios from "axios";
import Employees from "./pages/Employee";
import Attendance from "./pages/Attendance";
import NotFound from "./pages/NotFound";

const App = () => {

  useEffect(() => {
    const getCsrfToken = async () => {
      try {
        const response = await axios.get('https://hrms-lite-backend-0122.onrender.com/api/csrf-token/', {
          withCredentials: true,
        });
      } catch (error) {
        console.error("Error fetching CSRF token");
      }
    };
    getCsrfToken();
  }, []);

  return (
    <>
      <Router>
        <Routes>
          {/* Layout wrapper for all routes */}
          <Route path="/" element={<Layout />}>
            {/* Nested routes - will render in <Outlet /> */}
            <Route index element={<Navigate to="/employees" />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/attendance" element={<Attendance />} />
          </Route>

          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;