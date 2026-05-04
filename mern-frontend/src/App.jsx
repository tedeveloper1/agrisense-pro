import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';

import FarmerDashboard from './pages/farmer/Dashboard';
import FarmerFarms from './pages/farmer/Farms';
import FarmerCrops from './pages/farmer/Crops';
import FarmerIoT from './pages/farmer/IoTStatus';
import FarmerRecommendations from './pages/farmer/Recommendations';
import FarmerAlerts from './pages/farmer/Alerts';
import FarmerWeather from './pages/farmer/Weather';
import FarmerHistory from './pages/farmer/History';
import FarmerProfile from './pages/farmer/Profile';
import DiseasePrediction from './pages/farmer/DiseasePrediction';

import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminDevices from './pages/admin/Devices';
import AdminAnalytics from './pages/admin/Analytics';
import AdminNotifications from './pages/admin/Notifications';
import AdminSystemHealth from './pages/admin/SystemHealth';
import AdminSettings from './pages/admin/Settings';

import ExpertDashboard from './pages/expert/Dashboard';
import ExpertReviews from './pages/expert/Reviews';
import ExpertInterventions from './pages/expert/Interventions';
import ExpertAdvisories from './pages/expert/Advisories';
import ExpertFarmData from './pages/expert/FarmData';

function AppRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (user.role === 'expert') return <Navigate to="/expert/dashboard" replace />;
  return <Navigate to="/farmer/dashboard" replace />;
}

const wrap = (el) => <DashboardLayout>{el}</DashboardLayout>;

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/app" element={<AppRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* Farmer */}
      <Route path="/farmer/dashboard" element={<ProtectedRoute roles={['farmer','admin']}>{wrap(<FarmerDashboard />)}</ProtectedRoute>} />
      <Route path="/farmer/farms" element={<ProtectedRoute roles={['farmer','admin']}>{wrap(<FarmerFarms />)}</ProtectedRoute>} />
      <Route path="/farmer/crops" element={<ProtectedRoute roles={['farmer','admin']}>{wrap(<FarmerCrops />)}</ProtectedRoute>} />
      <Route path="/farmer/iot-status" element={<ProtectedRoute roles={['farmer','admin']}>{wrap(<FarmerIoT />)}</ProtectedRoute>} />
      <Route path="/farmer/recommendations" element={<ProtectedRoute roles={['farmer','admin']}>{wrap(<FarmerRecommendations />)}</ProtectedRoute>} />
      <Route path="/farmer/alerts" element={<ProtectedRoute roles={['farmer','admin']}>{wrap(<FarmerAlerts />)}</ProtectedRoute>} />
      <Route path="/farmer/weather" element={<ProtectedRoute roles={['farmer','admin']}>{wrap(<FarmerWeather />)}</ProtectedRoute>} />
      <Route path="/farmer/disease" element={<ProtectedRoute roles={['farmer','admin']}>{wrap(<DiseasePrediction />)}</ProtectedRoute>} />
      <Route path="/farmer/history" element={<ProtectedRoute roles={['farmer','admin']}>{wrap(<FarmerHistory />)}</ProtectedRoute>} />
      <Route path="/farmer/profile" element={<ProtectedRoute roles={['farmer','admin']}>{wrap(<FarmerProfile />)}</ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin/dashboard" element={<ProtectedRoute roles={['admin']}>{wrap(<AdminDashboard />)}</ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}>{wrap(<AdminUsers />)}</ProtectedRoute>} />
      <Route path="/admin/farmers" element={<ProtectedRoute roles={['admin']}>{wrap(<AdminUsers filterRole="farmer" />)}</ProtectedRoute>} />
      <Route path="/admin/experts" element={<ProtectedRoute roles={['admin']}>{wrap(<AdminUsers filterRole="expert" />)}</ProtectedRoute>} />
      <Route path="/admin/devices" element={<ProtectedRoute roles={['admin']}>{wrap(<AdminDevices />)}</ProtectedRoute>} />
      <Route path="/admin/analytics" element={<ProtectedRoute roles={['admin']}>{wrap(<AdminAnalytics />)}</ProtectedRoute>} />
      <Route path="/admin/notifications" element={<ProtectedRoute roles={['admin']}>{wrap(<AdminNotifications />)}</ProtectedRoute>} />
      <Route path="/admin/system-health" element={<ProtectedRoute roles={['admin']}>{wrap(<AdminSystemHealth />)}</ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute roles={['admin']}>{wrap(<AdminSettings />)}</ProtectedRoute>} />

      {/* Expert */}
      <Route path="/expert/dashboard" element={<ProtectedRoute roles={['expert','admin']}>{wrap(<ExpertDashboard />)}</ProtectedRoute>} />
      <Route path="/expert/reviews" element={<ProtectedRoute roles={['expert','admin']}>{wrap(<ExpertReviews />)}</ProtectedRoute>} />
      <Route path="/expert/recommendations" element={<ProtectedRoute roles={['expert','admin']}>{wrap(<ExpertReviews />)}</ProtectedRoute>} />
      <Route path="/expert/interventions" element={<ProtectedRoute roles={['expert','admin']}>{wrap(<ExpertInterventions />)}</ProtectedRoute>} />
      <Route path="/expert/advisories" element={<ProtectedRoute roles={['expert','admin']}>{wrap(<ExpertAdvisories />)}</ProtectedRoute>} />
      <Route path="/expert/farm-data" element={<ProtectedRoute roles={['expert','admin']}>{wrap(<ExpertFarmData />)}</ProtectedRoute>} />
      <Route path="/expert/profile" element={<ProtectedRoute roles={['expert','admin']}>{wrap(<FarmerProfile />)}</ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
