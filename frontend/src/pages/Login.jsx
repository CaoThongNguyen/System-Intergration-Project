import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Vui lòng nhập đầy đủ tài khoản và mật khẩu!");
      return;
    }

    setLoading(true);
    fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    })
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (data.status === "success") {
          onLogin(data.user);
          navigate("/"); 
        } else {
          setError(data.msg || "Đăng nhập thất bại");
        }
      })
      .catch(err => {
        setLoading(false);
        setError("Lỗi kết nối đến máy chủ");
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div 
        className="card shadow-lg border-0" 
        style={{ width: "100%", maxWidth: "420px", borderRadius: "15px" }}
      >
        <div className="card-body p-5">
          <h2 className="text-center mb-4 text-primary fw-bold">ĐĂNG NHẬP</h2>
          
          {error && (
            <div className="alert alert-danger py-2 text-center" role="alert">
              {error}
            </div>
          )}

          <div className="alert alert-info py-2 small mb-4">
            <strong>Tài khoản Demo:</strong><br/>
            - admin01 (Admin)<br/>
            - hrm_lan (HR Manager)<br/>
            - acc_tuan (Accountant)<br/>
            - staff_hoa (Staff)
          </div>

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label fw-semibold text-secondary">Tên đăng nhập</label>
              <input 
                type="text" 
                className="form-control form-control-lg" 
                placeholder="Nhập tài khoản..." 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
              />
            </div>

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

            <div className="d-grid gap-2 mt-4">
              <button type="submit" className="btn btn-primary btn-lg fw-bold" style={{ borderRadius: "8px" }} disabled={loading}>
                {loading ? "ĐANG XỬ LÝ..." : "ĐĂNG NHẬP"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;