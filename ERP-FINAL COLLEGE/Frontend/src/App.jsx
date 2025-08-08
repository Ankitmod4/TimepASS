import React from "react";
import StudentLogin from "./StudentLogin";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import AddStudents from "./AddStudents";
import AssignmentPage from "./AssignmentPage";
import FeesPage from "./FeesPage";
import StudentDashboard from "./StudentDashboard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Subjects from "./assets/Subjects";
import Logout from "./Logout";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<h1>Welcome to the Login Page</h1>} /> */}
          <Route path="/" element={<StudentLogin />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/add-students" element={<AddStudents />} />
          <Route path="/assignments" element={<AssignmentPage />} />
          <Route path="/fees" element={<FeesPage />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/student/logout" element={<Logout />} />
          <Route path="/admin/logout" element={<Logout />} />
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
