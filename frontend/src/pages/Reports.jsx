import React, { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer
} from "recharts";

export default function Reports() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const reportRef = useRef(null);

  const handleExportPDF = async () => {
    if (!reportRef.current) return;

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("Bao_Cao_Nhan_Su.pdf");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      alert("Có lỗi xảy ra khi xuất PDF!");
    }
  };

  useEffect(() => {
    fetch("http://localhost:5000/api/reports")
      .then(res => res.json())
      .then(data => {
        setReportData(data);
        setLoading(false);
      });
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  if (loading) return <div className="p-4 text-center">Đang tải báo cáo...</div>;

  const totalEmp = Object.values(reportData.gender_distribution).reduce((a, b) => a + b, 0);
  const maleCount = reportData.gender_distribution["Nam"] || 0;
  const femaleCount = reportData.gender_distribution["Nữ"] || 0;
  const malePct = totalEmp ? Math.round((maleCount / totalEmp) * 100) : 0;
  const femalePct = totalEmp ? Math.round((femaleCount / totalEmp) * 100) : 0;

  // Chuẩn bị dữ liệu cho BarChart (Xu hướng quỹ lương)
  const barData = reportData.salary_trend.map(d => ({
    name: d.Month,
    "Tổng Lương": d.TotalSalary
  }));

  return (
    <div className="container-fluid" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh", padding: "20px" }} ref={reportRef}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-0">Phân tích & Báo cáo</h3>
          <small className="text-muted">Tổng hợp dữ liệu Nhân sự, Lương, Điểm danh và Cổ tức</small>
        </div>
        <div>

          <button className="btn btn-primary shadow-sm" onClick={handleExportPDF}>
            <i className="bi bi-file-earmark-pdf me-2"></i> Xuất PDF
          </button>
        </div>
      </div>

      <div className="row g-4 mb-4">
        {/* Card 1: Tổng quan Nhân sự */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3 h-100">
            <div className="card-body">
              <h6 className="fw-bold text-muted mb-4">PHÂN BỐ THEO GIỚI TÍNH</h6>
              <div className="d-flex align-items-center justify-content-center mb-3">
                <div style={{
                  width: "120px", height: "120px", borderRadius: "50%",
                  background: `conic-gradient(#0d6efd 0% ${malePct}%, #e83e8c ${malePct}% 100%)`
                }}></div>
              </div>
              <div className="d-flex justify-content-around text-center mt-4">
                <div>
                  <h5 className="fw-bold text-primary mb-0">{malePct}%</h5>
                  <small className="text-muted">Nam ({maleCount})</small>
                </div>
                <div>
                  <h5 className="fw-bold mb-0" style={{ color: "#e83e8c" }}>{femalePct}%</h5>
                  <small className="text-muted">Nữ ({femaleCount})</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Quỹ lương */}
        <div className="col-md-8">
          <div className="card border-0 shadow-sm rounded-3 h-100">
            <div className="card-body">
              <h6 className="fw-bold text-muted mb-4">XU HƯỚNG QUỸ LƯƠNG GẦN ĐÂY</h6>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <BarChart
                    data={barData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis
                      tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                      axisLine={false}
                      tickLine={false}
                    />
                    <RechartsTooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                    <Bar dataKey="Tổng Lương" fill="#0d6efd" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bảng Dữ liệu chi tiết báo cáo */}
      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-header bg-white border-bottom-0 pt-4 pb-2">
          <h6 className="fw-bold">Phân bổ chi phí theo Phòng ban</h6>
        </div>
        <div className="card-body p-0">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light text-muted small">
              <tr>
                <th className="py-3 px-4">PHÒNG BAN</th>
                <th className="py-3 text-center">SỐ NHÂN VIÊN</th>
                <th className="py-3 text-end">TỔNG LƯƠNG CƠ BẢN</th>
                <th className="py-3 text-end">TỔNG PHỤ CẤP</th>
                <th className="py-3 text-end px-4">TỔNG CHI PHÍ</th>
              </tr>
            </thead>
            <tbody>
              {reportData.department_costs.map((dept, idx) => (
                <tr key={idx}>
                  <td className="px-4 fw-bold">{dept.DepartmentName}</td>
                  <td className="text-center">{dept.EmployeeCount}</td>
                  <td className="text-end">{formatCurrency(dept.TotalBase)}</td>
                  <td className="text-end text-success">+ {formatCurrency(dept.TotalBonus)}</td>
                  <td className="text-end fw-bold text-primary px-4">{formatCurrency(dept.TotalNet)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}