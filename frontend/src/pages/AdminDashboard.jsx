import React, { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

export default function Dashboard() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="p-4 text-center">Đang tải dữ liệu tổng quan...</div>;

  // Tính toán các chỉ số
  const totalEmp = Object.values(reportData.gender_distribution).reduce((a, b) => a + b, 0);
  const totalDepts = reportData.department_costs.length;
  const totalPayroll = reportData.department_costs.reduce((sum, dept) => sum + dept.TotalNet, 0);
  const avgSalary = totalEmp > 0 ? Math.round(totalPayroll / totalEmp) : 0;

  // Chuẩn bị dữ liệu cho PieChart (Chi phí phòng ban)
  const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#E83E8C',
    '#4CAF50', '#9C27B0', '#F44336', '#3F51B5', '#00BCD4', '#8BC34A',
    '#FF9800', '#795548', '#607D8B'
  ];
  const pieData = reportData.department_costs.map(d => ({
    name: d.DepartmentName,
    value: d.TotalNet
  }));

  // Chuẩn bị dữ liệu cho BarChart (Xu hướng quỹ lương)
  const barData = reportData.salary_trend.map(d => ({
    name: d.Month,
    "Tổng Lương": d.TotalSalary
  }));

  return (
    <div className="container-fluid" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh", padding: "20px" }}>
      <h3 className="mb-4 fw-bold">Tổng quan</h3>

      {/* Row 1: Các thẻ thống kê nhỏ */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100 rounded-3">
            <div className="card-body d-flex align-items-center">
              <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-circle me-3">
                <i className="bi bi-people-fill fs-4"></i>
              </div>
              <div>
                <h4 className="mb-0 fw-bold">{totalEmp}</h4>
                <small className="text-muted fw-semibold">TỔNG NHÂN VIÊN</small>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100 rounded-3">
            <div className="card-body d-flex align-items-center">
              <div className="bg-success bg-opacity-10 text-success p-3 rounded-circle me-3">
                <i className="bi bi-currency-dollar fs-4"></i>
              </div>
              <div>
                <h4 className="mb-0 fw-bold">{formatCurrency(totalPayroll)}</h4>
                <small className="text-muted fw-semibold">TỔNG QUỸ LƯƠNG</small>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100 rounded-3">
            <div className="card-body d-flex align-items-center">
              <div className="bg-danger bg-opacity-10 text-danger p-3 rounded-circle me-3">
                <i className="bi bi-building fs-4"></i>
              </div>
              <div>
                <h4 className="mb-0 fw-bold">{totalDepts}</h4>
                <small className="text-muted fw-semibold">PHÒNG BAN</small>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100 rounded-3">
            <div className="card-body d-flex align-items-center">
              <div className="bg-info bg-opacity-10 text-info p-3 rounded-circle me-3">
                <i className="bi bi-cash-stack fs-4"></i>
              </div>
              <div>
                <h4 className="mb-0 fw-bold">{formatCurrency(avgSalary)}</h4>
                <small className="text-muted fw-semibold">LƯƠNG TRUNG BÌNH</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Biểu đồ và thông số chi tiết */}
      <div className="row">
        {/* Cột trái (Biểu đồ tròn) */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3 mb-4 h-100">
            <div className="card-body">
              <h6 className="fw-bold mb-4">Phân bổ ngân sách Phòng ban</h6>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(value) => formatCurrency(value)} />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Cột phải (Biểu đồ lớn) */}
        <div className="col-md-8">
          <div className="card border-0 shadow-sm rounded-3 h-100">
            <div className="card-body">
              <h6 className="fw-bold mb-4">Xu hướng Quỹ lương 6 tháng qua</h6>

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
    </div>
  );
}