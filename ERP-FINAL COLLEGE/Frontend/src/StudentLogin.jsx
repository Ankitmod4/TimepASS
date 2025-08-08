import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
 import axios from 'axios';
const StudentLogin = () => {
  const [roll, setRoll] = useState('');
  const [dob, setDob] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

 

const handleLogin = async () => {
  try {
    const response = await axios.post('http://localhost:3000/api/login', {
      rollNumber: roll,
      Password: dob,
    });
     let rollno=JSON.stringify(roll);
    localStorage.setItem('studentRollNumber', rollno);

    if (response.status === 200) {
     if(localStorage.getItem('studentRollNumber')){
     navigate(`/student-dashboard`);
     }
     else{
      navigate(`/`);
     }

    } else {
      setError('Invalid Roll Number or Password');
    }
  } catch (error) {
    setError('Invalid Roll Number or Password');
    console.error('Login error:', error);
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-purple-400 mb-6">
          🎓 Student Login
        </h2>

        <div className="mb-4">
          <label className="block text-sm mb-1">Roll Number</label>
          <input
            type="text"
            value={roll}
            onChange={(e) => setRoll(e.target.value)}
            placeholder="Enter Roll Number"
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            placeholder="Enter Password"
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {error && (
          <div className="mb-4 text-center text-red-400 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          className="w-full py-2 rounded bg-purple-600 hover:bg-purple-800 font-semibold transition duration-300"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default StudentLogin;
