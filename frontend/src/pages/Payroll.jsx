import React from "react";

export default function Payroll() {
  return (
    <div className="container-fluid" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh", padding: "20px" }}>
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-0">Quản lý Bảng Lương</h3>
          <small className="text-muted">Tổng hợp và kiểm tra dữ liệu lương hàng tháng</small>
        </div>
        <div>
          <button className="btn btn-success shadow-sm">
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
              <input type="month" className="form-control" defaultValue="2026-05" />
            </div>
            <div className="col-md-3">
              <label className="form-label text-muted small fw-bold mb-1">Phòng ban</label>
              <select className="form-select">
                <option>Tất cả phòng ban</option>
                <option>IT & Software</option>
                <option>HR</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label text-muted small fw-bold mb-1">Tìm kiếm Nhân viên</label>
              <input type="text" className="form-control" placeholder="Nhập tên hoặc mã NV..." />
            </div>
            <div className="col-md-2 d-flex align-items-end">
              <button className="btn btn-primary w-100">Lọc dữ liệu</button>
            </div>
          </div>
        </div>
      </div>

      {/* Bảng Dữ liệu Lương (Mockup) */}
      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-muted" style={{ fontSize: "0.85rem", letterSpacing: "0.5px" }}>
                <tr>
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
                {/* Dòng mẫu 1 */}
                <tr>
                  <td className="px-4">
                    <div className="fw-bold text-dark">Nguyễn Văn A</div>
                    <small className="text-muted">IT & Software</small>
                  </td>
                  <td className="text-end fw-medium">15,000,000 ₫</td>
                  <td className="text-end text-success">+ 2,000,000 ₫</td>
                  <td className="text-end text-danger">- 1,500,000 ₫</td>
                  <td className="text-end fw-bold text-primary fs-6">15,500,000 ₫</td>
                  <td className="text-center">
                    <span className="badge bg-success">Đã duyệt</span>
                  </td>
                  <td className="text-center">
                    <button className="btn btn-sm btn-outline-secondary"><i className="bi bi-eye"></i></button>
                  </td>
                </tr>
                {/* Dòng mẫu 2 */}
                <tr>
                  <td className="px-4">
                    <div className="fw-bold text-dark">Trần Thị B</div>
                    <small className="text-muted">HR</small>
                  </td>
                  <td className="text-end fw-medium">12,000,000 ₫</td>
                  <td className="text-end text-success">+ 1,000,000 ₫</td>
                  <td className="text-end text-danger">- 500,000 ₫</td>
                  <td className="text-end fw-bold text-primary fs-6">12,500,000 ₫</td>
                  <td className="text-center">
                    <span className="badge bg-warning text-dark">Chờ duyệt</span>
                  </td>
                  <td className="text-center">
                    <button className="btn btn-sm btn-outline-secondary"><i className="bi bi-eye"></i></button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}