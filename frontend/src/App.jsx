import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/student/login.jsx";
import Signup from "./components/student/signup.jsx";
import Dashboard from "./components/dashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginHostel from "./components/hostel/login.jsx";
import HostelRegistration from "./components/hostel/registration.jsx";
import HostelDashboard from "./components/hostel/hostel.jsx";
import ComplainPage from "./Pages/ComplainPage.jsx";
import ComplainDashboard from "./components/complain/ComplainDashboard.jsx"
import MessMenuDisplay from "./components/mess/MessMenuDisplay.jsx"; 
import MessMenuAdmin from './components/mess/MessMenuAdmin';
import TransportSchedule from './Pages/Transport_Schedule.jsx'
import AddTransport from './components/tranaport/AddBus.jsx'
import NoticePage from './components/notice/NoticePage';
import StudentDashboard from "./Pages/StudentDashboard.jsx";
import Mycomplaints from "./Pages/MyComplaints.jsx";
import UpdateBus from "./components/tranaport/UpdateBus.jsx";
import Landing from "./Pages/LandingPage.jsx"
import Admin from "./components/admin/login.jsx"
function App() {
  return (
    <Router>
      <Routes>
        
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path='/hostel/login' element={<LoginHostel/>}/>
        <Route path='/hostel/signup' element={<HostelRegistration/>}/>
        <Route path='dashboard-hostel' element={<HostelDashboard/>}/>
        <Route path="/mess-menu" element={<MessMenuDisplay />} />
        <Route path="/admin/mess-menu" element={<MessMenuAdmin />} />
        <Route path="/complain_page" element={<ComplainPage/>}/>
        <Route path="/complain_dashboard" element={<ComplainDashboard/>}/>
        <Route path="/transport_schedule" element={<TransportSchedule/>}/>
         <Route path="/add_transport" element={<AddTransport/>}/>
         <Route path="/update_bus" element={<UpdateBus/>}/>
         <Route path="/notices" element={<NoticePage />} />
         <Route path="/student-dashboard" element={<StudentDashboard />} />
         <Route path="/my_complains" element={<Mycomplaints />} />
         <Route path="/admin/login" element={<Admin/>} />

         <Route path="/" element={<Landing />} />
        {/* Protected route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />        
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </Router>
  );
}

export default App;