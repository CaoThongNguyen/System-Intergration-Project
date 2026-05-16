import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";

import AdminDashboard from "./pages/AdminDashboard";
import HRDashboard from "./pages/HRDashboard";
import PayrollDashboard from "./pages/PayrollDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";

import Employees from "./pages/Employees";
import EmployeeAdd from "./pages/EmployeeAdd";
import EmployeeEdit from "./pages/EmployeeEdit";
import Departments from "./pages/Departments";
import Positions from "./pages/Positions";
import Payroll from "./pages/Payroll";
import Attendance from "./pages/Attendance";
import Reports from "./pages/Reports";
import Alerts from "./pages/Alerts";
import Security from "./pages/Security";

import Login from "./pages/Login";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Đọc thông tin user từ localStorage nếu đã đăng nhập trước đó
    const user = localStorage.getItem("currentUser");
    if (user) {
      const parsedUser = JSON.parse(user);
      setIsAuthenticated(true);
      setUserRole(parsedUser.role_code);
    }
  }, []);

  const handleLogin = (user) => {
    localStorage.setItem("currentUser", JSON.stringify(user));
    setIsAuthenticated(true);
    setUserRole(user.role_code);
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setIsAuthenticated(false);
    setUserRole(null);
  };

  // Component render Dashboard tương ứng với Role
  const RoleBasedDashboard = () => {
    if (userRole === "ADMIN") return <AdminDashboard />;
    if (userRole === "HR_MANAGER") return <HRDashboard />;
    if (userRole === "ACCOUNTANT") return <PayrollDashboard />;
    if (userRole === "STAFF") return <EmployeeDashboard />;
    return <AdminDashboard />; // Mặc định
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} 
        />

        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <Layout onLogout={handleLogout}>
                <Routes>
                  <Route path="/" element={<RoleBasedDashboard />} />
                  <Route path="/employees" element={<Employees />} />
                  <Route path="/employees/add" element={<EmployeeAdd />} />
                  <Route path="/employees/:id" element={<EmployeeEdit />} />
                  <Route path="/departments" element={<Departments />} />
                  <Route path="/positions" element={<Positions />} />
                  <Route path="/payroll" element={<Payroll />} />
                  <Route path="/attendance" element={<Attendance />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/alerts" element={<Alerts />} />
                  <Route path="/security" element={<Security />} />
                </Routes>
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;