import React, { useState, useEffect } from "react";

export default function Positions() {
  // 1. STATE CHỨA DỮ LIỆU THẬT
  const [positions, setPositions] = useState([]);
  
  // 2. STATE ĐIỀU KHIỂN CỬA SỔ (MODAL)
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("ADD"); 
  const [currentPos, setCurrentPos] = useState({ PositionID: "", PositionName: "" });

  // 3. HÀM GỌI API LẤY DỮ LIỆU TỪ FLASK
  const loadPositions = () => {
    fetch("http://localhost:5000/api/positions")
      .then(res => res.json())
      .then(data => setPositions(data))
      .catch(err => console.error("Chưa kết nối được Backend:", err));
  };

  useEffect(() => {
    loadPositions();
  }, []);

  // 4. CÁC HÀM TƯƠNG TÁC NÚT BẤM
  const handleOpenAdd = () => {
    setModalType("ADD");
    setCurrentPos({ PositionID: "", PositionName: "" }); 
    setShowModal(true);
  };

  const handleOpenEdit = (pos) => {
    setModalType("EDIT");
    setCurrentPos(pos); 
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // HÀM LƯU DỮ LIỆU (THÊM / SỬA)
  const handleSave = (e) => {
    e.preventDefault();
    
    const url = modalType === "ADD" 
      ? "http://localhost:5000/api/positions" 
      : `http://localhost:5000/api/positions/${currentPos.PositionID}`;
      
    const method = modalType === "ADD" ? "POST" : "PUT";

    fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ PositionName: currentPos.PositionName }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.msg);
        if (data.status === "success") {
          setShowModal(false);
          loadPositions(); 
        }
      })
      .catch((err) => alert("Lỗi kết nối Backend!"));
  };

  // HÀM XÓA VỊ TRÍ
  const handleDelete = (posID, posName) => {
    if (window.confirm(`Bạn có chắc muốn xóa chức vụ: ${posName}?`)) {
      fetch(`http://localhost:5000/api/positions/${posID}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          alert(data.msg);
          if (data.status === "success") loadPositions();
        })
        .catch((err) => alert("Lỗi kết nối Backend!"));
    }
  };

  return (
    <div className="container-fluid" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh", padding: "20px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold mb-0">Quản lý Vị trí & Chức vụ</h3>
      </div>

      <div className="card border-0 shadow-sm rounded-3 w-50">
        <div className="card-header bg-white pt-4 pb-2 d-flex justify-content-between align-items-center">
          <h5 className="fw-bold text-success mb-0"><i className="bi bi-briefcase me-2"></i>Danh sách Vị trí</h5>
          <button onClick={handleOpenAdd} className="btn btn-sm btn-success">
            <i className="bi bi-plus-lg"></i> Thêm mới
          </button>
        </div>
        
        <div className="card-body">
          <table className="table table-hover align-middle">
            <thead className="table-light text-muted small">
              <tr>
                <th>ID</th>
                <th>TÊN VỊ TRÍ</th>
                <th className="text-center">THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {positions.length > 0 ? positions.map((pos) => (
                <tr key={pos.PositionID}>
                  <td className="fw-bold text-secondary">#{pos.PositionID}</td>
                  <td className="fw-medium">{pos.PositionName}</td>
                  <td className="text-center">
                    <button 
                      onClick={() => handleOpenEdit(pos)} 
                      className="btn btn-sm btn-light text-primary me-1"
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                    <button onClick={() => handleDelete(pos.PositionID, pos.PositionName)} className="btn btn-sm btn-light text-danger">
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

      {/* CỬA SỔ MODAL THÊM/SỬA */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-light">
                <h5 className="modal-title fw-bold">
                  {modalType === "ADD" ? "Thêm Vị trí mới" : "Chỉnh sửa Vị trí"}
                </h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-bold">Tên Vị trí / Chức vụ</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      required 
                      value={currentPos.PositionName}
                      onChange={(e) => setCurrentPos({ ...currentPos, PositionName: e.target.value })}
                    />
                  </div>
                </div>
                <div className="modal-footer border-0 bg-light">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Hủy bỏ</button>
                  <button type="submit" className="btn btn-success">Xác nhận Lưu</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}