import React, { useState } from "react";
import axios from "axios";

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
 const [data,setdata]=useState(JSON.parse(localStorage.getItem('adminUsername'))|| '');
  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  

  try {
    const response = await axios.post('http://localhost:3000/api/adminlogin', {
      name:formData.username, 
      password:formData.password
    });
    let data=JSON.stringify(formData.username);
    localStorage.setItem('adminUsername', data);
    
    if (response.status === 200) {
      console.log("Login successful", response.data);
      if(data){
      window.location.href = "/admin-dashboard"; 
      }
    } else {
      console.error("Login failed", response.data);
      alert("Invalid admin credentials");
    }
  } catch (error) {
    console.error("Error during login:", error);
    alert("Invalid admin credentials or server error");
  }
};

  return (
    <div className="bg-gray-900 text-white flex items-center justify-center min-h-screen">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-yellow-400 mb-6">
          🛠️ Admin Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm mb-1">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter Username"
              required
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-600 hover:bg-yellow-800 py-2 rounded font-semibold transition duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
