import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EmployeeEdit() {
  const nav = useNavigate();
  const { id } = useParams();

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

  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.id]: e.target.value,
    });
  };

  const convertDate = (dt) => {
    if (!dt) return "";
    return new Date(dt).toISOString().substring(0, 10);
  };

  const loadDropdowns = () => {
    fetch("http://localhost:5000/api/departments")
      .then((res) => res.json())
      .then((data) => setDepartments(data))
      .catch(() => alert("Không load được danh sách phòng ban"));

    fetch("http://localhost:5000/api/positions")
      .then((res) => res.json())
      .then((data) => setPositions(data))
      .catch(() => alert("Không load được danh sách chức vụ"));
  };

  const loadEmployee = () => {
    fetch(`http://localhost:5000/api/employees/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setForm({
          FullName: data.FullName || "",
          DateOfBirth: convertDate(data.DateOfBirth),
          Gender: data.Gender || "",
          PhoneNumber: data.PhoneNumber || "",
          Email: data.Email || "",
          HireDate: convertDate(data.HireDate),
          DepartmentID: data.DepartmentID || "",
          PositionID: data.PositionID || "",
          Status: data.Status || "Active",
        });
      })
      .catch(() => alert("Không tải được dữ liệu nhân viên!"));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:5000/api/employees/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((rs) => {
        alert(rs.msg);
        if (rs.status === "success") {
          nav("/");
        }
      })
      .catch(() => alert("Không thể cập nhật nhân viên"));
  };

  useEffect(() => {
    loadDropdowns();
    loadEmployee();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container-fluid" style={{ maxWidth: "800px" }}>
      <h3 className="mb-4">Edit Employee</h3>
      
      <div className="card shadow-sm border-primary">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold text-primary">Full Name</label>
                <input
                  id="FullName"
                  className="form-control"
                  value={form.FullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Email</label>
                <input
                  id="Email"
                  type="email"
                  className="form-control"
                  value={form.Email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Date of Birth</label>
                <input
                  type="date"
                  id="DateOfBirth"
                  className="form-control"
                  value={form.DateOfBirth}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Phone Number</label>
                <input
                  id="PhoneNumber"
                  className="form-control"
                  value={form.PhoneNumber}
                  onChange={handleChange}
                  required
                />
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
                  className="form-control"
                  value={form.HireDate}
                  onChange={handleChange}
                  required
                />
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
                  <option value="Đang làm việc">Đang làm việc</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <button type="submit" className="btn btn-primary px-4 me-2">
                Save Changes
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