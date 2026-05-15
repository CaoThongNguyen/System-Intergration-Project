import React from "react";

export default function Dashboard() {
  return (
    <div className="container-fluid" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh", padding: "20px" }}>
      <h3 className="mb-4 fw-bold">Tổng quan (Dashboard)</h3>

      {/* Row 1: Các thẻ thống kê nhỏ */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100 rounded-3">
            <div className="card-body d-flex align-items-center">
              <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-circle me-3">
                <i className="bi bi-people-fill fs-4"></i>
              </div>
              <div>
                <h4 className="mb-0 fw-bold">1,000</h4>
                <small className="text-muted fw-semibold">CUSTOMERS</small>
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
                <h4 className="mb-0 fw-bold">$1,252</h4>
                <small className="text-muted fw-semibold">REVENUE</small>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100 rounded-3">
            <div className="card-body d-flex align-items-center">
              <div className="bg-danger bg-opacity-10 text-danger p-3 rounded-circle me-3">
                <i className="bi bi-arrow-return-left fs-4"></i>
              </div>
              <div>
                <h4 className="mb-0 fw-bold">3,550</h4>
                <small className="text-muted fw-semibold">RETURNS</small>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100 rounded-3">
            <div className="card-body d-flex align-items-center">
              <div className="bg-info bg-opacity-10 text-info p-3 rounded-circle me-3">
                <i className="bi bi-cloud-arrow-down-fill fs-4"></i>
              </div>
              <div>
                <h4 className="mb-0 fw-bold">3,550</h4>
                <small className="text-muted fw-semibold">DOWNLOADS</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Biểu đồ và thông số chi tiết */}
      <div className="row">
        {/* Cột trái (Biểu đồ nhỏ) */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3 mb-4">
            <div className="card-body">
              <h3 className="fw-bold">53.94%</h3>
              <p className="text-primary mb-1 fw-semibold">Conversion Rate</p>
              <small className="text-muted d-block mb-3">Number of conversions divided by the total visitors.</small>
              
              {/* Giả lập biểu đồ cột */}
              <div className="d-flex align-items-end justify-content-between mt-4" style={{ height: "80px" }}>
                <div className="bg-primary rounded-top w-100 mx-1" style={{ height: "40%" }}></div>
                <div className="bg-primary rounded-top w-100 mx-1" style={{ height: "70%" }}></div>
                <div className="bg-primary rounded-top w-100 mx-1" style={{ height: "50%" }}></div>
                <div className="bg-primary rounded-top w-100 mx-1" style={{ height: "90%" }}></div>
                <div className="bg-primary rounded-top w-100 mx-1" style={{ height: "60%" }}></div>
                <div className="bg-primary rounded-top w-100 mx-1" style={{ height: "85%" }}></div>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-body">
              <h3 className="fw-bold">1,432</h3>
              <p className="text-primary mb-1 fw-semibold">Order Delivered</p>
              <small className="text-muted">Total number of order delivered in this month.</small>
            </div>
          </div>
        </div>

        {/* Cột phải (Biểu đồ lớn) */}
        <div className="col-md-8">
          <div className="card border-0 shadow-sm rounded-3 h-100">
            <div className="card-body">
              <h6 className="fw-bold mb-4">Department wise monthly sales report</h6>
              
              <div className="d-flex mb-4">
                <div className="me-5">
                  <h3 className="fw-bold mb-0">$21,356.46</h3>
                  <small className="text-muted">Total Sales</small>
                </div>
                <div>
                  <h3 className="fw-bold mb-0">$1935.6</h3>
                  <small className="text-muted">Average</small>
                </div>
              </div>

              {/* Vùng chứa Biểu đồ chính (Placeholder) */}
              <div className="bg-light rounded-3 d-flex flex-column align-items-center justify-content-center w-100" style={{ height: "250px", border: "2px dashed #dee2e6" }}>
                <i className="bi bi-bar-chart-line text-muted" style={{ fontSize: "3rem" }}></i>
                <span className="text-muted mt-2">Khu vực hiển thị Biểu đồ Doanh thu</span>
                <small className="text-muted">(Có thể tích hợp thư viện Recharts hoặc Chart.js sau)</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}