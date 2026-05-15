import React from "react";

export default function Security() {
  return (
    <div className="container-fluid" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh", padding: "20px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-0">Bảo mật & Phân quyền (RBAC)</h3>
          <small className="text-muted">Quản lý vai trò, quyền hạn và nhật ký hệ thống (Audit Logs)</small>
        </div>
      </div>

      <div className="row g-4">
        {/* Cột 1: Ma trận Phân quyền */}
        <div className="col-md-12">
          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-header bg-white border-bottom-0 pt-4 pb-2 d-flex justify-content-between align-items-center">
              <h5 className="fw-bold text-dark mb-0"><i className="bi bi-shield-lock-fill text-primary me-2"></i>Ma trận Quyền hạn (Role-Based Access)</h5>
              <button className="btn btn-sm btn-outline-primary">Lưu thay đổi</button>
            </div>
            <div className="card-body p-0 table-responsive">
              <table className="table table-bordered table-hover align-middle text-center mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="text-start px-4">QUYỀN HẠN / TÍNH NĂNG</th>
                    <th style={{ width: "15%" }}>Admin</th>
                    <th style={{ width: "15%" }}>HR Manager</th>
                    <th style={{ width: "15%" }}>Payroll Manager</th>
                    <th style={{ width: "15%" }}>Employee (Self-service)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="text-start px-4 fw-medium text-muted">Quản lý hồ sơ Nhân sự (CRUD)</td>
                    <td><input className="form-check-input border-secondary" type="checkbox" defaultChecked disabled /></td>
                    <td><input className="form-check-input border-secondary" type="checkbox" defaultChecked /></td>
                    <td><input className="form-check-input border-secondary" type="checkbox" /></td>
                    <td><input className="form-check-input border-secondary" type="checkbox" /></td>
                  </tr>
                  <tr>
                    <td className="text-start px-4 fw-medium text-muted">Xem và tính Lương (Payroll)</td>
                    <td><input className="form-check-input border-secondary" type="checkbox" defaultChecked disabled /></td>
                    <td><input className="form-check-input border-secondary" type="checkbox" /></td>
                    <td><input className="form-check-input border-secondary" type="checkbox" defaultChecked /></td>
                    <td><input className="form-check-input border-secondary" type="checkbox" /></td>
                  </tr>
                  <tr>
                    <td className="text-start px-4 fw-medium text-muted">Cấp quyền & Xem Audit Logs</td>
                    <td><input className="form-check-input border-secondary" type="checkbox" defaultChecked disabled /></td>
                    <td><input className="form-check-input border-secondary" type="checkbox" /></td>
                    <td><input className="form-check-input border-secondary" type="checkbox" /></td>
                    <td><input className="form-check-input border-secondary" type="checkbox" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Cột 2: Audit Logging (Nhật ký kiểm toán) */}
        <div className="col-md-12 mt-4">
          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-header bg-white border-bottom-0 pt-4 pb-2 d-flex justify-content-between align-items-center">
              <h5 className="fw-bold text-dark mb-0"><i className="bi bi-journal-code text-secondary me-2"></i>Nhật ký Hệ thống (Audit Logs)</h5>
              <div className="input-group" style={{ width: "250px" }}>
                <input type="date" className="form-control form-control-sm" />
                <button className="btn btn-sm btn-secondary"><i className="bi bi-search"></i></button>
              </div>
            </div>
            <div className="card-body p-0">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light text-muted small">
                  <tr>
                    <th className="py-3 px-4">THỜI GIAN</th>
                    <th className="py-3">TÀI KHOẢN</th>
                    <th className="py-3">HÀNH ĐỘNG (ACTION)</th>
                    <th className="py-3">ĐỊA CHỈ IP</th>
                    <th className="py-3 text-center">TRẠNG THÁI</th>
                  </tr>
                </thead>
                <tbody style={{ fontSize: "0.9rem" }}>
                  <tr>
                    <td className="px-4 text-muted">15/05/2026 - 20:45:12</td>
                    <td className="fw-bold">admin@company.com</td>
                    <td><span className="badge bg-danger me-2">DELETE</span> Đã xóa nhân viên ID #E102</td>
                    <td className="text-muted">192.168.1.45</td>
                    <td className="text-center text-success"><i className="bi bi-check-circle-fill"></i> Success</td>
                  </tr>
                  <tr>
                    <td className="px-4 text-muted">15/05/2026 - 19:30:00</td>
                    <td className="fw-bold">hrmanager@company.com</td>
                    <td><span className="badge bg-primary me-2">UPDATE</span> Chỉnh sửa phòng ban nhân viên #E05</td>
                    <td className="text-muted">113.190.x.x</td>
                    <td className="text-center text-success"><i className="bi bi-check-circle-fill"></i> Success</td>
                  </tr>
                  <tr>
                    <td className="px-4 text-muted">15/05/2026 - 14:15:22</td>
                    <td className="fw-bold">payroll@company.com</td>
                    <td><span className="badge bg-warning text-dark me-2">SYNC</span> Đồng bộ bảng lương tháng 04/2026 sang PAYROLL DB</td>
                    <td className="text-muted">192.168.1.12</td>
                    <td className="text-center text-danger"><i className="bi bi-x-circle-fill"></i> Failed</td>
                  </tr>
                  <tr>
                    <td className="px-4 text-muted">15/05/2026 - 08:05:10</td>
                    <td className="fw-bold">unknown</td>
                    <td><span className="badge bg-secondary me-2">LOGIN</span> Cố gắng đăng nhập sai mật khẩu (3 lần)</td>
                    <td className="text-muted">14.248.x.x</td>
                    <td className="text-center text-danger"><i className="bi bi-shield-x"></i> Blocked</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}