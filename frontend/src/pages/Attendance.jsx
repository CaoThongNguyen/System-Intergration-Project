import React from "react";

export default function Attendance() {
  return (
    <div className="container-fluid" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh", padding: "20px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-0">Quản lý Điểm danh</h3>
          <small className="text-muted">Theo dõi giờ giấc làm việc và ngày phép của nhân viên</small>
        </div>
      </div>

      {/* Thanh công cụ lọc */}
      <div className="card border-0 shadow-sm rounded-3 mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-center">
            <div className="col-md-3">
              <label className="form-label text-muted small fw-bold mb-1">Tháng/Năm</label>
              <input type="month" className="form-control" defaultValue="2026-05" />
            </div>
            <div className="col-md-3">
              <label className="form-label text-muted small fw-bold mb-1">Trạng thái</label>
              <select className="form-select">
                <option>Tất cả</option>
                <option>Đúng giờ</option>
                <option>Đi muộn/Về sớm</option>
                <option>Nghỉ phép</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label text-muted small fw-bold mb-1">Tìm kiếm Nhân viên</label>
              <input type="text" className="form-control" placeholder="Tên hoặc mã NV..." />
            </div>
            <div className="col-md-2 d-flex align-items-end">
              <button className="btn btn-primary w-100"><i className="bi bi-funnel me-2"></i>Lọc</button>
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
                  <th className="py-3 px-4">NGÀY</th>
                  <th className="py-3">NHÂN VIÊN</th>
                  <th className="py-3 text-center">GIỜ VÀO (IN)</th>
                  <th className="py-3 text-center">GIỜ RA (OUT)</th>
                  <th className="py-3 text-center">TỔNG GIỜ</th>
                  <th className="py-3 text-center">TRẠNG THÁI</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 fw-medium">15/05/2026</td>
                  <td>
                    <div className="fw-bold text-dark">Nguyễn Văn A</div>
                    <small className="text-muted">IT & Software</small>
                  </td>
                  <td className="text-center text-success fw-bold">07:55 AM</td>
                  <td className="text-center text-primary fw-bold">17:10 PM</td>
                  <td className="text-center fw-medium">8h 15m</td>
                  <td className="text-center"><span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25">Đúng giờ</span></td>
                </tr>
                <tr>
                  <td className="px-4 fw-medium">15/05/2026</td>
                  <td>
                    <div className="fw-bold text-dark">Trần Thị B</div>
                    <small className="text-muted">HR</small>
                  </td>
                  <td className="text-center text-warning fw-bold">08:30 AM</td>
                  <td className="text-center text-primary fw-bold">17:00 PM</td>
                  <td className="text-center fw-medium">7h 30m</td>
                  <td className="text-center"><span className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25">Đi muộn</span></td>
                </tr>
                <tr>
                  <td className="px-4 fw-medium">15/05/2026</td>
                  <td>
                    <div className="fw-bold text-dark">Lê Văn C</div>
                    <small className="text-muted">Marketing</small>
                  </td>
                  <td className="text-center text-muted">-</td>
                  <td className="text-center text-muted">-</td>
                  <td className="text-center fw-medium">0h 0m</td>
                  <td className="text-center"><span className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25">Nghỉ phép (Có phép)</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}