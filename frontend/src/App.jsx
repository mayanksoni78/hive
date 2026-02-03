import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/login.jsx";
import Signup from "./components/signup.jsx";
import Dashboard from "./components/dashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginHostel from "./components/hostel/login.jsx";
import HostelRegistration from "./components/hostel/registration.jsx";
import HostelDashboard from "./components/hostel/hostel.jsx";
import ComplainPage from "./Pages/ComplainPage.jsx";
import ComplainDashboard from "./components/ComplainDashboard.jsx"
import MessMenuDisplay from "./components/mess/MessMenuDisplay.jsx"; 
import MessMenuAdmin from './components/mess/MessMenuAdmin';
import TransportSchedule from './Pages/Transport_Schedule.jsx'


function App() {
  return (
    <Router>
      <Routes>

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path='login/hostel' element={<LoginHostel/>}/>
        <Route path='signup/hostel' element={<HostelRegistration/>}/>
        <Route path='dashboard-hostel' element={<HostelDashboard/>}/>
        <Route path="/mess-menu" element={<MessMenuDisplay />} />
        <Route path="/admin/mess-menu" element={<MessMenuAdmin />} />
        <Route path="/complain_page" element={<ComplainPage/>}/>
        <Route path="/complain_dashboard" element={<ComplainDashboard/>}/>
        <Route path="/transport_schedule" element={<TransportSchedule/>}/>
        {/* Protected route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
          
        {/* Default */}
        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>
    </Router>
  );
}

export default App;
