import React, { useState, useEffect } from "react";

export default function Reports() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/reports")
      .then(res => res.json())
      .then(data => {
        setReportData(data);
        setLoading(false);
      });
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  if (loading) return <div className="p-4 text-center">Đang tải báo cáo...</div>;

  const totalEmp = Object.values(reportData.gender_distribution).reduce((a, b) => a + b, 0);
  const maleCount = reportData.gender_distribution["Nam"] || 0;
  const femaleCount = reportData.gender_distribution["Nữ"] || 0;
  const malePct = totalEmp ? Math.round((maleCount / totalEmp) * 100) : 0;
  const femalePct = totalEmp ? Math.round((femaleCount / totalEmp) * 100) : 0;

  // Tìm min/max salary để render chart
  const maxSalary = Math.max(...reportData.salary_trend.map(t => t.TotalSalary), 1);

  return (
    <div className="container-fluid" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh", padding: "20px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-0">Phân tích & Báo cáo</h3>
          <small className="text-muted">Tổng hợp dữ liệu Nhân sự, Lương, Điểm danh và Cổ tức</small>
        </div>
        <div>
          <button className="btn btn-outline-secondary me-2 bg-white shadow-sm">
            <i className="bi bi-filetype-csv me-2"></i> Xuất CSV
          </button>
          <button className="btn btn-primary shadow-sm">
            <i className="bi bi-file-earmark-pdf me-2"></i> Xuất PDF
          </button>
        </div>
      </div>

      <div className="row g-4 mb-4">
        {/* Card 1: Tổng quan Nhân sự */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3 h-100">
            <div className="card-body">
              <h6 className="fw-bold text-muted mb-4">PHÂN BỐ THEO GIỚI TÍNH</h6>
              <div className="d-flex align-items-center justify-content-center mb-3">
                <div style={{ 
                  width: "120px", height: "120px", borderRadius: "50%", 
                  background: `conic-gradient(#0d6efd 0% ${malePct}%, #e83e8c ${malePct}% 100%)` 
                }}></div>
              </div>
              <div className="d-flex justify-content-around text-center mt-4">
                <div>
                  <h5 className="fw-bold text-primary mb-0">{malePct}%</h5>
                  <small className="text-muted">Nam ({maleCount})</small>
                </div>
                <div>
                  <h5 className="fw-bold mb-0" style={{ color: "#e83e8c" }}>{femalePct}%</h5>
                  <small className="text-muted">Nữ ({femaleCount})</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Quỹ lương */}
        <div className="col-md-8">
          <div className="card border-0 shadow-sm rounded-3 h-100">
            <div className="card-body">
              <h6 className="fw-bold text-muted mb-4">XU HƯỚNG QUỸ LƯƠNG GẦN ĐÂY</h6>
              <div className="d-flex align-items-end justify-content-between pt-2" style={{ height: "140px" }}>
                {reportData.salary_trend.map((trend, idx) => {
                  const heightPct = trend.TotalSalary ? Math.round((trend.TotalSalary / maxSalary) * 100) : 0;
                  return (
                    <div key={idx} className="d-flex flex-column align-items-center w-100" title={formatCurrency(trend.TotalSalary)}>
                      <div className="bg-success rounded-top w-50" style={{ height: `${heightPct}%` }}></div>
                      <small className="text-muted mt-2">{trend.Month}</small>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bảng Dữ liệu chi tiết báo cáo */}
      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-header bg-white border-bottom-0 pt-4 pb-2">
          <h6 className="fw-bold">Phân bổ chi phí theo Phòng ban</h6>
        </div>
        <div className="card-body p-0">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light text-muted small">
              <tr>
                <th className="py-3 px-4">PHÒNG BAN</th>
                <th className="py-3 text-center">SỐ NHÂN VIÊN</th>
                <th className="py-3 text-end">TỔNG LƯƠNG CƠ BẢN</th>
                <th className="py-3 text-end">TỔNG PHỤ CẤP</th>
                <th className="py-3 text-end px-4">TỔNG CHI PHÍ</th>
              </tr>
            </thead>
            <tbody>
              {reportData.department_costs.map((dept, idx) => (
                <tr key={idx}>
                  <td className="px-4 fw-bold">{dept.DepartmentName}</td>
                  <td className="text-center">{dept.EmployeeCount}</td>
                  <td className="text-end">{formatCurrency(dept.TotalBase)}</td>
                  <td className="text-end text-success">+ {formatCurrency(dept.TotalBonus)}</td>
                  <td className="text-end fw-bold text-primary px-4">{formatCurrency(dept.TotalNet)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}