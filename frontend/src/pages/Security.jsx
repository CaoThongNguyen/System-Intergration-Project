import React, { useState, useEffect } from "react";

export default function Security() {
  const [roles, setRoles] = useState([]);
  const [functions, setFunctions] = useState([]);
  const [matrixMap, setMatrixMap] = useState({});
  const [initialMap, setInitialMap] = useState({});
  const [loading, setLoading] = useState(true);

  // State cho quản lý tài khoản
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);

  useEffect(() => {
    fetchMatrix();
    fetchUsers();
  }, []);

  const fetchMatrix = () => {
    setLoading(true);
    fetch("http://localhost:5000/api/security/matrix")
      .then(res => res.json())
      .then(data => {
        setRoles(data.roles || []);
        setFunctions(data.functions || []);
        
        const map = {};
        if (data.matrix) {
          data.matrix.forEach(item => {
            map[`${item.role_id}-${item.function_id}`] = true;
          });
        }
        setMatrixMap(map);
        setInitialMap({...map});
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleToggle = (roleId, funcId) => {
    // Admin (role_code === 'ADMIN' hoặc role_id === 1) thì ko cho sửa
    if (roleId === 1) return;
    
    const key = `${roleId}-${funcId}`;
    setMatrixMap(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSaveChanges = () => {
    // Tìm các thay đổi
    const changes = [];
    roles.forEach(r => {
      functions.forEach(f => {
        const key = `${r.role_id}-${f.function_id}`;
        const initial = !!initialMap[key];
        const current = !!matrixMap[key];
        
        if (initial !== current) {
          changes.push({
            role_id: r.role_id,
            function_id: f.function_id,
            checked: current
          });
        }
      });
    });

    if (changes.length === 0) {
      alert("Không có thay đổi nào để lưu.");
      return;
    }

    fetch("http://localhost:5000/api/security/matrix", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ changes })
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          alert(data.msg);
          setInitialMap({...matrixMap});
        } else {
          alert("Lỗi: " + data.msg);
        }
      })
      .catch(err => alert("Lỗi kết nối API"));
  };

  // === Quản lý tài khoản ===
  const fetchUsers = () => {
    setUsersLoading(true);
    fetch("http://localhost:5000/api/security/users")
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setUsersLoading(false);
      })
      .catch(err => {
        console.error(err);
        setUsersLoading(false);
      });
  };

  const handleUserRoleChange = (userId, newRoleId) => {
    setUsers(prev => prev.map(u =>
      u.user_id === userId ? { ...u, role_id: newRoleId } : u
    ));
  };

  const handleAssignRole = (userId, roleId) => {
    if (!roleId) {
      alert("Vui lòng chọn vai trò trước khi gán.");
      return;
    }
    fetch("http://localhost:5000/api/security/assign-role", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, role_id: roleId })
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          alert(data.msg);
          fetchUsers(); // Reload
        } else {
          alert("Lỗi: " + data.msg);
        }
      })
      .catch(err => alert("Lỗi kết nối API"));
  };

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
              <button className="btn btn-sm btn-primary shadow-sm" onClick={handleSaveChanges} disabled={loading}>
                <i className="bi bi-save me-1"></i> Lưu thay đổi
              </button>
            </div>
            <div className="card-body p-0 table-responsive">
              <table className="table table-bordered table-hover align-middle text-center mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="text-start px-4">QUYỀN HẠN / TÍNH NĂNG</th>
                    {roles.map(r => (
                      <th key={r.role_id} style={{ width: "15%" }}>{r.role_name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={roles.length + 1} className="text-center py-4">Đang tải dữ liệu phân quyền...</td>
                    </tr>
                  ) : (
                    functions.map(f => (
                      <tr key={f.function_id}>
                        <td className="text-start px-4 fw-medium text-muted">{f.function_name}</td>
                        {roles.map(r => {
                          const key = `${r.role_id}-${f.function_id}`;
                          const isChecked = !!matrixMap[key];
                          const isAdmin = r.role_id === 1; // Giả định ID 1 là Admin
                          return (
                            <td key={r.role_id}>
                              <input 
                                className="form-check-input border-secondary" 
                                type="checkbox" 
                                checked={isChecked}
                                onChange={() => handleToggle(r.role_id, f.function_id)}
                                disabled={isAdmin}
                                style={{ cursor: isAdmin ? 'not-allowed' : 'pointer' }}
                              />
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Cột 2: Quản lý Tài khoản & Gán Vai trò */}
        <div className="col-md-12 mt-4">
          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-header bg-white border-bottom-0 pt-4 pb-2">
              <h5 className="fw-bold text-dark mb-0"><i className="bi bi-person-gear text-warning me-2"></i>Quản lý Tài khoản & Gán Vai trò</h5>
            </div>
            <div className="card-body p-0 table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light text-muted small">
                  <tr>
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3">TÊN ĐĂNG NHẬP</th>
                    <th className="py-3">HỌ TÊN</th>
                    <th className="py-3">EMAIL</th>
                    <th className="py-3">VAI TRÒ HIỆN TẠI</th>
                    <th className="py-3 text-center">THAO TÁC</th>
                  </tr>
                </thead>
                <tbody style={{ fontSize: "0.9rem" }}>
                  {usersLoading ? (
                    <tr><td colSpan="6" className="text-center py-4">Đang tải...</td></tr>
                  ) : (
                    users.map(u => (
                      <tr key={u.user_id}>
                        <td className="px-4">{u.user_id}</td>
                        <td className="fw-bold">{u.username}</td>
                        <td>{u.full_name}</td>
                        <td className="text-muted">{u.email}</td>
                        <td>
                          <select
                            className="form-select form-select-sm"
                            value={u.role_id || ""}
                            onChange={(e) => handleUserRoleChange(u.user_id, parseInt(e.target.value))}
                          >
                            <option value="" disabled>-- Chọn vai trò --</option>
                            {roles.map(r => (
                              <option key={r.role_id} value={r.role_id}>{r.role_name}</option>
                            ))}
                          </select>
                        </td>
                        <td className="text-center">
                          <button className="btn btn-sm btn-outline-success" onClick={() => handleAssignRole(u.user_id, u.role_id)}>
                            <i className="bi bi-check-lg me-1"></i>Gán
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Cột 3: Audit Logging (Nhật ký kiểm toán) */}
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