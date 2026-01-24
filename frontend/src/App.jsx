import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Pages
import AttractScreen from "./pages/AttractScreen";
import LanguageSelection from "./pages/LanguageSelection";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminApplications from "./pages/AdminApplications";
import AdminGrievances from "./pages/AdminGrievances";
import AdminSchemes from "./pages/AdminSchemes";
import AdminAdvisories from "./pages/AdminAdvisories";
import AdminPolicies from "./pages/AdminPolicies";
import AdminTariffs from "./pages/AdminTariffs";
import NotFound from "./pages/NotFound";
import Grievances from "./pages/Grievances";
import TrackStatus from "./pages/TrackStatus";
import Accessibility from "./pages/Accessibility";
import Profile from "./pages/Profile";
import Tariffs from "./pages/Tariffs";
import Policies from "./pages/Policies";

// Service Hubs
import ElectricityHub from "./components/services/electricity/ElectricityHub";
import WaterHub from "./components/services/water/WaterHub";
import GasHub from "./components/services/gas/GasHub";
import SanitationHub from "./components/services/sanitation/SanitationHub";
import SolarHub from "./components/services/solar/SolarHub";

// Electricity Services
import NewConnection from "./components/services/electricity/NewConnection";
import ElectricityBilling from "./components/services/electricity/Billing";

// Water Services
import WaterNewConnection from "./components/services/water/NewConnection";
import WaterQualityTest from "./components/services/water/WaterQualityTest";

// Gas Services
import GasNewConnection from "./components/services/gas/NewConnection";

// Sanitation Services
import SanitationNewConnection from "./components/services/sanitation/NewConnection";

// Billing & Payments
import WaterBilling from "./components/services/water/Billing";
import GasBilling from "./components/services/gas/Billing";
import SanitationBilling from "./components/services/sanitation/Billing";
import AllBills from "./pages/AllBills";
import AllUsage from "./pages/AllUsage";
import MyApplications from "./pages/MyApplications";

function App() {
  const { user, isAdmin } = useAuth();

  const Protected = (Component) =>
    user ? <Component /> : <Navigate to="/login" replace />;
  const ProtectedAdmin = (Component) =>
    isAdmin ? <Component /> : <Navigate to="/admin/login" replace />;

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<AttractScreen />} />
        <Route path="/language" element={<LanguageSelection />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/accessibility" element={<Accessibility />} />
        <Route path="/tariffs" element={<Tariffs />} />
        <Route path="/policies" element={<Policies />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={Protected(Dashboard)} />
        <Route path="/profile" element={Protected(Profile)} />
        <Route
          path="/admin/dashboard"
          element={ProtectedAdmin(AdminDashboard)}
        />
        <Route
          path="/admin/applications"
          element={ProtectedAdmin(AdminApplications)}
        />
        <Route
          path="/admin/grievances"
          element={ProtectedAdmin(AdminGrievances)}
        />
        <Route path="/admin/schemes" element={ProtectedAdmin(AdminSchemes)} />
        <Route
          path="/admin/advisories"
          element={ProtectedAdmin(AdminAdvisories)}
        />
        <Route path="/admin/policies" element={ProtectedAdmin(AdminPolicies)} />
        <Route path="/admin/tariffs" element={ProtectedAdmin(AdminTariffs)} />

        {/* ================= ELECTRICITY ROUTES ================= */}
        <Route path="/electricity">
          <Route index element={Protected(ElectricityHub)} />
          <Route path="new-connection" element={Protected(NewConnection)} />
          <Route path="billing" element={Protected(ElectricityBilling)} />
        </Route>

        {/* ================= OTHER SERVICE HUBS ================= */}
        <Route path="/water" element={Protected(WaterHub)} />
        <Route
          path="/water/new-connection"
          element={Protected(WaterNewConnection)}
        />
        <Route
          path="/water/quality-test"
          element={Protected(WaterQualityTest)}
        />
        <Route path="/water/billing" element={Protected(WaterBilling)} />
        <Route path="/gas" element={Protected(GasHub)} />
        <Route path="/gas/new-lpg" element={Protected(GasNewConnection)} />
        <Route path="/gas/new-png" element={Protected(GasNewConnection)} />
        <Route path="/gas/billing" element={Protected(GasBilling)} />
        <Route path="/sanitation" element={Protected(SanitationHub)} />
        <Route
          path="/sanitation/new-connection"
          element={Protected(SanitationNewConnection)}
        />
        <Route
          path="/sanitation/billing"
          element={Protected(SanitationBilling)}
        />
        <Route path="/solar" element={Protected(SolarHub)} />

        {/* Billing */}
        <Route path="/all-bills" element={Protected(AllBills)} />
        <Route path="/all-usage" element={Protected(AllUsage)} />
        <Route path="/my-applications" element={Protected(MyApplications)} />
        <Route path="/grievances" element={Protected(Grievances)} />
        <Route path="/track-status" element={Protected(TrackStatus)} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
