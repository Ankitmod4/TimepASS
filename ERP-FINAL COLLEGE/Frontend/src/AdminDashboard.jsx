import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

// Register chart elements
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const AdminDashboard = () => {
  const [feeData, setFeeData] = useState({ paid: 0, due: 0, discount: 0 });
  const [assignmentData, setAssignmentData] = useState({ submitted: 0, notSubmitted: 0 });

  useEffect(() => {
    // Fetch Fee Stats
    fetch("http://localhost:3000/api/dashboard/fees")
      .then((res) => res.json())
      .then((data) => setFeeData(data))
      .catch((err) => console.error("Fee data error:", err));

    // Fetch Assignment Stats
    fetch("http://localhost:3000/api/dashboard/assignments")
      .then((res) => res.json())
      .then((data) => setAssignmentData(data))
      .catch((err) => console.error("Assignment data error:", err));
  }, []);

  const feeChartData = {
    labels: ["Paid", "Due", "Discount"],
    datasets: [
      {
        label: "Fee Stats",
        data: [feeData.paid || 0, feeData.due || 0, feeData.discount || 0],
        backgroundColor: ["#10B981", "#EF4444", "#FBBF24"],
      },
    ],
  };

  const assignmentChartData = {
    labels: ["Submitted", "Not Submitted"],
    datasets: [
      {
        label: "Assignments",
        data: [assignmentData.submitted || 0, assignmentData.notSubmitted || 0],
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
          <Link to="/admin/logout" className="hover:text-red-400 font-bold">Logout</Link>
        </nav>
      </header>

      {/* Overview Section */}
      <section className="max-w-6xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-4">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Fee Chart */}
          <div className="bg-gray-800 p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-2">Fee Collection Breakdown</h3>
            <Doughnut data={feeChartData} />
          </div>

          {/* Assignment Chart */}
          <div className="bg-gray-800 p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-2">Assignment Submission Stats</h3>
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
