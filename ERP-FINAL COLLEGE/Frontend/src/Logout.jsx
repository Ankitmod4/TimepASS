import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine user role from URL or location state
  const role = location.pathname.includes("student") ? "student" : "admin";

  useEffect(() => {
    // Clear only relevant data
    if (role === "student") {
      localStorage.removeItem("studentToken");
    } else {
      localStorage.removeItem("adminToken");
    }

    // Optional: Clear everything
    // localStorage.clear();
    // Show redirect after 2 seconds
    const timer = setTimeout(() => {
      navigate(role === "student" ? "/" : "/admin-login");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate, role]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {role === "student" ? "Student" : "Admin"}, you are now logged out!
        </h1>
        <p className="text-gray-600">Redirecting you to the login page...</p>
        <div className="mt-4 animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
      </div>
    </div>
  );
};

export default Logout;
