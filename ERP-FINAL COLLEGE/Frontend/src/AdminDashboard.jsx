import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [feeData, setFeeData] = useState({ paid: 0, due: 0, discount: 0 });
  const [assignmentData, setAssignmentData] = useState({ submitted: 0, notSubmitted: 0 });

  // Check if admin is logged in
  useEffect(() => {
    const adminUsername = localStorage.getItem("adminUsername");
    if (!adminUsername) {
      navigate("/admin-login");
    }
  }, [navigate]);

  useEffect(() => {
    fetch("http://localhost:3000/api/findUsers")
      .then((res) => res.json())
      .then((data) => {
        if (!data.data) return;

        const students = data.data;

        // Aggregate Fee Data
        const paid = students.reduce((sum, s) => sum + (s.PayFees || 0), 0);
        const due = students.reduce((sum, s) => sum + (s.DueFees || 0), 0);
        const discount = students.reduce((sum, s) => sum + (s.Discount || 0), 0);

        // Aggregate Assignment Data
        let submitted = 0;
        let notSubmitted = 0;
        students.forEach((s) => {
          const assignmentStr = Object.values(s.Assignment || {}).join("").toLowerCase();
          if (assignmentStr.includes("y")) {
            submitted++;
          } else {
            notSubmitted++;
          }
        });

        setFeeData({ paid, due, discount });
        setAssignmentData({ submitted, notSubmitted });
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  const feeChartData = {
    labels: ["Paid", "Due", "Discount"],
    datasets: [
      {
        label: "Fee Stats",
        data: [feeData.paid, feeData.due, feeData.discount],
        backgroundColor: ["#10B981", "#EF4444", "#FBBF24"],
      },
    ],
  };

  const assignmentChartData = {
    labels: ["Submitted", "Not Submitted"],
    datasets: [
      {
        label: "Assignments",
        data: [assignmentData.submitted, assignmentData.notSubmitted],
        backgroundColor: ["#6366F1", "#F87171"],
      },
    ],
  };

  return (
    <div className="bg-gray-900 text-white font-sans min-h-screen">
      {/* Navbar */}
      <header className="bg-black bg-opacity-70 sticky top-0 z-50 p-4 shadow flex justify-between items-center">
        <h1 className="text-xl font-bold text-purple-400">Admin Panel - JITM ERP</h1>
        <nav className="space-x-4 text-sm">
          <Link to="/add-students" className="hover:text-purple-300">Students</Link>
          <Link to="/fees" className="hover:text-purple-300">Fees</Link>
          <Link to="/assignments" className="hover:text-purple-300">Assignments</Link>
          <Link to="/subjects" className="hover:text-purple-300">Subjects</Link>
          <Link
            to="/admin-login"
            className="hover:text-red-400 font-bold"
            onClick={() => localStorage.removeItem("adminUsername")}
          >
            Logout
          </Link>
        </nav>
      </header>

      {/* Overview Section */}
      <section className="max-w-6xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-4">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Fee Chart */}
          <div className="bg-gray-800 p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-2">Total Fee Collection</h3>
            <Doughnut data={feeChartData} />
          </div>

          {/* Assignment Chart */}
          <div className="bg-gray-800 p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-2">Assignment Submissions</h3>
            <Bar data={assignmentChartData} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 mt-12 p-6">
        &copy; 2025 JITM Kuchaman | Admin Panel
      </footer>
    </div>
  );
};

export default AdminDashboard;
