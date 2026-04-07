import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const navigate = useNavigate();

  const [adminType, setAdminType] = useState('Mess'); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json(); // ✅ FIXED
      console.log("Response:", data);

      if (!response.ok) {
        throw new Error(data.msg || "Login Failed");
      }
    
      //console.log(data.data?.hostel_id)
      localStorage.setItem("hostel_id", data.data?.hostel_id || email);

      if (adminType === "Mess") {
        navigate("/admin/mess-menu");
      } else {
        navigate("/admin/transport");
      }

    } catch (error) {
      console.error("Login error:", error);
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center py-12 px-4">

      <div className="w-full max-w-lg">
        <div className="bg-white rounded-3xl shadow-lg p-8">

          <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>

          {/* Toggle */}
          <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => setAdminType('Mess')}
              className={`flex-1 py-2 rounded-lg ${
                adminType === 'Mess' ? 'bg-white shadow' : ''
              }`}
            >
              Mess Admin
            </button>

            <button
              type="button"
              onClick={() => setAdminType('Transport')}
              className={`flex-1 py-2 rounded-lg ${
                adminType === 'Transport' ? 'bg-white shadow' : ''
              }`}
            >
              Transport Admin
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)} // ✅ FIXED
              placeholder="Enter Email"
              className="w-full px-4 py-3 border rounded-lg"
            />

            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Enter Password"
              className="w-full px-4 py-3 border rounded-lg"
            />

            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg"
            >
              Login
            </button>

          </form>

        </div>
      </div>
    </div>
  );
};

export default AdminLogin;