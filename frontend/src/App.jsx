import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

// Pages
import AttractScreen from './pages/AttractScreen'
import LanguageSelection from './pages/LanguageSelection'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import NotFound from './pages/NotFound'

// Service Hubs
import ElectricityHub from './components/services/electricity/ElectricityHub'
import WaterHub from './components/services/water/WaterHub'
import GasHub from './components/services/gas/GasHub'
import SanitationHub from './components/services/sanitation/SanitationHub'
import SolarHub from './components/services/solar/SolarHub'

// Electricity Services
import NewConnection from './components/services/electricity/NewConnection'

// Billing & Payments
import AllBills from './pages/AllBills'
import AllUsage from './pages/AllUsage'

function App() {
  const { user } = useAuth()

  const Protected = (Component) =>
    user ? <Component /> : <Navigate to="/login" replace />

  return (
    <Router>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<AttractScreen />} />
        <Route path="/language" element={<LanguageSelection />} />
        <Route path="/login" element={<Login />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={Protected(Dashboard)} />

        {/* ================= ELECTRICITY ROUTES ================= */}
        <Route path="/electricity">
          <Route index element={Protected(ElectricityHub)} />
          <Route path="new-connection" element={Protected(NewConnection)} />
        </Route>

        {/* ================= OTHER SERVICE HUBS ================= */}
        <Route path="/water" element={Protected(WaterHub)} />
        <Route path="/gas" element={Protected(GasHub)} />
        <Route path="/sanitation" element={Protected(SanitationHub)} />
        <Route path="/solar" element={Protected(SolarHub)} />

        {/* Billing */}
        <Route path="/all-bills" element={Protected(AllBills)} />
        <Route path="/all-usage" element={Protected(AllUsage)} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Router>
  )
}

export default App
