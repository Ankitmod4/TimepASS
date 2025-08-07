import React, { useState } from 'react';
import { Link } from 'react-router-dom';


const Subjects = () => {
  const [course, setCourse] = useState('');
  const [semester, setSemester] = useState('');
  const [subjects, setSubjects] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const subjectList = subjects.split(',').map((subj) => subj.trim()).filter(Boolean);

    console.log({
      course,
      semester,
      subjects: subjectList,
    });

    // Send to backend or display confirmation as needed
  };

  return (
    <div className="bg-gray-900 text-white font-sans min-h-screen">
      {/* Header */}
      <header className="bg-black bg-opacity-70 sticky top-0 z-50 p-4 shadow flex justify-between items-center">
        <h1 className="text-xl font-bold text-purple-400">Subject Management</h1>
        <nav className="space-x-4 text-sm">
          <a href="/admin-dashboard" className="hover:text-purple-300">Dashboard</a>
          <a href="/add-students" className="hover:text-purple-300">Students</a>
          <a href="/fees" className="hover:text-purple-300">Fees</a>
          <a href="/assignments" className="hover:text-purple-300">Assignments</a>
          <Link to="/admin/logout" className="hover:text-red-400 font-bold">Logout</Link>
        </nav>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6">Add Semester Subjects</h2>
        <form onSubmit={handleSubmit} className="space-y-4 bg-gray-800 p-6 rounded-xl">
          {/* Course Selection */}
          <select
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600"
            required
          >
            <option value="">Select Course</option>
            <option value="BA">BA</option>
            <option value="BCOM">BCOM</option>
            <option value="BSC">BSC</option>
            <option value="BCA">BCA</option>
          </select>

          {/* Semester Selection */}
          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600"
            required
          >
            <option value="">Select Semester</option>
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <option key={num} value={num}>{`Semester ${num}`}</option>
            ))}
          </select>

          {/* Subjects Input */}
          <input
            type="text"
            value={subjects}
            onChange={(e) => setSubjects(e.target.value)}
            placeholder="Subject Names (e.g., Math, Physics, Chemistry)"
            className="w-full p-2 rounded bg-gray-700 border border-gray-600"
            required
          />

          {/* Submit */}
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-800 transition py-2 px-4 rounded text-white font-semibold"
          >
            Add Subject(s)
          </button>
        </form>
      </main>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 mt-12 p-6">
        &copy; 2025 JITM Kuchaman | Admin Panel
      </footer>
    </div>
  );
};

export default Subjects;
