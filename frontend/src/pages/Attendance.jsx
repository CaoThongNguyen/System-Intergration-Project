import React, { useState, useEffect } from "react";

export default function Attendance() {
  const [attendances, setAttendances] = useState([]);
  const [filteredAttendances, setFilteredAttendances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [monthFilter, setMonthFilter] = useState("2024-09");

  useEffect(() => {
    fetch("http://localhost:5000/api/attendance")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        setAttendances(data);
        setFilteredAttendances(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleFilter = () => {
    let result = attendances;
    
    if (monthFilter) {
      result = result.filter(a => {
        const d = new Date(a.AttendanceMonth);
        const yyyyMm = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        return yyyyMm === monthFilter;
      });
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(a => 
        (a.FullName && a.FullName.toLowerCase().includes(term)) || 
        (a.EmployeeID && a.EmployeeID.toString().includes(term))
      );
    }
    
    setFilteredAttendances(result);
  };

  return (
    <div className="container-fluid" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh", padding: "20px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-0">Quản lý Điểm danh</h3>
          <small className="text-muted">Theo dõi ngày công và ngày phép của nhân viên theo tháng</small>
        </div>
      </div>

      {/* Thanh công cụ lọc */}
      <div className="card border-0 shadow-sm rounded-3 mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-center">
            <div className="col-md-3">
              <label className="form-label text-muted small fw-bold mb-1">Tháng/Năm</label>
              <input type="month" className="form-control" value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} />
            </div>
            <div className="col-md-7">
              <label className="form-label text-muted small fw-bold mb-1">Tìm kiếm Nhân viên</label>
              <input type="text" className="form-control" placeholder="Tên hoặc mã NV..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="col-md-2 d-flex align-items-end">
              <button className="btn btn-primary w-100" onClick={handleFilter}><i className="bi bi-funnel me-2"></i>Lọc</button>
            </div>
          </div>
        </div>
      </div>

      {/* Bảng Điểm danh */}
      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-muted small">
                <tr>
                  <th className="py-3 px-4">KỲ CHẤM CÔNG</th>
                  <th className="py-3">NHÂN VIÊN</th>
                  <th className="py-3 text-center">NGÀY LÀM VIỆC</th>
                  <th className="py-3 text-center">NGÀY VẮNG</th>
                  <th className="py-3 text-center">NGÀY PHÉP</th>
                  <th className="py-3 text-center">TRẠNG THÁI</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan="6" className="text-center py-4">Đang tải dữ liệu...</td>
                  </tr>
                )}
                {error && (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-danger">Lỗi: {error}</td>
                  </tr>
                )}
                {!loading && !error && filteredAttendances.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-4">Không có dữ liệu điểm danh</td>
                  </tr>
                )}
                {!loading && !error && filteredAttendances.map((att) => (
                  <tr key={att.AttendanceID}>
                    <td className="px-4 fw-medium">{att.AttendanceMonth}</td>
                    <td>
                      <div className="fw-bold text-dark">{att.FullName}</div>
                      <small className="text-muted">{att.DepartmentName}</small>
                    </td>
                    <td className="text-center text-success fw-bold">{att.WorkDays}</td>
                    <td className="text-center text-danger fw-bold">{att.AbsentDays}</td>
                    <td className="text-center text-warning fw-bold">{att.LeaveDays}</td>
                    <td className="text-center">
                      {att.AbsentDays > 0 ? (
                        <span className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25">Có vắng mặt</span>
                      ) : (
                        <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25">Đầy đủ</span>
                      )}
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