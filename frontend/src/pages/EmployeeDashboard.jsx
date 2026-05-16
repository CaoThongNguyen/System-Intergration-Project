import React from "react";

export default function EmployeeDashboard() {
  return (
    <div className="container-fluid" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh", padding: "20px" }}>
      <h3 className="mb-4 fw-bold">Tổng quan (Employee Self-Service)</h3>
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="fw-bold">Số ngày phép còn lại (Mock)</h5>
              <h2 className="text-primary mt-3">12 Ngày</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="fw-bold">Lương thực lãnh tháng trước (Mock)</h5>
              <h2 className="text-success mt-3">15M VNĐ</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="fw-bold">Thông báo chưa đọc (Mock)</h5>
              <h2 className="text-warning mt-3">2</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="card shadow-sm border-0">
        <div className="card-body text-center py-5">
          <i className="bi bi-calendar-check text-muted" style={{ fontSize: "4rem" }}></i>
          <h4 className="mt-3 text-muted">Lịch sử chấm công cá nhân sẽ được hiển thị ở đây</h4>
        </div>
      </div>
    </div>
  );
}
