import React from "react";

export default function Alerts() {
  return (
    <div className="container-fluid" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh", padding: "20px" }}>
      <h3 className="fw-bold mb-4">Hệ thống Cảnh báo & Thông báo</h3>

      <div className="row g-4">
        {/* Cột Thông báo Khẩn / Quan trọng */}
        <div className="col-md-8">
          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-header bg-white pt-4 pb-2 border-bottom-0">
              <h5 className="fw-bold"><i className="bi bi-bell-fill text-danger me-2"></i>Thông báo tự động từ Hệ thống</h5>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                
                {/* Alert 1 */}
                <div className="list-group-item px-0 py-3 d-flex align-items-start border-bottom">
                  <div className="bg-danger bg-opacity-10 text-danger p-2 rounded-circle me-3 mt-1">
                    <i className="bi bi-exclamation-triangle-fill fs-5"></i>
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-center">
                      <h6 className="fw-bold mb-1">Cảnh báo nghỉ phép vượt mức</h6>
                      <small className="text-muted">10 phút trước</small>
                    </div>
                    <p className="text-muted mb-1 small">Nhân viên <strong>Trần Thị B (HR)</strong> đã sử dụng 14/12 ngày phép năm. Cần kiểm tra lại dữ liệu chấm công.</p>
                    <button className="btn btn-sm btn-outline-danger mt-1">Gửi Email Cảnh báo</button>
                  </div>
                </div>

                {/* Alert 2 */}
                <div className="list-group-item px-0 py-3 d-flex align-items-start border-bottom">
                  <div className="bg-warning bg-opacity-10 text-warning p-2 rounded-circle me-3 mt-1">
                    <i className="bi bi-cash-stack fs-5"></i>
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-center">
                      <h6 className="fw-bold mb-1">Chênh lệch lương bất thường kỳ 05/2026</h6>
                      <small className="text-muted">2 giờ trước</small>
                    </div>
                    <p className="text-muted mb-1 small">Tổng quỹ lương tháng này tăng 15% so với tháng trước. Vui lòng kiểm tra lại bảng phụ cấp của phòng IT.</p>
                    <button className="btn btn-sm btn-outline-warning mt-1 text-dark">Xem báo cáo lương</button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Cột Tin vui / Kỷ niệm */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3 bg-primary bg-opacity-10 text-primary">
            <div className="card-body">
              <h5 className="fw-bold mb-4"><i className="bi bi-balloon-fill me-2"></i>Kỷ niệm & Sự kiện (Tháng này)</h5>
              
              <div className="d-flex align-items-center mb-3 bg-white p-3 rounded-3 shadow-sm">
                <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center me-3 fw-bold" style={{ width: "40px", height: "40px" }}>A</div>
                <div>
                  <h6 className="fw-bold mb-0 text-dark">Lưu Vũ Thiên</h6>
                  <small className="text-muted">Kỷ niệm 3 năm làm việc (18/05/2023)</small>
                </div>
              </div>

              <div className="d-flex align-items-center bg-white p-3 rounded-3 shadow-sm">
                <div className="bg-success text-white rounded-circle d-flex justify-content-center align-items-center me-3 fw-bold" style={{ width: "40px", height: "40px" }}>C</div>
                <div>
                  <h6 className="fw-bold mb-0 text-dark">Huỳnh Minh Tiến</h6>
                  <small className="text-muted">Sinh nhật (25/05)</small>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}