import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const courses = ["BA", "BCOM", "BSC", "BCA"];
const semesters = [1, 2, 3, 4, 5, 6];

export default function AddStudents() {
  // Data state
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
   

  const [student, setStudent] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({ name: "", semester: "", course: "" });

  useEffect(() => {
    fetch("http://localhost:3000/api/findUsers")
      .then((res) => res.json())
      .then((data) => {
        setStudent(data.data || []);
        setFiltered(data.data || []);
      })
      .catch((err) => console.error("Error fetching students:", err));
  }, []);

  // Filter function
  const applyFilters = () => {
    let result = student;

    if (filters.name.trim()) {
      result = result.filter((s) =>
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(filters.name.toLowerCase())
      );
    }
    if (filters.semester) {
      result = result.filter((s) => String(s.semester) === filters.semester);
    }
    if (filters.course.trim()) {
      result = result.filter((s) => s.course.toLowerCase().includes(filters.course.toLowerCase()));
    }

    setFiltered(result);
  };

  // Run filter when filters change
  useEffect(() => {
    applyFilters();
  }, [filters, student]);




  
  // Form state
  const [form, setForm] = useState({
    roll: "",
    first: "",
    last: "",
    mobile: "",
    course: "",
    sem: "",
    photo: "",
  });

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [filterSem, setFilterSem] = useState("");

  // Loaders
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingFetch, setLoadingFetch] = useState(false);

  // Edit Modal
  const [editModal, setEditModal] = useState(false);
  const [editStudent, setEditStudent] = useState(null);

  // Fetch students from backend
  const fetchStudents = async () => {
    setLoadingFetch(true);
    try {
      const res = await fetch("http://localhost:3000/api/findUsers");
      const data = await res.json();

      // Handle API shape
      const studentArray = Array.isArray(data)
        ? data
        : Array.isArray(data.students)
        ? data.students
        : [];

      setStudents(studentArray);
    } catch (error) {
      console.error("Error fetching students:", error);
      setStudents([]);
    } finally {
      setLoadingFetch(false);
    }
  };

  
  

  // Add student handler
  const handleAddStudent = async (e) => {
    e.preventDefault();
    setLoadingAdd(true);

    try {
      const formData = new FormData();
      formData.append("photo", form.photo);

      const payload = {
        rollNumber: form.roll,
        firstName: form.first,
        lastName: form.last,
        mobile: form.mobile,
        course: form.course,
        semester: form.sem,
        subjects: ["DSA", "DBMS", "OS"],
        TotalFees: 50000,
        Discount: 5000,
        DueFees: 20000,
        PayFees: 25000,
        Assignment: {
          DSA: "Submitted",
          DBMS: "Pending",
          OS: "Submitted",
        },
      };

      formData.append("data", JSON.stringify(payload));

      const res = await fetch("http://localhost:3000/api/students", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to add student");

      alert("Student added successfully!");
      setForm({
        roll: "",
        first: "",
        last: "",
        mobile: "",
        course: "",
        sem: "",
        photo: "",
      });
      fetchStudents();
    } catch (error) {
      console.error(error);
      alert("Something went wrong while adding student!");
    } finally {
      setLoadingAdd(false);
    }
  };

  // Edit save
  const handleEditSave = (e) => {
    e.preventDefault();
    setStudents((prev) =>
      prev.map((s) => (s._id === editStudent._id ? editStudent : s))
    );
    setEditModal(false);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans">
      {/* HEADER */}
      <header className="bg-black bg-opacity-70 sticky top-0 z-50 p-4 shadow flex justify-between items-center">
        <h1 className="text-xl font-bold text-purple-400">Students</h1>
        <nav className="space-x-4 text-sm">
          <a href="/admin-dashboard" className="hover:text-purple-300">
            Dashboard
          </a>
          <a href="/fees" className="hover:text-purple-300">
            Fees
          </a>
          <a href="/assignments" className="hover:text-purple-300">
            Assignments
          </a>
          <a href="/subjects" className="hover:text-purple-300">
            Subjects
          </a>
          <Link
            to="/admin/logout"
            className="hover:text-red-400 font-bold"
          >
            Logout
          </Link>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {/* ADD STUDENT FORM */}
        <section className="bg-gray-800 p-6 rounded-xl mb-8">
          <h3 className="text-lg font-semibold mb-4">Add New Student</h3>
          <form
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
            onSubmit={handleAddStudent}
          >
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setForm({ ...form, photo: e.target.files[0] })
              }
              className="col-span-1 p-2 rounded bg-gray-700 border border-gray-600 text-white"
            />
            <input
              type="text"
              placeholder="Roll Number"
              value={form.roll}
              onChange={(e) => setForm({ ...form, roll: e.target.value })}
              className="p-2 rounded bg-gray-700 border border-gray-600"
              required
            />
            <input
              type="text"
              placeholder="First Name"
              value={form.first}
              onChange={(e) => setForm({ ...form, first: e.target.value })}
              className="p-2 rounded bg-gray-700 border border-gray-600"
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={form.last}
              onChange={(e) => setForm({ ...form, last: e.target.value })}
              className="p-2 rounded bg-gray-700 border border-gray-600"
              required
            />
            <input
              type="text"
              placeholder="Mobile Number"
              value={form.mobile}
              onChange={(e) => {
                if (/^[0-9]*$/.test(e.target.value)) {
                  setForm({ ...form, mobile: e.target.value });
                }
              }}
              className="p-2 rounded bg-gray-700 border border-gray-600"
              required
            />
            <select
              value={form.course}
              onChange={(e) => setForm({ ...form, course: e.target.value })}
              className="p-2 rounded bg-gray-700 border border-gray-600"
              required
            >
              <option value="">Select Course</option>
              {courses.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              value={form.sem}
              onChange={(e) => setForm({ ...form, sem: e.target.value })}
              className="p-2 rounded bg-gray-700 border border-gray-600"
              required
            >
              <option value="">Select Semester</option>
              {semesters.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={loadingAdd}
              className="bg-purple-600 hover:bg-purple-800 transition py-2 px-4 rounded text-white font-semibold col-span-1 md:col-span-3 flex items-center justify-center gap-2"
            >
              {loadingAdd ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Adding...
                </>
              ) : (
                "Add Student"
              )}
            </button>
          </form>
        </section>
        </main>


 {/* Filter Students */}
<div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 rounded-2xl mt-8 shadow-lg border border-gray-700">
  <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
    Filter Students
  </h2>

  {/* Filter Inputs */}
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
    {/* Name Search */}
    <input
      type="text"
      placeholder="Search by name"
      value={filters.name}
      onChange={(e) => setFilters({ ...filters, name: e.target.value })}
      className="p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
    />

    {/* Semester Dropdown */}
    <select
      value={filters.semester}
      onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
      className="p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
    >
      <option value="">Select Semester</option>
      {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>

    {/* Course Dropdown */}
    <select
      value={filters.course}
      onChange={(e) => setFilters({ ...filters, course: e.target.value })}
      className="p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
    >
      <option value="">Select Course</option>
      {["BCOM", "BSC", "BA", "BCA"].map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </select>

    {/* Reset Button */}
    <button
      onClick={() => setFilters({ name: "", semester: "", course: "" })}
      className="p-3 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold hover:opacity-90 transition"
    >
      Reset Filters
    </button>
  </div>

  {/* Results */}
  {(filters.name || filters.semester || filters.course) ? (
    filtered.length > 0 ? (
      <ul className="space-y-3">
        {filtered.map((student) => (
          <li
            key={student._id}
            className="bg-gray-800 p-4 rounded-lg flex justify-between items-center border border-gray-700 hover:border-purple-500 transition"
          >
            <img
              src={student.photo}
              alt={`${student.firstName} ${student.lastName}`}
              className="w-12 h-12 rounded-full border border-gray-700"
            />
            <span className="text-white">
              <strong className="text-purple-400">{student.firstName}</strong> — Semester {student.semester} — {student.course}
            </span>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-400 italic">No students found</p>
    )
  ) : (
    <p className="text-gray-400 italic">Apply filters to see results</p>
  )}
</div>







      {/* FOOTER */}
      <footer className="text-center text-sm text-gray-500 mt-12 p-6">
        &copy; 2025 JITM Kuchaman | Admin Panel
      </footer>
    </div>
  );
}
