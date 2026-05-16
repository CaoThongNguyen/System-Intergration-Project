import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EmployeeAdd() {
  const nav = useNavigate();
  
  const [form, setForm] = useState({
    FullName: "",
    DateOfBirth: "",
    Gender: "",
    PhoneNumber: "",
    Email: "",
    HireDate: "",
    DepartmentID: "",
    PositionID: "",
    Status: "Active",
  });

  const [errors, setErrors] = useState({});

  // Lấy ngày hôm nay dạng YYYY-MM-DD để giới hạn date picker
  const today = new Date().toISOString().split("T")[0];

  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.id]: e.target.value,
    });
  };

  const loadDropdowns = () => {
    fetch("http://localhost:5000/api/departments")
      .then((r) => r.json())
      .then((data) => setDepartments(data));
      
    fetch("http://localhost:5000/api/positions")
      .then((r) => r.json())
      .then((data) => setPositions(data));
  };

  // Hàm validate toàn bộ form trước khi submit
  const validateForm = () => {
    const newErrors = {};

    // Validate FullName: không được rỗng hoặc chỉ có khoảng trắng
    if (!form.FullName || !form.FullName.trim()) {
      newErrors.FullName = "Họ tên không được để trống.";
    }

    // Validate PhoneNumber: chỉ chứa số, 10-11 ký tự
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(form.PhoneNumber)) {
      newErrors.PhoneNumber = "Số điện thoại phải là 10-11 chữ số (không chứa chữ hoặc ký tự đặc biệt).";
    }

    // Validate DateOfBirth: không được là ngày tương lai
    if (form.DateOfBirth && form.DateOfBirth > today) {
      newErrors.DateOfBirth = "Ngày sinh không được lớn hơn ngày hiện tại.";
    }

    // Validate HireDate: không được là ngày tương lai
    if (form.HireDate && form.HireDate > today) {
      newErrors.HireDate = "Ngày vào làm không được lớn hơn ngày hiện tại.";
    }

    // Validate Email: regex cơ bản
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (form.Email && !emailRegex.test(form.Email)) {
      newErrors.Email = "Email không hợp lệ.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return; // Dừng nếu có lỗi validation

    fetch("http://localhost:5000/api/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((r) => r.json())
      .then((res) => {
        alert(res.msg);
        if (res.status === "success") {
          nav("/employees");
        }
      });
  };

  

  useEffect(() => {
    loadDropdowns();
  }, []);

  return (
    <div className="container-fluid" style={{ maxWidth: "800px" }}>
      <h3 className="mb-4">Add New Employee</h3>
      
      <div className="card shadow-sm">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Full Name</label>
                <input
                  id="FullName"
                  className={`form-control ${errors.FullName ? 'is-invalid' : ''}`}
                  value={form.FullName}
                  onChange={handleChange}
                  required
                />
                {errors.FullName && <div className="invalid-feedback">{errors.FullName}</div>}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Email</label>
                <input
                  id="Email"
                  type="email"
                  className={`form-control ${errors.Email ? 'is-invalid' : ''}`}
                  value={form.Email}
                  onChange={handleChange}
                  required
                />
                {errors.Email && <div className="invalid-feedback">{errors.Email}</div>}
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Date of Birth</label>
                <input
                  type="date"
                  id="DateOfBirth"
                  className={`form-control ${errors.DateOfBirth ? 'is-invalid' : ''}`}
                  value={form.DateOfBirth}
                  onChange={handleChange}
                  max={today}
                  required
                />
                {errors.DateOfBirth && <div className="invalid-feedback">{errors.DateOfBirth}</div>}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Phone Number</label>
                <input
                  id="PhoneNumber"
                  type="tel"
                  className={`form-control ${errors.PhoneNumber ? 'is-invalid' : ''}`}
                  value={form.PhoneNumber}
                  onChange={handleChange}
                  pattern="[0-9]{10,11}"
                  title="Số điện thoại phải là 10-11 chữ số"
                  required
                />
                {errors.PhoneNumber && <div className="invalid-feedback">{errors.PhoneNumber}</div>}
              </div>
            </div>

            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label fw-bold">Gender</label>
                <select
                  id="Gender"
                  className="form-select"
                  value={form.Gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select --</option>
                  <option>Nam</option>
                  <option>Nữ</option>
                  <option>Khác</option>
                </select>
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label fw-bold">Department</label>
                <select
                  id="DepartmentID"
                  className="form-select"
                  value={form.DepartmentID}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select --</option>
                  {departments.map((d) => (
                    <option key={d.DepartmentID} value={d.DepartmentID}>
                      {d.DepartmentName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label fw-bold">Position</label>
                <select
                  id="PositionID"
                  className="form-select"
                  value={form.PositionID}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select --</option>
                  {positions.map((p) => (
                    <option key={p.PositionID} value={p.PositionID}>
                      {p.PositionName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Hire Date</label>
                <input
                  type="date"
                  id="HireDate"
                  className={`form-control ${errors.HireDate ? 'is-invalid' : ''}`}
                  value={form.HireDate}
                  onChange={handleChange}
                  max={today}
                  required
                />
                {errors.HireDate && <div className="invalid-feedback">{errors.HireDate}</div>}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Status</label>
                <select
                  id="Status"
                  className="form-select"
                  value={form.Status}
                  onChange={handleChange}
                  required
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <button type="submit" className="btn btn-primary px-4 me-2">
                Save Employee
              </button>
              <button type="button" className="btn btn-secondary px-4" onClick={() => nav('/')}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}