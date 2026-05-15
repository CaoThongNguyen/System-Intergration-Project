import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Thêm state để hiển thị lỗi
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError(""); // Reset lỗi mỗi lần bấm

    // Bắt lỗi nếu để trống
    if (!username || !password) {
      setError("Vui lòng nhập đầy đủ tài khoản và mật khẩu!");
      return;
    }

    // Giả lập kiểm tra tài khoản
    if (username === "admin" && password === "123456") {
      onLogin(); 
      navigate("/"); 
    } else {
      setError("Tên đăng nhập hoặc mật khẩu không chính xác!");
    }
  };

  return (
    /* vh-100: Chiều cao bằng 100% màn hình
      d-flex, justify-content-center, align-items-center: Căn giữa nội dung
      bg-light: Nền màu xám nhạt giúp form nổi bật hơn
    */
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      
      {/* Khung Card chứa form */}
      <div 
        className="card shadow-lg border-0" 
        style={{ width: "100%", maxWidth: "420px", borderRadius: "15px" }}
      >
        <div className="card-body p-5">
          <h2 className="text-center mb-4 text-primary fw-bold">ĐĂNG NHẬP</h2>
          
          {/* Hiển thị thông báo lỗi bằng Alert của Bootstrap */}
          {error && (
            <div className="alert alert-danger py-2 text-center" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            {/* Ô nhập Tài khoản */}
            <div className="mb-3">
              <label className="form-label fw-semibold text-secondary">Tên đăng nhập</label>
              <input 
                type="text" 
                className="form-control form-control-lg" 
                placeholder="Nhập admin..." 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
              />
            </div>

            {/* Ô nhập Mật khẩu */}
            <div className="mb-4">
              <label className="form-label fw-semibold text-secondary">Mật khẩu</label>
              <input 
                type="password" 
                className="form-control form-control-lg" 
                placeholder="Nhập 123456..." 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>

            {/* Nút Đăng nhập tràn viền */}
            <div className="d-grid gap-2 mt-4">
              <button type="submit" className="btn btn-primary btn-lg fw-bold" style={{ borderRadius: "8px" }}>
                ĐĂNG NHẬP
              </button>
            </div>
            
          </form>
        </div>
      </div>
      
    </div>
  );
}

export default Login;