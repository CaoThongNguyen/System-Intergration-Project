import { useNavigate } from "react-router-dom";

export default function Header({ onLogout }) {
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

    const handleLogout = () => {
        if (onLogout) onLogout();
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-dark bg-dark px-4">
            <span className="navbar-brand mb-0 h1 text-white">
                Data Integration Dashboard
            </span>
            <div className="d-flex align-items-center">
                <span className="text-light me-3 small">
                    <i className="bi bi-person-circle me-1"></i>
                    {currentUser.full_name || "User"} 
                    <span className="badge bg-primary ms-2">{currentUser.role_name || ""}</span>
                </span>
                <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-1"></i> Đăng xuất
                </button>
            </div>
        </nav>
    );
}