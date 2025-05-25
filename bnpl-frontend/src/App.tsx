// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LoginPage from "./auth/LoginPage";
import RegisterPage from "./auth/RegisterPage";
import MerchantDashboard from "./merchant/MerchantDashboard";
import CreatePlanForm from "./merchant/CreatePlanForm";
import UserDashboard from "./user/UserDashboard";
import PayInstallment from "./user/PayInstallment";
import { AuthProvider } from "./auth/AuthProvider";
import { PrivateRoute } from "./auth/PrivateRoute";
import { RoleRoute } from "./auth/RoleRoute";
import Navbar from "./components/Navbar"; 
import { useAuth } from "./auth/useAuth";

function AppRoutes() {
  const { accessToken } = useAuth();

  return (
    <>
      {/* ✅ Show Navbar only when logged in */}
      {accessToken && <Navbar />}

      <Routes>
        {/* Public */}
        <Route path="/" element={<Navigate to="/register" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Merchant Only */}
        <Route
          path="/merchant"
          element={
            <PrivateRoute>
              <RoleRoute allowedRole="merchant">
                <MerchantDashboard />
              </RoleRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/merchant/create-plan"
          element={
            <PrivateRoute>
              <RoleRoute allowedRole="merchant">
                <CreatePlanForm />
              </RoleRoute>
            </PrivateRoute>
          }
        />

        {/* Customer Only */}
        <Route
          path="/user"
          element={
            <PrivateRoute>
              <RoleRoute allowedRole="customer">
                <UserDashboard />
              </RoleRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/installment/:id/pay"
          element={
            <PrivateRoute>
              <RoleRoute allowedRole="customer">
                <PayInstallment />
              </RoleRoute>
            </PrivateRoute>
          }
        />
      </Routes>

      {/* Toast notifications */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        pauseOnFocusLoss={false}
        theme="colored"
      />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
