import { useState } from 'react';
import { Link } from 'react-router-dom';


const AddStudents = () => {
  const [students, setStudents] = useState([

    
  ]);

  const [form, setForm] = useState({
    roll: '',
    first: '',
    last: '',
    mobile: '',
    course: '',
    sem: '',
    photo: '',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [filterSem, setFilterSem] = useState('');

  const [editModal, setEditModal] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const courses = ['BA', 'BCOM', 'BSC', 'BCA'];
  const semesters = [1, 2, 3, 4, 5, 6];

  const handleAddStudent = (e) => {
    e.preventDefault();
    const newStudent = {
      id: Date.now(),
      ...form,
      photo: URL.createObjectURL(form.photo),
    };
    setStudents([...students, newStudent]);
    setForm({ roll: '', first: '', last: '', mobile: '', course: '', sem: '', photo: '' });
  };

  const handleEditOpen = (student) => {
    setEditStudent({ ...student });
    setEditModal(true);
  };

  const handleEditSave = (e) => {
    e.preventDefault();
    setStudents((prev) =>
      prev.map((s) => (s.id === editStudent.id ? editStudent : s))
    );
    setEditModal(false);
  };

  const filteredStudents = students.filter((s) => {
    return (
      (!filterCourse || s.course === filterCourse) &&
      (!filterSem || s.sem.toString() === filterSem.toString()) &&
      (!searchTerm ||
        s.first.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.last.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans">
      <header className="bg-black bg-opacity-70 sticky top-0 z-50 p-4 shadow flex justify-between items-center">
        <h1 className="text-xl font-bold text-purple-400">Students</h1>
        <nav className="space-x-4 text-sm">
          <a href="/admin-dashboard" className="hover:text-purple-300">Dashboard</a>
          <a href="/fees" className="hover:text-purple-300">Fees</a>
          <a href="/assignments" className="hover:text-purple-300">Assignments</a>
          <a href="/subjects" className="hover:text-purple-300">Subjects</a>
          <Link to="/admin/logout" className="hover:text-red-400 font-bold">Logout</Link>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-4">Students List</h2>

        <div className="bg-gray-800 p-6 rounded-xl mb-8">
          <h3 className="text-lg font-semibold mb-4">Add New Student</h3>
          <form className="grid grid-cols-1 md:grid-cols-3 gap-4" onSubmit={handleAddStudent}>
            <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, photo: e.target.files[0] })} className="col-span-1 p-2 rounded bg-gray-700 border border-gray-600 text-white" />
            <input type="text" placeholder="Roll Number" value={form.roll} onChange={(e) => setForm({ ...form, roll: e.target.value })} className="p-2 rounded bg-gray-700 border border-gray-600" required />
            <input type="text" placeholder="First Name" value={form.first} onChange={(e) => setForm({ ...form, first: e.target.value })} className="p-2 rounded bg-gray-700 border border-gray-600" required />
            <input type="text" placeholder="Last Name" value={form.last} onChange={(e) => setForm({ ...form, last: e.target.value })} className="p-2 rounded bg-gray-700 border border-gray-600" required />
            <input type="text" placeholder="Mobile Number" value={form.mobile} onChange={(e) => { if (/^[0-9]*$/.test(e.target.value)) setForm({ ...form, mobile: e.target.value }); }} className="p-2 rounded bg-gray-700 border border-gray-600" required />
            <select value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} className="p-2 rounded bg-gray-700 border border-gray-600" required>
              <option value="">Select Course</option>
              {courses.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={form.sem} onChange={(e) => setForm({ ...form, sem: e.target.value })} className="p-2 rounded bg-gray-700 border border-gray-600" required>
              <option value="">Select Semester</option>
              {semesters.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <button type="submit" className="bg-purple-600 hover:bg-purple-800 transition py-2 px-4 rounded text-white font-semibold col-span-1 md:col-span-3">Add Student</button>
          </form>
        </div>

        {/* Filter + Total Section */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-4 flex-wrap">
            <input type="text" placeholder="Search by name" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="p-2 rounded bg-gray-800 border border-gray-600" />
            <select value={filterCourse} onChange={(e) => setFilterCourse(e.target.value)} className="p-2 rounded bg-gray-800 border border-gray-600">
              <option value="">Filter by Course</option>
              {courses.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={filterSem} onChange={(e) => setFilterSem(e.target.value)} className="p-2 rounded bg-gray-800 border border-gray-600">
              <option value="">Filter by Semester</option>
              {semesters.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="text-sm text-gray-300">
            Total Students: <span className="font-bold text-white">{filteredStudents.length}</span>
          </div>
        </div>

        {/* Students Table */}
        <div className="overflow-x-auto bg-gray-800 rounded-xl p-4">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-purple-400">
                <th>Photo</th>
                <th>Roll</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Mobile</th>
                <th>Course</th>
                <th>Semester</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className="border-t border-gray-700">
                  <td className="py-2">
                    <img src={student.photo} alt="Student" className="w-10 h-10 rounded-full" />
                  </td>
                  <td>{student.roll}</td>
                  <td>{student.first}</td>
                  <td>{student.last}</td>
                  <td>{student.mobile}</td>
                  <td>{student.course}</td>
                  <td>{student.sem}</td>
                  <td>
                    <button onClick={() => handleEditOpen(student)} className="text-sm bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 py-1 px-3 rounded shadow-md">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Editing {editStudent.first} {editStudent.last}</h3>
            <form className="space-y-4" onSubmit={handleEditSave}>
              <input type="text" value={editStudent.roll} onChange={(e) => setEditStudent({ ...editStudent, roll: e.target.value })} className="w-full p-2 rounded bg-gray-700 border border-gray-600" placeholder="Roll Number" />
              <input type="text" value={editStudent.first} onChange={(e) => setEditStudent({ ...editStudent, first: e.target.value })} className="w-full p-2 rounded bg-gray-700 border border-gray-600" placeholder="First Name" />
              <input type="text" value={editStudent.last} onChange={(e) => setEditStudent({ ...editStudent, last: e.target.value })} className="w-full p-2 rounded bg-gray-700 border border-gray-600" placeholder="Last Name" />
              <input type="text" value={editStudent.mobile} onChange={(e) => setEditStudent({ ...editStudent, mobile: e.target.value })} className="w-full p-2 rounded bg-gray-700 border border-gray-600" placeholder="Mobile Number" />
              <select value={editStudent.course} onChange={(e) => setEditStudent({ ...editStudent, course: e.target.value })} className="w-full p-2 rounded bg-gray-700 border border-gray-600">
                <option value="">Select Course</option>
                {courses.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={editStudent.sem} onChange={(e) => setEditStudent({ ...editStudent, sem: e.target.value })} className="w-full p-2 rounded bg-gray-700 border border-gray-600">
                <option value="">Select Semester</option>
                {semesters.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setEditModal(false)} className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded">Cancel</button>
                <button type="submit" className="bg-green-600 hover:bg-green-800 px-4 py-2 rounded">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="text-center text-sm text-gray-500 mt-12 p-6">
        &copy; 2025 JITM Kuchaman | Admin Panel
      </footer>
    </div>
  );
};

export default AddStudents;
