import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  // Hàm kiểm tra trang đang active để tô màu
  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return "bg-primary text-white";
    if (path !== "/" && location.pathname.includes(path)) return "bg-primary text-white";
    return "text-dark";
  };

  return (
    <div className="bg-white border-end shadow-sm" style={{ width: "240px", height: "100vh" }}>
      <div className="p-3 mb-2 border-bottom">
        <small className="text-muted fw-bold text-uppercase" style={{ letterSpacing: "1px" }}>Navigation</small>
      </div>
      <div className="list-group list-group-flush px-2">
        <Link to="/" className={`list-group-item list-group-item-action border-0 rounded mb-1 ${isActive("/")}`}>
          <i className="bi bi-speedometer2 me-2"></i> Tổng quan
        </Link>
        <Link to="/employees" className={`list-group-item list-group-item-action border-0 rounded mb-1 ${isActive("/employees")}`}>
          <i className="bi bi-people me-2"></i> Danh sách nhân viên
        </Link>
        <Link to="/employees/add" className="list-group-item list-group-item-action border-0 rounded mb-1 text-dark">
          <i className="bi bi-person-plus me-2"></i> Thêm nhân viên
        </Link>
      </div>
    </div>
  );
}