import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  
  // States cho các bộ lọc (Phục vụ UI)
  const [searchTerm, setSearchTerm] = useState("");
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);

  // Hàm load danh sách nhân viên
  const loadEmployees = () => {
    fetch("http://localhost:5000/api/employees")
      .then((res) => res.json())
      .then((data) => setEmployees(data))
      .catch((err) => console.error("Lỗi tải danh sách:", err));
  };

  // Hàm load dữ liệu cho dropdown lọc
  const loadFilters = () => {
    fetch("http://localhost:5000/api/departments")
      .then((r) => r.json())
      .then((data) => setDepartments(data))
      .catch(() => {});
      
    fetch("http://localhost:5000/api/positions")
      .then((r) => r.json())
      .then((data) => setPositions(data))
      .catch(() => {});
  };

  useEffect(() => {
    loadEmployees();
    loadFilters();
  }, []);

  const deleteEmployee = (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa nhân viên này? (Hệ thống sẽ chặn nếu có dữ liệu Lương/Cổ tức)")) return;
    
    fetch(`http://localhost:5000/api/employees/${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then((rs) => {
        alert(rs.msg);
        if (rs.status === "success") loadEmployees();
      });
  };

  return (
    <div className="container-fluid" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh", padding: "20px" }}>
      {/* Header & Các nút hành động chính */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-0">Hồ sơ Nhân viên</h3>
          <small className="text-muted">Quản lý thông tin, tìm kiếm và đồng bộ dữ liệu</small>
        </div>
        <div>
          <button className="btn btn-outline-success me-2 bg-white shadow-sm">
            <i className="bi bi-arrow-repeat me-2"></i> Đồng bộ PAYROLL
          </button>
          <Link to="/employees/add" className="btn btn-primary shadow-sm">
            <i className="bi bi-plus-lg me-2"></i> Thêm Nhân viên
          </Link>
        </div>
      </div>

      {/* Thanh Công cụ Lọc & Tìm kiếm (Filter Bar) */}
      <div className="card border-0 shadow-sm rounded-3 mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0"><i className="bi bi-search text-muted"></i></span>
                <input 
                  type="text" 
                  className="form-control border-start-0 ps-0" 
                  placeholder="Tìm kiếm theo tên..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select className="form-select text-muted">
                <option value="">Tất cả Phòng ban</option>
                {departments.map(d => <option key={d.DepartmentID} value={d.DepartmentID}>{d.DepartmentName}</option>)}
              </select>
            </div>
            <div className="col-md-3">
              <select className="form-select text-muted">
                <option value="">Tất cả Vị trí</option>
                {positions.map(p => <option key={p.PositionID} value={p.PositionID}>{p.PositionName}</option>)}
              </select>
            </div>
            <div className="col-md-3">
              <select className="form-select text-muted">
                <option value="">Tất cả Trạng thái</option>
                <option value="Active">Đang làm việc</option>
                <option value="Inactive">Đã nghỉ việc</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Bảng Dữ liệu */}
      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-muted" style={{ fontSize: "0.85rem", letterSpacing: "0.5px" }}>
                <tr>
                  <th className="text-center py-3">ID</th>
                  <th className="py-3">HỌ VÀ TÊN</th>
                  <th className="py-3">PHÒNG BAN</th>
                  <th className="py-3">VỊ TRÍ</th>
                  <th className="py-3">TRẠNG THÁI</th>
                  <th className="text-center py-3" style={{ width: "150px" }}>THAO TÁC</th>
                </tr>
              </thead>
              <tbody>
                {employees.length > 0 ? employees.map((emp) => (
                  <tr key={emp.EmployeeID}>
                    <td className="text-center fw-bold text-secondary">#{emp.EmployeeID}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex justify-content-center align-items-center me-3" style={{ width: "35px", height: "35px", fontWeight: "bold" }}>
                          {emp.FullName.charAt(0)}
                        </div>
                        <span className="fw-medium">{emp.FullName}</span>
                      </div>
                    </td>
                    <td>{emp.Department || "N/A"}</td>
                    <td>{emp.Position || "N/A"}</td>
                    <td>
                      <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2 py-1">
                        Active
                      </span>
                    </td>
                    <td className="text-center">
                      <Link to={`/employees/${emp.EmployeeID}`} className="btn btn-sm btn-light text-primary me-1 border" title="Chỉnh sửa">
                        <i className="bi bi-pencil-square"></i>
                      </Link>
                      <button onClick={() => deleteEmployee(emp.EmployeeID)} className="btn btn-sm btn-light text-danger border" title="Xóa">
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-5">
                      <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                      Chưa có dữ liệu nhân viên hoặc Backend chưa kết nối.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}