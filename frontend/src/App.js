import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
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

// Import trang Login mới
import Login from "./pages/Login";

function App() {
  // State quản lý đăng nhập (Mặc định là false - chưa đăng nhập)
  // Thực tế sau này bạn sẽ lấy từ localStorage hoặc Token
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        {/* 1. ROUTE PUBLIC: Không có Layout */}
        <Route 
          path="/login" 
          element={<Login onLogin={() => setIsAuthenticated(true)} />} 
        />

        {/* 2. ROUTES PRIVATE: Bọc Layout và kiểm tra đăng nhập */}
        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
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
              // Nếu chưa đăng nhập mà cố vào, tự động đá về trang /login
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;