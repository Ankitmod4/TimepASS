import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

const FeesPage = () => {
  const [fee, setFee] = useState({
    roll: "", name: "", sem: "", course: "", total: "", discount: "", paid: ""
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSem, setSelectedSem] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);

  // 🔄 Fetch & Filter students ONLY when course + sem are selected
  useEffect(() => {
    const fetchAndFilter = async () => {
      if (selectedCourse && selectedSem) {
        try {
          const res = await fetch("http://localhost:3000/api/findUsers");
          const json = await res.json();

          if (json?.data) {
            const filtered = json.data.filter(
              (entry) =>
                entry.course === selectedCourse &&
                String(entry.semester) === String(selectedSem)
            );
            setFilteredStudents(filtered);
          } else {
            setFilteredStudents([]);
          }
        } catch (err) {
          console.error("Failed to fetch students", err);
        }
      } else {
        setFilteredStudents([]);
      }
    };

    fetchAndFilter();
  }, [selectedCourse, selectedSem]);

  // 🔢 Input Change Handler
  const handleInput = (e) => {
    const { name, value } = e.target;
    setFee((prev) => ({ ...prev, [name]: value }));
  };

  // 🧠 Select student and populate form
  const populateSelected = (e) => {
    const selectedRoll = e.target.value;
    const found = filteredStudents.find((stu) => stu.rollNumber === selectedRoll);
    if (found) {
      setFee({
        roll: found.rollNumber,
        name: `${found.firstName} ${found.lastName}`,
        sem: found.semester,
        course: found.course,
        total: found.TotalFees,
        discount: found.Discount || 0,
        paid: found.PayFees || 0,
      });
    }
  };

 // 💾 Save/Update Fee Info
const save = async () => {
  try {
    console.log(fee.roll, fee.sem, fee.total, fee.discount, fee.paid);
    const res = await fetch(`http://localhost:3000/api/update/${fee.roll}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        semester: fee.sem,
        total: Number(fee.total),
        discount: Number(fee.discount),
        paid: Number(fee.paid),
      }),
    });

    if (res.ok) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        window.location.reload(); // 🔄 Refresh page
      }, 1500);
    } else {
      throw new Error("Response not ok");
    }
  } catch (error) {
    console.error("❌ Failed to update fee:", error);
    alert("❌ Error updating fee. Please try again.");
  }

  };

  return (
    <div className="bg-gray-900 text-white font-sans min-h-screen">
      <header className="bg-black bg-opacity-70 sticky top-0 z-50 p-4 shadow flex justify-between items-center">
        <h1 className="text-xl font-bold text-purple-400">Admin Panel - JITM ERP</h1>
        <nav className="space-x-4 text-sm">
          <Link to="/admin-dashboard" className="hover:text-purple-300">Dashboard</Link>
          <Link to="/add-students" className="hover:text-purple-300">Students</Link>
          <Link to="/assignments" className="hover:text-purple-300">Assignments</Link>
          <Link to="/subjects" className="hover:text-purple-300">Subjects</Link>
          <Link to="/admin/logout" className="hover:text-red-400 font-bold">Logout</Link>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-4"> Fee Records</h2>

        {showSuccess && (
          <div className="bg-green-600 text-white px-4 py-2 rounded mb-4">
            ✅ Fee Updated Successfully
          </div>
        )}

        {/* Add / Update Fee Form */}
        <div className="bg-gray-800 p-6 rounded-xl mb-8">
          <h3 className="text-lg font-semibold mb-4">Add / Update Fee</h3>

          {/* Course and Semester Selector */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="p-2 rounded bg-gray-700 border border-gray-600"
            >
              <option value="">Select Course</option>
              <option value="BCA">BCA</option>
              <option value="BBA">BBA</option>
              <option value="BCOM">BCOM</option>
              <option value="BA">BA</option>
            </select>

            <select
              value={selectedSem}
              onChange={(e) => setSelectedSem(e.target.value)}
              className="p-2 rounded bg-gray-700 border border-gray-600"
            >
              <option value="">Select Semester</option>
              {[1, 2, 3, 4, 5, 6].map((sem) => (
                <option key={sem} value={sem}>Semester {sem}</option>
              ))}
            </select>
          </div>

          {/* Student Selector and Fee Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              save();
            }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <select
              onChange={populateSelected}
              className="p-2 rounded bg-gray-700 border border-gray-600"
            >
              <option value="">Select Student</option>
              {filteredStudents.map((entry) => (
                <option key={entry.rollNumber} value={entry.rollNumber}>
                  {entry.firstName} {entry.lastName}
                </option>
              ))}
            </select>

            <input name="roll" value={fee.roll} onChange={handleInput} placeholder="Roll Number"
              className="p-2 rounded bg-gray-700 border border-gray-600" required />
            <input name="name" value={fee.name} onChange={handleInput} placeholder="Student Name"
              className="p-2 rounded bg-gray-700 border border-gray-600" required />
            <input name="sem" value={fee.sem} onChange={handleInput} type="number" placeholder="Semester"
              className="p-2 rounded bg-gray-700 border border-gray-600" required />
            <input name="course" value={fee.course} onChange={handleInput} placeholder="Course"
              className="p-2 rounded bg-gray-700 border border-gray-600" required  />
            <input name="total" value={fee.total} onChange={handleInput} type="number" placeholder="Total Fee"
              className="p-2 rounded bg-gray-700 border border-gray-600" required />
            <input name="discount" value={fee.discount} onChange={handleInput} type="number" placeholder="Discount"
              className="p-2 rounded bg-gray-700 border border-gray-600" required />
            <input name="paid" value={fee.paid} onChange={handleInput} type="number" placeholder="Fee Paid"
              className="p-2 rounded bg-gray-700 border border-gray-600" required />

            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-800 transition py-2 px-4 rounded text-white font-semibold col-span-1 md:col-span-3"
            >
              Update Fee
            </button>
          </form>
        </div>
      </main>

      <footer className="text-center text-sm text-gray-500 mt-12 p-6">
        &copy; 2025 JITM Kuchaman | Admin Panel
      </footer>
    </div>
  );
};

export default FeesPage;
