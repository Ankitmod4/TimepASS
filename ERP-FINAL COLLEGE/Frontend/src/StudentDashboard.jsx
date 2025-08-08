import React, { useEffect, useState } from "react";

import axios from "axios";

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState([]);
  const [rollno,setrollno]=useState(JSON.parse(localStorage.getItem('studentRollNumber'))|| '' )

  // const { rollNumber } = useParams();
  

  // 🧑 Fetch student details
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/students/${rollno}`);
        const studentData = res.data.data;
        setStudent(studentData);
      } catch (err) {
        console.error("Failed to fetch student:", err);
      } finally {
        setLoading(false);
      }
    };

    if (rollno) fetchStudent();
  }, [rollno]);

  // 📋 Fetch assignments
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const fullname = `${student.firstName} ${student.lastName}`;
        console.log("Fetching assignments for:", fullname);
        const res = await axios.get(`http://localhost:3000/api/assignment/${fullname}`); 
        const data = res.data?.data || [];
        const allAssignments = data.flatMap((entry) => entry.assignments || []);
        setAssignments(allAssignments);
      } catch (err) {
        console.error("Error fetching assignments:", err);
      }
    };

    if (student?.firstName && student?.lastName) {
      fetchAssignments();
    }
  }, [student]);

  const handleLogout = () => {
    localStorage.removeItem('studentRollNumber');
    window.location.href = "/student/logout";
  };

  const handlePayFee = () => {
    alert("🚀 Redirecting to payment gateway...");
  };

  if (loading) return <div className="text-white p-10">Loading student info...</div>;
  if (!student) return <div className="text-red-400 p-10">Student not found!</div>;

  const effectiveTotal = student.TotalFees - (student.Discount || 0);
  const feeDue = effectiveTotal - student.PayFees;

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black text-white min-h-screen p-4 md:p-10 font-sans">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-purple-400 tracking-wide">🎓 Student Dashboard</h1>
        <button
          onClick={handleLogout}
          className="mt-4 md:mt-0 bg-red-600 hover:bg-red-700 px-5 py-2 rounded-xl shadow-md text-sm font-semibold"
        >
          🚪 Logout
        </button>
      </header>

      {/* Profile Section */}
      <section className="bg-gray-800 rounded-xl p-6 shadow-lg flex flex-col items-center text-center mb-10">
        <img
          src={student.photo}
          alt="Student"
          className="w-28 h-28 rounded-full border-4 border-purple-500 shadow mb-4"
        />
        <h2 className="text-2xl font-bold text-purple-300">
          {student.firstName} {student.lastName}
          <span className="text-sm text-gray-400"> ({student.rollNumber})</span>
        </h2>
        <p className="text-sm text-gray-300 mt-1">{student.course} (Sem {student.semester})</p>
      </section>

      {/* Fee Info */}
      <section className="bg-gray-800 rounded-xl p-6 shadow-lg mb-10">
        <h2 className="text-xl font-semibold text-purple-300 mb-4">💰 Fee Status</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span>Total Fee:</span>
            <span className="font-bold text-white">₹{student.TotalFees}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount:</span>
            <span className="text-blue-400 font-bold">₹{student.Discount || 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Paid:</span>
            <span className="text-green-400 font-bold">₹{student.PayFees}</span>
          </div>
          <div className="flex justify-between">
            <span>Due:</span>
            <span className={`font-bold ${feeDue > 0 ? "text-red-400" : "text-green-400"}`}>₹{feeDue}</span>
          </div>
        </div>

        {/* Fee Progress */}
        <div className="mt-4">
          <div className="h-3 w-full bg-gray-600 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500"
              style={{ width: `${(student.PayFees / effectiveTotal) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-400 text-center mt-1">
            {(student.PayFees / effectiveTotal * 100).toFixed(1)}% Fee Paid
          </p>
        </div>

        <div className="text-center mt-6">
          {feeDue > 0 ? (
            <button
              onClick={handlePayFee}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded shadow"
            >
              💳 Pay ₹{feeDue} Now
            </button>
          ) : (
            <p className="text-green-400 font-semibold">🎉 All dues cleared!</p>
          )}
        </div>
      </section>

      {/* Subjects */}
      <section className="bg-gray-800 rounded-xl p-6 shadow-lg mb-10">
        <h2 className="text-xl font-semibold text-purple-300 mb-3">📚 Subjects</h2>
        <ul className="list-disc list-inside text-gray-200 text-sm space-y-1">
          {(student.subjects || []).map((subject, index) => (
            <li key={index} className="hover:text-purple-400 transition">
              {subject}
            </li>
          ))}
        </ul>
      </section>

      {/* Assignments */}
      <section className="bg-gray-800 rounded-xl p-6 shadow-lg mb-10">
        <h2 className="text-xl font-semibold text-purple-300 mb-3">📋 Assignments</h2>
        {assignments.length > 0 ? (
          <ul className="divide-y divide-gray-700 text-sm">
            {assignments.map((a, idx) => (
              <li key={idx} className="py-2 flex justify-between">
                <span className="text-gray-300">{a.subject}</span>
                <span
                  className={`font-semibold ${
                    a.status === "Submitted" ? "text-green-400" : "text-yellow-400"
                  }`}
                >
                  {a.status}
                </span>
                <span className="text-xs text-gray-400">
                  {a.deadline && a.deadline !== "N/A" ? `⏳ ${a.deadline}` : ""}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No assignment data available.</p>
        )}
      </section>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-500 mt-10">
        © 2025 <span className="text-purple-400 font-semibold">JITM Kuchaman</span> | Student Portal
      </footer>
    </div>
  );
};

export default StudentDashboard;
