import React, { useState, useEffect } from "react";

export default function Departments() {
  // 1. STATE CHỨA DỮ LIỆU THẬT
  const [departments, setDepartments] = useState([]);
  
  // 2. STATE ĐIỀU KHIỂN CỬA SỔ (MODAL)
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("ADD"); // "ADD" hoặc "EDIT"
  const [currentDept, setCurrentDept] = useState({ DepartmentID: "", DepartmentName: "" });

  // 3. HÀM GỌI API LẤY DỮ LIỆU TỪ FLASK
  const loadDepartments = () => {
    fetch("http://localhost:5000/api/departments")
      .then(res => res.json())
      .then(data => setDepartments(data))
      .catch(err => console.error("Chưa kết nối được Backend:", err));
  };

  // Gọi API ngay khi mở trang
  useEffect(() => {
    loadDepartments();
  }, []);

  // 4. CÁC HÀM TƯƠNG TÁC NÚT BẤM
  const handleOpenAdd = () => {
    setModalType("ADD");
    setCurrentDept({ DepartmentID: "", DepartmentName: "" }); // Làm trống form
    setShowModal(true);
  };

  const handleOpenEdit = (dept) => {
    setModalType("EDIT");
    setCurrentDept(dept); // Đổ dữ liệu cũ vào form
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Hàm lưu dữ liệu khi bấm "Xác nhận" trên Modal
// HÀM LƯU DỮ LIỆU (THÊM / SỬA)
  const handleSave = (e) => {
    e.preventDefault();
    
    // Nếu là ADD thì gọi POST, nếu EDIT thì gọi PUT kèm ID
    const url = modalType === "ADD" 
      ? "http://localhost:5000/api/departments" 
      : `http://localhost:5000/api/departments/${currentDept.DepartmentID}`;
      
    const method = modalType === "ADD" ? "POST" : "PUT";

    fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ DepartmentName: currentDept.DepartmentName }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.msg);
        if (data.status === "success") {
          setShowModal(false); // Đóng cửa sổ
          loadDepartments();   // Tải lại bảng dữ liệu mới nhất
        }
      })
      .catch((err) => alert("Lỗi kết nối Backend!"));
  };

  // HÀM XÓA PHÒNG BAN
  const handleDelete = (deptID, deptName) => {
    if (window.confirm(`Bạn có chắc muốn xóa phòng ban: ${deptName}?`)) {
      fetch(`http://localhost:5000/api/departments/${deptID}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          alert(data.msg);
          if (data.status === "success") loadDepartments();
        })
        .catch((err) => alert("Lỗi kết nối Backend!"));
    }
  };

  return (
    <div className="container-fluid" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh", padding: "20px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-0">Quản lý Phòng ban</h3>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-3 w-50">
        <div className="card-header bg-white pt-4 pb-2 d-flex justify-content-between align-items-center">
          <h5 className="fw-bold text-primary mb-0"><i className="bi bi-diagram-3 me-2"></i>Danh sách Phòng ban</h5>
          
          {/* NÚT THÊM MỚI KÍCH HOẠT MODAL */}
          <button onClick={handleOpenAdd} className="btn btn-sm btn-primary">
            <i className="bi bi-plus-lg"></i> Thêm mới
          </button>
        </div>
        
        <div className="card-body">
          <table className="table table-hover align-middle">
            <thead className="table-light text-muted small">
              <tr>
                <th>ID</th>
                <th>TÊN PHÒNG BAN</th>
                <th className="text-center">THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {/* LẶP QUA DỮ LIỆU THẬT ĐỂ HIỂN THỊ */}
              {departments.length > 0 ? departments.map((dept) => (
                <tr key={dept.DepartmentID}>
                  <td className="fw-bold text-secondary">#{dept.DepartmentID}</td>
                  <td className="fw-medium">{dept.DepartmentName}</td>
                  <td className="text-center">
                    
                    {/* NÚT CHỈNH SỬA KÍCH HOẠT MODAL KÈM DỮ LIỆU */}
                    <button 
                      onClick={() => handleOpenEdit(dept)} 
                      className="btn btn-sm btn-light text-primary me-1"
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                    
                    <button onClick={() => handleDelete(dept.DepartmentID, dept.DepartmentName)} className="btn btn-sm btn-light text-danger">
                        <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="3" className="text-center text-muted">Chưa có dữ liệu</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. GIAO DIỆN CỬA SỔ MODAL (CHỈ HIỆN KHI showModal === true) */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-light">
                <h5 className="modal-title fw-bold">
                  {modalType === "ADD" ? "Thêm Phòng ban mới" : "Chỉnh sửa Phòng ban"}
                </h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-bold">Tên Phòng ban</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      required 
                      value={currentDept.DepartmentName}
                      onChange={(e) => setCurrentDept({ ...currentDept, DepartmentName: e.target.value })}
                    />
                  </div>
                </div>
                <div className="modal-footer border-0 bg-light">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Hủy bỏ</button>
                  <button type="submit" className="btn btn-primary">Xác nhận Lưu</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}