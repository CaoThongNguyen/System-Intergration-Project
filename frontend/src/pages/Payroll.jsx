import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";

export default function Payroll() {
  const [salaries, setSalaries] = useState([]);
  const [filteredSalaries, setFilteredSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [monthFilter, setMonthFilter] = useState("2024-09");
  const [deptFilter, setDeptFilter] = useState("Tất cả phòng ban");

  useEffect(() => {
    fetch("http://localhost:5000/api/salaries")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        setSalaries(data);
        setFilteredSalaries(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleFilter = () => {
    let result = salaries;
    
    if (monthFilter) {
      result = result.filter(s => {
        const d = new Date(s.SalaryMonth);
        const yyyyMm = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        return yyyyMm === monthFilter;
      });
    }
    
    if (deptFilter && deptFilter !== "Tất cả phòng ban") {
      result = result.filter(s => s.DepartmentName === deptFilter);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(s => 
        (s.FullName && s.FullName.toLowerCase().includes(term)) || 
        (s.EmployeeID && s.EmployeeID.toString().includes(term))
      );
    }
    
    setFilteredSalaries(result);
  };

  const handleExport = () => {
    if (filteredSalaries.length === 0) {
      alert("Không có dữ liệu để xuất!");
      return;
    }

    // Chuẩn bị dữ liệu để xuất
    const dataToExport = filteredSalaries.map((salary, index) => ({
      "STT": index + 1,
      "Kỳ Lương": salary.SalaryMonth,
      "Mã NV": salary.EmployeeID,
      "Họ Tên": salary.FullName,
      "Phòng Ban": salary.DepartmentName || "Chưa có",
      "Lương Cơ Bản (VNĐ)": salary.BaseSalary,
      "Phụ Cấp (VNĐ)": salary.Bonus,
      "Khấu Trừ (VNĐ)": salary.Deductions,
      "Thực Lãnh (VNĐ)": salary.NetSalary,
      "Trạng Thái": salary.Status
    }));

    // Tạo worksheet và workbook
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "BangLuong");

    // Đặt tên file theo kỳ lương nếu có
    const fileName = `Bang_Luong_${monthFilter ? monthFilter.replace("-", "_") : "Tat_Ca"}.xlsx`;
    
    // Xuất file
    XLSX.writeFile(workbook, fileName);
  };

  const handleShowDetail = (salary) => {
    alert(`Chi tiết lương của nhân viên: ${salary.FullName}
Phòng ban: ${salary.DepartmentName}
Kỳ lương: ${salary.SalaryMonth}
---------------------------------
Lương cơ bản: ${formatCurrency(salary.BaseSalary)}
Phụ cấp: ${formatCurrency(salary.Bonus)}
Khấu trừ: ${formatCurrency(salary.Deductions)}
---------------------------------
Thực lãnh: ${formatCurrency(salary.NetSalary)}`);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Get unique departments for the dropdown
  const uniqueDepts = [...new Set(salaries.map(s => s.DepartmentName))];

  return (
    <div className="container-fluid" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh", padding: "20px" }}>
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-0">Quản lý Bảng Lương</h3>
          <small className="text-muted">Tổng hợp và kiểm tra dữ liệu lương hàng tháng</small>
        </div>
        <div>
          <button className="btn btn-success shadow-sm" onClick={handleExport}>
            <i className="bi bi-file-earmark-excel me-2"></i> Xuất Báo Cáo
          </button>
        </div>
      </div>

      {/* Filter Bar riêng của Bảng lương */}
      <div className="card border-0 shadow-sm rounded-3 mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-center">
            <div className="col-md-3">
              <label className="form-label text-muted small fw-bold mb-1">Kỳ lương (Tháng/Năm)</label>
              <input type="month" className="form-control" value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} />
            </div>
            <div className="col-md-3">
              <label className="form-label text-muted small fw-bold mb-1">Phòng ban</label>
              <select className="form-select" value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
                <option value="Tất cả phòng ban">Tất cả phòng ban</option>
                {uniqueDepts.map((dept, idx) => (
                  <option key={idx} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label text-muted small fw-bold mb-1">Tìm kiếm Nhân viên</label>
              <input type="text" className="form-control" placeholder="Nhập tên hoặc mã NV..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="col-md-2 d-flex align-items-end">
              <button className="btn btn-primary w-100" onClick={handleFilter}>Lọc dữ liệu</button>
            </div>
          </div>
        </div>
      </div>

      {/* Bảng Dữ liệu Lương */}
      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-muted" style={{ fontSize: "0.85rem", letterSpacing: "0.5px" }}>
                <tr>
                  <th className="py-3 px-4">KỲ LƯƠNG</th>
                  <th className="py-3 px-4">NHÂN VIÊN</th>
                  <th className="py-3 text-end">LƯƠNG CƠ BẢN</th>
                  <th className="py-3 text-end">PHỤ CẤP</th>
                  <th className="py-3 text-end">KHẤU TRỪ</th>
                  <th className="py-3 text-end">THỰC LÃNH</th>
                  <th className="text-center py-3">TRẠNG THÁI</th>
                  <th className="text-center py-3">CHI TIẾT</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan="8" className="text-center py-4">Đang tải dữ liệu...</td>
                  </tr>
                )}
                {error && (
                  <tr>
                    <td colSpan="8" className="text-center py-4 text-danger">Lỗi: {error}</td>
                  </tr>
                )}
                {!loading && !error && filteredSalaries.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center py-4">Không có dữ liệu bảng lương</td>
                  </tr>
                )}
                {!loading && !error && filteredSalaries.map((salary) => (
                  <tr key={salary.SalaryID}>
                    <td className="px-4 fw-medium">{salary.SalaryMonth}</td>
                    <td className="px-4">
                      <div className="fw-bold text-dark">{salary.FullName}</div>
                      <small className="text-muted">{salary.DepartmentName}</small>
                    </td>
                    <td className="text-end fw-medium">{formatCurrency(salary.BaseSalary)}</td>
                    <td className="text-end text-success">+ {formatCurrency(salary.Bonus)}</td>
                    <td className="text-end text-danger">- {formatCurrency(salary.Deductions)}</td>
                    <td className="text-end fw-bold text-primary fs-6">{formatCurrency(salary.NetSalary)}</td>
                    <td className="text-center">
                      <span className="badge bg-success">{salary.Status}</span>
                    </td>
                    <td className="text-center">
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => handleShowDetail(salary)}>
                        <i className="bi bi-eye"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}