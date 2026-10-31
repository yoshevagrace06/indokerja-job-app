import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import JobList from "./pages/JobList";
import JobDetail from "./pages/JobDetail";
import MyApplications from "./pages/MyApplications";
import CreateJob from "./pages/CreateJob";
import Applicants from "./pages/Applicants";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="JOB_SEEKER">
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/jobs"
          element={
            <ProtectedRoute>
              <JobList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/jobs/:id"
          element={
            <ProtectedRoute>
              <JobDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/jobs/create"
          element={
            <ProtectedRoute role="COMPANY">
              <CreateJob />
            </ProtectedRoute>
          }
        />

        <Route
          path="/jobs/:jobId/applicants"
          element={
            <ProtectedRoute role="COMPANY">
              <Applicants />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-applications"
          element={
            <ProtectedRoute role="JOB_SEEKER">
              <MyApplications />
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;