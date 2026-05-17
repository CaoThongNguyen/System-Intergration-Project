import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Alerts() {
  const [alerts, setAlerts] = useState({ events: [], leave_alerts: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/alerts")
      .then(res => res.json())
      .then(data => {
        setAlerts(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-4 text-center">Đang tải cảnh báo...</div>;

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
                
                {alerts.leave_alerts.length === 0 && (
                  <div className="text-muted text-center py-3">Không có cảnh báo vi phạm nào.</div>
                )}
                
                {alerts.leave_alerts.map((alert, idx) => (
                  <div key={idx} className="list-group-item px-0 py-3 d-flex align-items-start border-bottom">
                    <div className="bg-danger bg-opacity-10 text-danger p-2 rounded-circle me-3 mt-1">
                      <i className="bi bi-exclamation-triangle-fill fs-5"></i>
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-center">
                        <h6 className="fw-bold mb-1">Cảnh báo nghỉ phép vượt mức</h6>
                        <small className="text-muted">Hệ thống</small>
                      </div>
                      <p className="text-muted mb-1 small">
                        Nhân viên <strong>{alert.FullName} ({alert.DepartmentName})</strong> đã sử dụng {alert.LeaveDays} ngày phép. Cần kiểm tra lại dữ liệu chấm công.
                      </p>
                      <button className="btn btn-sm btn-outline-danger mt-1">Gửi Email Cảnh báo</button>
                    </div>
                  </div>
                ))}

                {/* Giữ 1 alert giả cho mục đích thẩm mỹ nếu không có cảnh báo lương từ backend */}
                <div className="list-group-item px-0 py-3 d-flex align-items-start border-bottom">
                  <div className="bg-warning bg-opacity-10 text-warning p-2 rounded-circle me-3 mt-1">
                    <i className="bi bi-cash-stack fs-5"></i>
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-center">
                      <h6 className="fw-bold mb-1">Kiểm tra chênh lệch lương</h6>
                      <small className="text-muted">Hệ thống</small>
                    </div>
                    <p className="text-muted mb-1 small">Hãy thường xuyên kiểm tra báo cáo lương để phát hiện chênh lệch bất thường.</p>
                    <button className="btn btn-sm btn-outline-warning mt-1 text-dark" onClick={() => navigate('/reports')}>Xem báo cáo lương</button>
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
              
              {alerts.events.length === 0 && (
                <div className="text-muted small">Không có sự kiện nào trong tháng này.</div>
              )}

              {alerts.events.map((ev, idx) => (
                <div key={idx} className="d-flex align-items-center mb-3 bg-white p-3 rounded-3 shadow-sm">
                  <div className={`${ev.type === 'birthday' ? 'bg-success' : 'bg-primary'} text-white rounded-circle d-flex justify-content-center align-items-center me-3 fw-bold`} style={{ width: "40px", height: "40px" }}>
                    {ev.FullName.charAt(0)}
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0 text-dark">{ev.FullName}</h6>
                    <small className="text-muted">
                      {ev.type === 'birthday' ? `Sinh nhật (${new Date(ev.Date).toLocaleDateString('vi-VN')})` : `Kỷ niệm làm việc (${new Date(ev.Date).toLocaleDateString('vi-VN')})`}
                    </small>
                  </div>
                </div>
              ))}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}