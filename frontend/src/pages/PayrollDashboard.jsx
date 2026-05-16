import React from "react";

export default function PayrollDashboard() {
  return (
    <div className="container-fluid" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh", padding: "20px" }}>
      <h3 className="mb-4 fw-bold">Tổng quan (Payroll Dashboard)</h3>
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="fw-bold">Tổng quỹ lương ước tính (Mock)</h5>
              <h2 className="text-success mt-3">1.5B VNĐ</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="fw-bold">Lương trung bình (Mock)</h5>
              <h2 className="text-info mt-3">10M VNĐ</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="fw-bold">Thuế thu nhập dự tính (Mock)</h5>
              <h2 className="text-danger mt-3">150M VNĐ</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="card shadow-sm border-0">
        <div className="card-body text-center py-5">
          <i className="bi bi-cash-stack text-muted" style={{ fontSize: "4rem" }}></i>
          <h4 className="mt-3 text-muted">Khu vực biểu đồ phân tích quỹ lương sẽ được phát triển sau</h4>
        </div>
      </div>
    </div>
  );
}
