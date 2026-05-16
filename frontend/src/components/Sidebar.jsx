import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const perms = currentUser.permissions || [];
  const roleCode = currentUser.role_code || "";
  const isAdmin = roleCode === "ADMIN";

  // Kiểm tra xem user có quyền truy cập function_code không
  const hasPermission = (functionCode) => {
    if (isAdmin) return true;
    return perms.includes(functionCode);
  };

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return "bg-primary text-white shadow-sm";
    if (path !== "/" && location.pathname.startsWith(path)) return "bg-primary text-white shadow-sm";
    return "text-dark hover-bg-light";
  };

  return (
    <div className="bg-white border-end d-flex flex-column" style={{ width: "260px", height: "100vh" }}>
      <div className="overflow-auto flex-grow-1 pb-4">
        <div className="list-group list-group-flush px-2 py-3">
          
          <Link to="/" className={`list-group-item list-group-item-action border-0 rounded mb-1 fw-medium ${isActive("/")}`}>
            <i className="bi bi-speedometer2 me-2"></i> Tổng quan (Dashboard)
          </Link>

          {/* NHÓM QUẢN LÝ NHÂN SỰ - Chỉ hiện nếu có quyền EMP_MGT */}
          {hasPermission("EMP_MGT") && (
            <>
              <div className="text-muted fw-bold mt-4 mb-2 px-3" style={{ fontSize: "0.75rem", letterSpacing: "1px" }}>QUẢN LÝ NHÂN SỰ</div>
              <Link to="/employees" className={`list-group-item list-group-item-action border-0 rounded mb-1 fw-medium ${isActive("/employees")}`}>
                <i className="bi bi-people me-2"></i> Hồ sơ Nhân viên
              </Link>
              <Link to="/departments" className={`list-group-item list-group-item-action border-0 rounded mb-1 fw-medium ${isActive("/departments")}`}>
                <i className="bi bi-diagram-3 me-2"></i> Phòng ban
              </Link>
              <Link to="/positions" className={`list-group-item list-group-item-action border-0 rounded mb-1 fw-medium ${isActive("/positions")}`}>
                <i className="bi bi-briefcase me-2"></i> Vị trí & Chức vụ
              </Link>
            </>
          )}

          {/* NHÓM LƯƠNG & CHẤM CÔNG - Chỉ hiện nếu có quyền SAL_MGT */}
          {hasPermission("SAL_MGT") && (
            <>
              <div className="text-muted fw-bold mt-4 mb-2 px-3" style={{ fontSize: "0.75rem", letterSpacing: "1px" }}>LƯƠNG & CHẤM CÔNG</div>
              <Link to="/payroll" className={`list-group-item list-group-item-action border-0 rounded mb-1 fw-medium ${isActive("/payroll")}`}>
                <i className="bi bi-cash-coin me-2"></i> Bảng Lương
              </Link>
              <Link to="/attendance" className={`list-group-item list-group-item-action border-0 rounded mb-1 fw-medium ${isActive("/attendance")}`}>
                <i className="bi bi-calendar-check me-2"></i> Điểm danh
              </Link>
            </>
          )}

          {/* NHÓM BÁO CÁO - Chỉ hiện nếu có quyền REP_MGT */}
          {hasPermission("REP_MGT") && (
            <>
              <div className="text-muted fw-bold mt-4 mb-2 px-3" style={{ fontSize: "0.75rem", letterSpacing: "1px" }}>BÁO CÁO & CẢNH BÁO</div>
              <Link to="/reports" className={`list-group-item list-group-item-action border-0 rounded mb-1 fw-medium ${isActive("/reports")}`}>
                <i className="bi bi-pie-chart me-2"></i> Phân tích & Báo cáo
              </Link>
              <Link to="/alerts" className={`list-group-item list-group-item-action border-0 rounded mb-1 fw-medium ${isActive("/alerts")}`}>
                <i className="bi bi-bell me-2"></i> Thông báo & Cảnh báo
              </Link>
            </>
          )}

          {/* NHÓM HỆ THỐNG - Chỉ hiện nếu có quyền USER_MGT hoặc Admin */}
          {hasPermission("USER_MGT") && (
            <>
              <div className="text-muted fw-bold mt-4 mb-2 px-3" style={{ fontSize: "0.75rem", letterSpacing: "1px" }}>HỆ THỐNG</div>
              <Link to="/security" className={`list-group-item list-group-item-action border-0 rounded mb-1 fw-medium ${isActive("/security")}`}>
                <i className="bi bi-shield-lock me-2"></i> Phân quyền
              </Link>
            </>
          )}

        </div>
      </div>
      
      {/* User profile ở dưới cùng */}
      <div className="p-3 border-top bg-light">
        <div className="d-flex align-items-center">
          <div className="bg-secondary text-white rounded-circle d-flex justify-content-center align-items-center me-2" style={{ width: "35px", height: "35px" }}>
            <i className="bi bi-person"></i>
          </div>
          <div>
            <div className="fw-bold" style={{ fontSize: "0.9rem" }}>{currentUser.full_name || "User"}</div>
            <div className="text-muted" style={{ fontSize: "0.75rem" }}>{currentUser.role_name || "Chưa có vai trò"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}