import React from "react";

export default function Reports() {
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

      {/* Menu Tabs giả lập */}
      <ul className="nav nav-pills mb-4 bg-white p-2 rounded-3 shadow-sm" style={{ width: "fit-content" }}>
        <li className="nav-item">
          <button className="nav-link active rounded-2 px-4">Báo cáo HR</button>
        </li>
        <li className="nav-item">
          <button className="nav-link text-dark px-4">Báo cáo Lương</button>
        </li>
        <li className="nav-item">
          <button className="nav-link text-dark px-4">Điểm danh</button>
        </li>
        <li className="nav-item">
          <button className="nav-link text-dark px-4">Cổ tức</button>
        </li>
      </ul>

      <div className="row g-4 mb-4">
        {/* Card 1: Tổng quan Nhân sự */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3 h-100">
            <div className="card-body">
              <h6 className="fw-bold text-muted mb-4">PHÂN BỐ THEO GIỚI TÍNH</h6>
              <div className="d-flex align-items-center justify-content-center mb-3">
                {/* Giả lập biểu đồ tròn bằng CSS */}
                <div style={{ width: "120px", height: "120px", borderRadius: "50%", background: "conic-gradient(#0d6efd 0% 60%, #e83e8c 60% 100%)" }}></div>
              </div>
              <div className="d-flex justify-content-around text-center mt-4">
                <div>
                  <h5 className="fw-bold text-primary mb-0">60%</h5>
                  <small className="text-muted">Nam</small>
                </div>
                <div>
                  <h5 className="fw-bold mb-0" style={{ color: "#e83e8c" }}>40%</h5>
                  <small className="text-muted">Nữ</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Quỹ lương */}
        <div className="col-md-8">
          <div className="card border-0 shadow-sm rounded-3 h-100">
            <div className="card-body">
              <h6 className="fw-bold text-muted mb-4">XU HƯỚNG QUỸ LƯƠNG 6 THÁNG QUA</h6>
              <div className="d-flex align-items-end justify-content-between pt-2" style={{ height: "140px" }}>
                <div className="d-flex flex-column align-items-center w-100">
                  <div className="bg-success rounded-top w-50" style={{ height: "60%" }}></div>
                  <small className="text-muted mt-2">T12</small>
                </div>
                <div className="d-flex flex-column align-items-center w-100">
                  <div className="bg-success rounded-top w-50" style={{ height: "65%" }}></div>
                  <small className="text-muted mt-2">T01</small>
                </div>
                <div className="d-flex flex-column align-items-center w-100">
                  <div className="bg-success rounded-top w-50" style={{ height: "70%" }}></div>
                  <small className="text-muted mt-2">T02</small>
                </div>
                <div className="d-flex flex-column align-items-center w-100">
                  <div className="bg-success rounded-top w-50" style={{ height: "68%" }}></div>
                  <small className="text-muted mt-2">T03</small>
                </div>
                <div className="d-flex flex-column align-items-center w-100">
                  <div className="bg-success rounded-top w-50" style={{ height: "80%" }}></div>
                  <small className="text-muted mt-2">T04</small>
                </div>
                <div className="d-flex flex-column align-items-center w-100">
                  <div className="bg-success rounded-top w-50 opacity-50" style={{ height: "85%" }}></div>
                  <small className="text-primary fw-bold mt-2">T05</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bảng Dữ liệu chi tiết báo cáo */}
      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-header bg-white border-bottom-0 pt-4 pb-2">
          <h6 className="fw-bold">Phân bổ chi phí theo Phòng ban (Tháng 05/2026)</h6>
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
              <tr>
                <td className="px-4 fw-bold">IT & Software</td>
                <td className="text-center">45</td>
                <td className="text-end">650,000,000 ₫</td>
                <td className="text-end text-success">+ 45,000,000 ₫</td>
                <td className="text-end fw-bold text-primary px-4">695,000,000 ₫</td>
              </tr>
              <tr>
                <td className="px-4 fw-bold">Human Resources (HR)</td>
                <td className="text-center">12</td>
                <td className="text-end">180,000,000 ₫</td>
                <td className="text-end text-success">+ 10,000,000 ₫</td>
                <td className="text-end fw-bold text-primary px-4">190,000,000 ₫</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}