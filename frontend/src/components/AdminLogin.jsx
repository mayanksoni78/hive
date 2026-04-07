import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const navigate  = useNavigate();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/admin/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
  email,
  password,
  department: adminType === "Mess" ? "Mess_Manager" : "Transport_Manager"
})
      });

      const data = await response.json();

      if (!response.ok || data.msg !== "Login successful") {
        throw new Error(data.msg || "Login failed");
      }

      // Save admin info to localStorage
      localStorage.setItem("admin", JSON.stringify(data.data));
      localStorage.setItem("hostel_id", data.data.hostel_id || "");

      // Route based on department
      const dept = data.data.department;
      if (dept === "Mess_Manager") {
        navigate("/admin/mess-menu");
      } else if (dept === "Transport_Manager") {
        navigate("/admin/transport");
      } else if (dept === "Hostel_Admin") {
        navigate("/dashboard-hostel");
      } else {
        navigate("/dashboard-hostel");
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

          {/* Header */}
          <div className="bg-gray-900 px-8 py-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-white/10 rounded-2xl text-2xl mb-4">👤</div>
            <h1 className="text-2xl font-bold text-white">Admin Login</h1>
            <p className="text-gray-400 text-sm mt-1">Mess Manager · Transport Manager</p>
          </div>

          <div className="p-8">

            {/* Error */}
            {error && (
              <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email" required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@hostel.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-400 bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"} required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-400 bg-gray-50 pr-16"
                  />
                  <button type="button"
                    onClick={() => setShowPass(p => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-semibold hover:text-gray-600">
                    {showPass ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                type="submit" disabled={loading}
                className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold text-sm hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>Signing in…</>
                ) : "Sign In"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-400">
                Hostel owner?{" "}
                <a href="/login/hostel" className="text-gray-700 font-semibold hover:underline">
                  Hostel Login →
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
