import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router';
import { useAuthStore } from './store/authStore';
import { ROLES } from './constants';
import Login from './pages/Login';
import CompanyDashboard from './pages/company/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import PostJob from './pages/company/PostJob';
// import MyJobs from './pages/company/MyJobsTable';
// import JobDetail from './pages/JobDetail';
import Home from './pages/Home';

// Protected Route Component
function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Root Redirect based on Role
function RootRedirect() {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  switch (user.role) {
    case ROLES.ADMIN:
      return <Navigate to="/dashboard/admin" replace />;
    case ROLES.COMPANY:
      return <Navigate to="/dashboard/company" replace />;
    default:
      return <Navigate to="/" replace />;
  }
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/jobs/:id" element={<JobDetail />} /> */}

        {/* Company Protected Routes */}
        <Route
          element={
            <ProtectedRoute allowedRoles={[ROLES.COMPANY]}>
              <Outlet />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard/company" element={<CompanyDashboard />} />
          <Route path="/dashboard/company/post-job" element={<PostJob />} />
          {/* <Route path="/dashboard/company/myjobs" element={<MyJobs />} /> */}
        </Route>

        {/* Admin Protected Routes */}
        <Route
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <Outlet />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
        </Route>

        {/* Root Redirect */}
        <Route path="/dashboard" element={<RootRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;