import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Employees() {
  const [employees, setEmployees] = useState([]);

  const loadEmployees = () => {
    fetch("http://localhost:5000/api/employees")
      .then((res) => res.json())
      .then((data) => {
        setEmployees(data);
      })
      .catch((err) => console.error("Lỗi tải danh sách:", err));
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const deleteEmployee = (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa nhân viên này?")) return;
    
    fetch(`http://localhost:5000/api/employees/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((rs) => {
        alert(rs.msg);
        if (rs.status === "success") loadEmployees();
      });
  };

  return (
    <div>
      <h3 className="mb-4">Employee List</h3>
      <Link to="/employees/add" className="btn btn-success mb-3">
        + Add Employee
      </Link>
      
      <div className="card shadow-sm">
        <div className="card-body p-0">
          <table className="table table-hover table-bordered mb-0">
            <thead className="table-dark">
              <tr>
                <th className="text-center">ID</th>
                <th>Full Name</th>
                <th>Department</th>
                <th>Position</th>
                <th style={{ width: "150px" }} className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.EmployeeID}>
                  <td className="text-center">{emp.EmployeeID}</td>
                  <td>{emp.FullName}</td>
                  <td>{emp.Department}</td>
                  <td>{emp.Position}</td>
                  <td className="text-center">
                    <Link
                      className="btn btn-primary btn-sm me-2"
                      to={`/employees/${emp.EmployeeID}`}
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteEmployee(emp.EmployeeID)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-4">
                    No data available. Please add some employees or check your backend connection.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}