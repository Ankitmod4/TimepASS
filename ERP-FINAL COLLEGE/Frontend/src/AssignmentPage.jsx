import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";

const AssignmentPage = () => {
  const [course, setCourse] = useState("");
  const [semester, setSemester] = useState("");
  const [studentName, setStudentName] = useState(null);
  const [studentOptions, setStudentOptions] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [subjects, setSubjects] = useState([{ subject: "", status: "Submitted", deadline: "" }]);

  // 🔁 Fetch students when course & semester selected
  useEffect(() => {
    const fetchStudents = async () => {
      if (!course || !semester) {
        setStudentOptions([]);
        return;
      }

      try {
        const res = await fetch("http://localhost:3000/api/findUsers");
        const result = await res.json();

        const filtered = result.data.filter(
          (student) =>
            student.course === course && String(student.semester) === String(semester)
        );

        setAllStudents(filtered);

        const options = filtered.map((student) => ({
          value: student._id,
          label: `${student.firstName} ${student.lastName}`,
        }));

        setStudentOptions(options);
      } catch (err) {
        console.error("Error fetching students:", err);
      }
    };

    fetchStudents();
  }, [course, semester]);

  const addSubject = () => {
    setSubjects([...subjects, { subject: "", status: "Submitted", deadline: "" }]);
  };

  const handleSubjectChange = (index, field, value) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index][field] = value;
    setSubjects(updatedSubjects);
  };

  const removeSubject = (index) => {
    const updatedSubjects = [...subjects];
    updatedSubjects.splice(index, 1);
    setSubjects(updatedSubjects);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!studentName) {
      alert("Please select a student.");
      return;
    }

    const assignmentData = {
      studentName: studentName.label,
      semester,
      course,
      assignments: subjects.map((s) => ({
        subject: s.subject,
        status: s.status,
        deadline: s.status === "Not Submitted" ? s.deadline : "N/A",
      })),
    };

    try {
      const res = await fetch("http://localhost:3000/api/assignment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(assignmentData),
      });

      const result = await res.json();
      console.log(result);
      alert("Assignment updated successfully!");

      // Optionally reset form
      setStudentName(null);
      setSubjects([{ subject: "", status: "Submitted", deadline: "" }]);
    } catch (err) {
      console.error("Failed to update assignment", err);
      alert("Failed to update assignment");
    }
  };

  return (
    <div className="bg-gray-900 text-white font-sans min-h-screen">
      {/* Navbar */}
      <header className="bg-black bg-opacity-70 sticky top-0 z-50 p-4 shadow flex justify-between items-center">
        <h1 className="text-xl font-bold text-purple-400">Assignment Management</h1>
        <nav className="space-x-4 text-sm">
          <a href="/admin-dashboard" className="hover:text-purple-300">Dashboard</a>
          <Link to="/add-students" className="hover:text-purple-300">Students</Link>
          <a href="/fees" className="hover:text-purple-300">Fees</a>
          <a href="/subjects" className="hover:text-purple-300">Subjects</a>
          <Link to="/admin/logout" className="hover:text-red-400 font-bold">Logout</Link>
        </nav>
      </header>

      {/* Form Section */}
      <main className="max-w-4xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6">Assignment Status Update</h2>
        <form onSubmit={handleSubmit} className="space-y-4 bg-gray-800 p-6 rounded-xl">
          
          {/* Course */}
          <select
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600"
            required
          >
            <option value="">Select Course</option>
            <option>BA</option>
            <option>BCOM</option>
            <option>BSC</option>
            <option>BCA</option>
          </select>

          {/* Semester */}
          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600"
            required
          >
            <option value="">Select Semester</option>
            {[1, 2, 3, 4, 5, 6].map((sem) => (
              <option key={sem} value={sem}>Sem {sem}</option>
            ))}
          </select>

          {/* Student Dropdown */}
          <Select
            options={studentOptions}
            value={studentName}
            onChange={(selected) => setStudentName(selected)}
            placeholder="Search Student"
            className="text-black rounded"
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: "#374151",
                borderColor: "#4B5563",
                color: "#fff",
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: "#1F2937",
                color: "#fff",
              }),
              singleValue: (base) => ({
                ...base,
                color: "#fff",
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isSelected ? "#000000ff" : "#1F2937",
                color: "#fff",
              }),
            }}
            isSearchable
            required
          />

          {/* Subjects */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Subjects</h3>
            {subjects.map((subj, index) => (
              <div key={index} className="bg-gray-700 p-4 rounded-lg space-y-2">
                <input
                  type="text"
                  placeholder="Enter Subject Name"
                  value={subj.subject}
                  onChange={(e) => handleSubjectChange(index, "subject", e.target.value)}
                  className="w-full p-2 rounded bg-gray-600 border border-gray-500"
                  required
                />
                <select
                  value={subj.status}
                  onChange={(e) => handleSubjectChange(index, "status", e.target.value)}
                  className="w-full p-2 rounded bg-gray-600 border border-gray-500"
                >
                  <option>Submitted</option>
                  <option>Not Submitted</option>
                </select>
                {subj.status === "Not Submitted" && (
                  <input
                    type="date"
                    value={subj.deadline}
                    onChange={(e) => handleSubjectChange(index, "deadline", e.target.value)}
                    className="w-full p-2 rounded bg-gray-600 border border-gray-500"
                    required
                  />
                )}
                {subjects.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSubject(index)}
                    className="bg-red-600 hover:bg-red-800 px-3 py-1 rounded text-white"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addSubject}
              className="bg-blue-600 hover:bg-blue-800 px-3 py-2 rounded text-white"
            >
              + Add Another Subject
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-800 transition py-2 px-4 rounded text-white font-semibold"
          >
            Update Assignment
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

export default AssignmentPage;
