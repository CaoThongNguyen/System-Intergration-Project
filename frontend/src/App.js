import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard"; // <-- Import Dashboard mới
import Employees from "./pages/Employees";
import EmployeeAdd from "./pages/EmployeeAdd";
import EmployeeEdit from "./pages/EmployeeEdit";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} /> {/* <-- Đổi trang chủ thành Dashboard */}
          <Route path="/employees" element={<Employees />} /> {/* <-- Dời danh sách sang /employees */}
          <Route path="/employees/add" element={<EmployeeAdd />} />
          <Route path="/employees/:id" element={<EmployeeEdit />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;