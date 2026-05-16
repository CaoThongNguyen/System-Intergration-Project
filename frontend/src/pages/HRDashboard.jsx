import React from "react";

export default function HRDashboard() {
  return (
    <div className="container-fluid" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh", padding: "20px" }}>
      <h3 className="mb-4 fw-bold">Tổng quan (HR Dashboard)</h3>
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="fw-bold">Tổng số nhân viên (Mock)</h5>
              <h2 className="text-primary mt-3">150</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="fw-bold">Nhân viên mới tháng này (Mock)</h5>
              <h2 className="text-success mt-3">+ 12</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="fw-bold">Yêu cầu nghỉ phép chưa duyệt (Mock)</h5>
              <h2 className="text-danger mt-3">5</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="card shadow-sm border-0">
        <div className="card-body text-center py-5">
          <i className="bi bi-person-lines-fill text-muted" style={{ fontSize: "4rem" }}></i>
          <h4 className="mt-3 text-muted">Khu vực biểu đồ nhân sự sẽ được phát triển sau</h4>
        </div>
      </div>
    </div>
  );
}
