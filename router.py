from flask import Blueprint, jsonify, request
from config import get_sqlserver_connection, get_mysql_connection
import re
import datetime

# Khởi tạo đối tượng Blueprint
router = Blueprint("router", __name__)

# ==========================================
# API CRUD CHO PHÒNG BAN (DEPARTMENTS)
# ==========================================

# LẤY DANH SÁCH PHÒNG BAN (từ SQL Server HUMAN_2025)
@router.route("/api/departments", methods=["GET"])
def get_departments():
    sql = get_sqlserver_connection()
    try:
        cur = sql.cursor()
        cur.execute("SELECT DepartmentID, DepartmentName FROM Departments ORDER BY DepartmentID")
        rows = []
        for r in cur.fetchall():
            rows.append({
                "DepartmentID": r[0],
                "DepartmentName": r[1]
            })
        return jsonify(rows)
    except Exception as e:
        return jsonify({"status": "error", "msg": str(e)}), 500

# THÊM PHÒNG BAN MỚI (Đồng bộ sang MySQL)
@router.route("/api/departments", methods=["POST"])
def add_department():
    data = request.get_json()
    dept_name = data.get("DepartmentName", "").strip()
    
    if not dept_name:
        return jsonify({"status": "error", "msg": "Tên phòng ban không được để trống."}), 400
    if dept_name.isdigit():
        return jsonify({"status": "error", "msg": "Tên phòng ban không được chỉ chứa chữ số."}), 400
    
    sql = get_sqlserver_connection()
    my = get_mysql_connection()
    sql.autocommit = False
    my.start_transaction()

    try:
        cur = sql.cursor()

        # Tìm ID phòng ban còn trống nhỏ nhất
        cur.execute("""
            SELECT MIN(t1.Id + 1)
            FROM (SELECT 0 AS Id UNION ALL SELECT DepartmentID FROM Departments) t1
            LEFT JOIN Departments t2 ON t1.Id + 1 = t2.DepartmentID
            WHERE t2.DepartmentID IS NULL
        """)
        new_dept_id = cur.fetchone()[0]

        # Insert vào SQL Server với IDENTITY_INSERT
        cur.execute("SET IDENTITY_INSERT Departments ON")
        cur.execute("""
            INSERT INTO Departments (DepartmentID, DepartmentName) 
            VALUES (?, ?)
        """, (new_dept_id, dept_name))
        cur.execute("SET IDENTITY_INSERT Departments OFF")

        # Đồng bộ Insert sang MySQL
        my_cur = my.cursor()
        my_cur.execute("""
            INSERT INTO departments_payroll (DepartmentID, DepartmentName) 
            VALUES (%s, %s)
        """, (new_dept_id, dept_name))

        sql.commit()
        my.commit()
        return jsonify({"status": "success", "msg": f"Thêm phòng ban thành công (ID: {new_dept_id})!"})
    except Exception as e:
        sql.rollback()
        my.rollback()
        return jsonify({"status": "error", "msg": str(e)}), 500

# CẬP NHẬT PHÒNG BAN (Đồng bộ sang MySQL)
@router.route("/api/departments/<int:dept_id>", methods=["PUT"])
def update_department(dept_id):
    data = request.get_json()
    dept_name = data.get("DepartmentName", "").strip()
    
    if not dept_name:
        return jsonify({"status": "error", "msg": "Tên phòng ban không được để trống."}), 400
    if dept_name.isdigit():
        return jsonify({"status": "error", "msg": "Tên phòng ban không được chỉ chứa chữ số."}), 400
    
    sql = get_sqlserver_connection()
    my = get_mysql_connection()
    sql.autocommit = False
    my.start_transaction()

    try:
        # Cập nhật SQL Server
        cur = sql.cursor()
        cur.execute("UPDATE Departments SET DepartmentName = ? WHERE DepartmentID = ?", (dept_name, dept_id))
        
        # Cập nhật MySQL
        my_cur = my.cursor()
        my_cur.execute("UPDATE departments_payroll SET DepartmentName = %s WHERE DepartmentID = %s", (dept_name, dept_id))

        sql.commit()
        my.commit()
        return jsonify({"status": "success", "msg": "Cập nhật thành công!"})
    except Exception as e:
        sql.rollback()
        my.rollback()
        return jsonify({"status": "error", "msg": str(e)}), 500

# XÓA PHÒNG BAN (Đồng bộ sang MySQL)
@router.route("/api/departments/<int:dept_id>", methods=["DELETE"])
def delete_department(dept_id):
    sql = get_sqlserver_connection()
    my = get_mysql_connection()
    sql.autocommit = False
    my.start_transaction()

    try:
        cur = sql.cursor()
        # Kiểm tra xem phòng ban có nhân viên không trước khi xóa
        cur.execute("SELECT COUNT(*) FROM Employees WHERE DepartmentID = ?", (dept_id,))
        if cur.fetchone()[0] > 0:
            return jsonify({"status": "error", "msg": "Không thể xóa vì phòng ban đang có nhân viên!"}), 400
            
        # Xóa bên MySQL trước (vì nó chứa khóa ngoại)
        my_cur = my.cursor()
        my_cur.execute("DELETE FROM departments_payroll WHERE DepartmentID = %s", (dept_id,))

        # Xóa bên SQL Server
        cur.execute("DELETE FROM Departments WHERE DepartmentID = ?", (dept_id,))
        
        sql.commit()
        my.commit()
        return jsonify({"status": "success", "msg": "Xóa phòng ban thành công!"})
    except Exception as e:
        sql.rollback()
        my.rollback()
        return jsonify({"status": "error", "msg": str(e)}), 500


# ==========================================
# API CRUD CHO VỊ TRÍ (POSITIONS)
# ==========================================

# LẤY DANH SÁCH VỊ TRÍ (từ SQL Server HUMAN_2025)
@router.route("/api/positions", methods=["GET"])
def get_positions():
    sql = get_sqlserver_connection()
    try:
        cur = sql.cursor()
        cur.execute("SELECT PositionID, PositionName FROM Positions ORDER BY PositionID")
        rows = []
        for r in cur.fetchall():
            rows.append({
                "PositionID": r[0],
                "PositionName": r[1]
            })
        return jsonify(rows)
    except Exception as e:
        return jsonify({"status": "error", "msg": str(e)}), 500

# THÊM VỊ TRÍ (Đồng bộ sang MySQL)
@router.route("/api/positions", methods=["POST"])
def add_position():
    data = request.get_json()
    pos_name = data.get("PositionName", "").strip()
    
    if not pos_name:
        return jsonify({"status": "error", "msg": "Tên vị trí không được để trống."}), 400
    if pos_name.isdigit():
        return jsonify({"status": "error", "msg": "Tên vị trí không được chỉ chứa chữ số."}), 400
    
    sql = get_sqlserver_connection()
    my = get_mysql_connection()
    sql.autocommit = False
    my.start_transaction()

    try:
        cur = sql.cursor()
        
        # Tìm ID vị trí còn trống nhỏ nhất
        cur.execute("""
            SELECT MIN(t1.Id + 1)
            FROM (SELECT 0 AS Id UNION ALL SELECT PositionID FROM Positions) t1
            LEFT JOIN Positions t2 ON t1.Id + 1 = t2.PositionID
            WHERE t2.PositionID IS NULL
        """)
        new_pos_id = cur.fetchone()[0]

        cur.execute("SET IDENTITY_INSERT Positions ON")
        cur.execute("""
            INSERT INTO Positions (PositionID, PositionName) 
            VALUES (?, ?)
        """, (new_pos_id, pos_name))
        cur.execute("SET IDENTITY_INSERT Positions OFF")

        my_cur = my.cursor()
        my_cur.execute("""
            INSERT INTO positions_payroll (PositionID, PositionName) 
            VALUES (%s, %s)
        """, (new_pos_id, pos_name))

        sql.commit()
        my.commit()
        return jsonify({"status": "success", "msg": f"Thêm chức vụ thành công (ID: {new_pos_id})!"})
    except Exception as e:
        sql.rollback()
        my.rollback()
        return jsonify({"status": "error", "msg": str(e)}), 500

# CẬP NHẬT VỊ TRÍ (Đồng bộ sang MySQL)
@router.route("/api/positions/<int:pos_id>", methods=["PUT"])
def update_position(pos_id):
    data = request.get_json()
    pos_name = data.get("PositionName", "").strip()
    
    if not pos_name:
        return jsonify({"status": "error", "msg": "Tên vị trí không được để trống."}), 400
    if pos_name.isdigit():
        return jsonify({"status": "error", "msg": "Tên vị trí không được chỉ chứa chữ số."}), 400
    
    sql = get_sqlserver_connection()
    my = get_mysql_connection()
    sql.autocommit = False
    my.start_transaction()

    try:
        cur = sql.cursor()
        cur.execute("UPDATE Positions SET PositionName = ? WHERE PositionID = ?", (pos_name, pos_id))
        
        my_cur = my.cursor()
        my_cur.execute("UPDATE positions_payroll SET PositionName = %s WHERE PositionID = %s", (pos_name, pos_id))

        sql.commit()
        my.commit()
        return jsonify({"status": "success", "msg": "Cập nhật thành công!"})
    except Exception as e:
        sql.rollback()
        my.rollback()
        return jsonify({"status": "error", "msg": str(e)}), 500

# XÓA VỊ TRÍ (Đồng bộ sang MySQL)
@router.route("/api/positions/<int:pos_id>", methods=["DELETE"])
def delete_position(pos_id):
    sql = get_sqlserver_connection()
    my = get_mysql_connection()
    sql.autocommit = False
    my.start_transaction()

    try:
        cur = sql.cursor()
        cur.execute("SELECT COUNT(*) FROM Employees WHERE PositionID = ?", (pos_id,))
        if cur.fetchone()[0] > 0:
            return jsonify({"status": "error", "msg": "Không thể xóa vì vị trí đang được sử dụng!"}), 400
            
        my_cur = my.cursor()
        my_cur.execute("DELETE FROM positions_payroll WHERE PositionID = %s", (pos_id,))

        cur.execute("DELETE FROM Positions WHERE PositionID = ?", (pos_id,))
        
        sql.commit()
        my.commit()
        return jsonify({"status": "success", "msg": "Xóa vị trí thành công!"})
    except Exception as e:
        sql.rollback()
        my.rollback()
        return jsonify({"status": "error", "msg": str(e)}), 500

# ==========================================
# API CRUD CHO NHÂN VIÊN (EMPLOYEES)
# ==========================================

# LẤY DANH SÁCH NHÂN VIÊN
@router.route("/api/employees", methods=["GET"])
def get_employees():
    sql = get_sqlserver_connection()
    try:
        cur = sql.cursor()
        # Lấy dữ liệu nhân viên kèm tên phòng ban, chức vụ, và các ID/trạng thái để lọc
        cur.execute("""
            SELECT e.EmployeeID, e.FullName, d.DepartmentName, p.PositionName,
                   e.DepartmentID, e.PositionID, e.Status
            FROM Employees e
            LEFT JOIN Departments d ON e.DepartmentID = d.DepartmentID
            LEFT JOIN Positions p ON e.PositionID = p.PositionID
            ORDER BY e.EmployeeID
        """)
        
        rows = []
        for r in cur.fetchall():
            # Chuyển đổi Status từ Vietnamese (SQL Server) sang English (frontend)
            raw_status = r[6] if r[6] else ""
            if raw_status in ("Đang làm việc", "Thử việc", "Thực tập"):
                display_status = "Active"
            elif raw_status in ("Nghỉ việc", "Nghỉ phép"):
                display_status = "Inactive"
            else:
                display_status = "Active"

            rows.append({
                "EmployeeID": r[0],
                "FullName": r[1],
                "Department": r[2] if r[2] else "Chưa có",
                "Position": r[3] if r[3] else "Chưa có",
                "DepartmentID": r[4] if r[4] else None,
                "PositionID": r[5] if r[5] else None,
                "Status": display_status
            })
            
        return jsonify(rows)
    except Exception as e:
        return jsonify({"status": "error", "msg": str(e)}), 500

# LẤY CHI TIẾT 1 NHÂN VIÊN (theo ID)
@router.route("/api/employees/<int:emp_id>", methods=["GET"])
def get_employee(emp_id):
    sql = get_sqlserver_connection()
    try:
        cur = sql.cursor()
        cur.execute("""
            SELECT EmployeeID, FullName, DateOfBirth, Gender, PhoneNumber, 
                   Email, HireDate, DepartmentID, PositionID, Status
            FROM Employees
            WHERE EmployeeID = ?
        """, (emp_id,))
        r = cur.fetchone()
        if not r:
            return jsonify({"status": "error", "msg": "Không tìm thấy nhân viên!"}), 404
        
        # Chuyển đổi Status từ Vietnamese (SQL Server) sang English (frontend)
        raw_status = r[9] if r[9] else ""
        if raw_status in ("Đang làm việc", "Thử việc", "Thực tập"):
            display_status = "Active"
        elif raw_status in ("Nghỉ việc", "Nghỉ phép"):
            display_status = "Inactive"
        else:
            display_status = "Active"

        emp = {
            "EmployeeID": r[0],
            "FullName": r[1],
            "DateOfBirth": str(r[2]) if r[2] else "",
            "Gender": r[3] if r[3] else "",
            "PhoneNumber": r[4] if r[4] else "",
            "Email": r[5] if r[5] else "",
            "HireDate": str(r[6]) if r[6] else "",
            "DepartmentID": r[7] if r[7] else "",
            "PositionID": r[8] if r[8] else "",
            "Status": display_status
        }
        return jsonify(emp)
    except Exception as e:
        return jsonify({"status": "error", "msg": str(e)}), 500

# THÊM NHÂN VIÊN MỚI (Đồng bộ sang MySQL)
@router.route("/api/employees", methods=["POST"])
def add_employee():
    data = request.get_json()
    
    # === VALIDATION SERVER-SIDE ===
    errors = []
    
    # Validate FullName
    full_name = (data.get("FullName") or "").strip()
    if not full_name:
        errors.append("Họ tên không được để trống.")
    
    # Validate PhoneNumber: chỉ chứa số, 10-11 ký tự
    phone = data.get("PhoneNumber") or ""
    if not re.match(r'^[0-9]{10,11}$', phone):
        errors.append("Số điện thoại phải là 10-11 chữ số (không chứa chữ hoặc ký tự đặc biệt).")
    
    # Validate DateOfBirth: không được là ngày tương lai
    dob = data.get("DateOfBirth")
    if dob:
        try:
            dob_date = datetime.datetime.strptime(dob, "%Y-%m-%d").date()
            if dob_date > datetime.date.today():
                errors.append("Ngày sinh không được lớn hơn ngày hiện tại.")
        except ValueError:
            errors.append("Ngày sinh không hợp lệ (định dạng YYYY-MM-DD).")
    
    # Validate HireDate: không được là ngày tương lai
    hire_date = data.get("HireDate")
    if hire_date:
        try:
            hire_dt = datetime.datetime.strptime(hire_date, "%Y-%m-%d").date()
            if hire_dt > datetime.date.today():
                errors.append("Ngày vào làm không được lớn hơn ngày hiện tại.")
        except ValueError:
            errors.append("Ngày vào làm không hợp lệ (định dạng YYYY-MM-DD).")
    
    # Validate Email (cơ bản)
    email = data.get("Email") or ""
    if email and not re.match(r'^[^\s@]+@[^\s@]+\.[^\s@]+$', email):
        errors.append("Email không hợp lệ.")
    
    if errors:
        return jsonify({"status": "error", "msg": " | ".join(errors)}), 400
    # === END VALIDATION ===

    sql = get_sqlserver_connection()
    my = get_mysql_connection()
    sql.autocommit = False
    my.start_transaction()

    try:
        cur = sql.cursor()

        # Kiểm tra trùng lặp Email và PhoneNumber
        if email:
            cur.execute("SELECT COUNT(*) FROM Employees WHERE Email = ?", (email,))
            if cur.fetchone()[0] > 0:
                return jsonify({"status": "error", "msg": "Email này đã tồn tại trong hệ thống."}), 400
                
        if phone:
            cur.execute("SELECT COUNT(*) FROM Employees WHERE PhoneNumber = ?", (phone,))
            if cur.fetchone()[0] > 0:
                return jsonify({"status": "error", "msg": "Số điện thoại này đã tồn tại trong hệ thống."}), 400

        # Chuyển đổi Status từ English (frontend) sang Vietnamese (SQL Server)
        status_val = data.get("Status", "Active")
        if status_val == "Active":
            sql_status = "Đang làm việc"
        elif status_val == "Inactive":
            sql_status = "Nghỉ việc"
        else:
            sql_status = status_val

        cur = sql.cursor()

        # Tìm ID nhân viên còn trống nhỏ nhất (lấp đầy khoảng trống khi nhân viên bị xóa)
        cur.execute("""
            SELECT MIN(t1.Id + 1)
            FROM (SELECT 0 AS Id UNION ALL SELECT EmployeeID FROM Employees) t1
            LEFT JOIN Employees t2 ON t1.Id + 1 = t2.EmployeeID
            WHERE t2.EmployeeID IS NULL
        """)
        next_id = cur.fetchone()[0]

        # Bật IDENTITY_INSERT để được phép chèn ID thủ công
        cur.execute("SET IDENTITY_INSERT Employees ON")
        cur.execute("""
            INSERT INTO Employees (EmployeeID, FullName, DateOfBirth, Gender, PhoneNumber, Email, HireDate, DepartmentID, PositionID, Status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            next_id,
            full_name,
            data.get("DateOfBirth") or None,
            data.get("Gender"),
            phone,
            email,
            data.get("HireDate") or None,
            data.get("DepartmentID") or None,
            data.get("PositionID") or None,
            sql_status
        ))
        cur.execute("SET IDENTITY_INSERT Employees OFF")
        new_emp_id = next_id

        status_val = data.get("Status", "Active")
        if status_val == "Active":
            my_status = "Đang làm việc"
        elif status_val == "Inactive":
            my_status = "Nghỉ việc"
        else:
            my_status = status_val

        # Đồng bộ sang MySQL (bảng employees_payroll)
        my_cur = my.cursor()
        my_cur.execute("""
            INSERT INTO employees_payroll (EmployeeID, FullName, DepartmentID, PositionID, Status)
            VALUES (%s, %s, %s, %s, %s)
        """, (
            new_emp_id,
            full_name,
            data.get("DepartmentID") or None,
            data.get("PositionID") or None,
            my_status
        ))

        sql.commit()
        my.commit()
        return jsonify({"status": "success", "msg": f"Thêm nhân viên thành công (ID: {new_emp_id})!"})
    except Exception as e:
        sql.rollback()
        my.rollback()
        return jsonify({"status": "error", "msg": str(e)}), 500

# CẬP NHẬT NHÂN VIÊN (Đồng bộ sang MySQL)
@router.route("/api/employees/<int:emp_id>", methods=["PUT"])
def update_employee(emp_id):
    data = request.get_json()
    
    # === VALIDATION SERVER-SIDE ===
    errors = []
    
    full_name = (data.get("FullName") or "").strip()
    if not full_name:
        errors.append("Họ tên không được để trống.")
    
    phone = data.get("PhoneNumber") or ""
    if not re.match(r'^[0-9]{10,11}$', phone):
        errors.append("Số điện thoại phải là 10-11 chữ số.")
    
    dob = data.get("DateOfBirth")
    if dob:
        try:
            dob_date = datetime.datetime.strptime(dob, "%Y-%m-%d").date()
            if dob_date > datetime.date.today():
                errors.append("Ngày sinh không được lớn hơn ngày hiện tại.")
        except ValueError:
            errors.append("Ngày sinh không hợp lệ.")
    
    hire_date = data.get("HireDate")
    if hire_date:
        try:
            hire_dt = datetime.datetime.strptime(hire_date, "%Y-%m-%d").date()
            if hire_dt > datetime.date.today():
                errors.append("Ngày vào làm không được lớn hơn ngày hiện tại.")
        except ValueError:
            errors.append("Ngày vào làm không hợp lệ.")
    
    email = data.get("Email") or ""
    if email and not re.match(r'^[^\s@]+@[^\s@]+\.[^\s@]+$', email):
        errors.append("Email không hợp lệ.")
    
    if errors:
        return jsonify({"status": "error", "msg": " | ".join(errors)}), 400
    # === END VALIDATION ===

    sql = get_sqlserver_connection()
    my = get_mysql_connection()
    sql.autocommit = False
    my.start_transaction()

    try:
        cur = sql.cursor()

        # Kiểm tra trùng lặp Email và PhoneNumber
        if email:
            cur.execute("SELECT COUNT(*) FROM Employees WHERE Email = ? AND EmployeeID != ?", (email, emp_id))
            if cur.fetchone()[0] > 0:
                return jsonify({"status": "error", "msg": "Email này đã tồn tại trong hệ thống."}), 400
                
        if phone:
            cur.execute("SELECT COUNT(*) FROM Employees WHERE PhoneNumber = ? AND EmployeeID != ?", (phone, emp_id))
            if cur.fetchone()[0] > 0:
                return jsonify({"status": "error", "msg": "Số điện thoại này đã tồn tại trong hệ thống."}), 400

        # Chuyển đổi Status từ English (frontend) sang Vietnamese (SQL Server)
        status_val = data.get("Status", "Active")
        if status_val == "Active":
            sql_status = "Đang làm việc"
        elif status_val == "Inactive":
            sql_status = "Nghỉ việc"
        else:
            sql_status = status_val

        cur = sql.cursor()
        cur.execute("""
            UPDATE Employees 
            SET FullName=?, DateOfBirth=?, Gender=?, PhoneNumber=?, Email=?, HireDate=?, DepartmentID=?, PositionID=?, Status=?
            WHERE EmployeeID=?
        """, (
            full_name,
            data.get("DateOfBirth") or None,
            data.get("Gender"),
            phone,
            email,
            data.get("HireDate") or None,
            data.get("DepartmentID") or None,
            data.get("PositionID") or None,
            sql_status,
            emp_id
        ))

        status_val = data.get("Status", "Active")
        if status_val == "Active":
            my_status = "Đang làm việc"
        elif status_val == "Inactive":
            my_status = "Nghỉ việc"
        else:
            my_status = status_val

        # Đồng bộ sang MySQL
        my_cur = my.cursor()
        my_cur.execute("""
            UPDATE employees_payroll 
            SET FullName=%s, DepartmentID=%s, PositionID=%s, Status=%s
            WHERE EmployeeID=%s
        """, (
            full_name,
            data.get("DepartmentID") or None,
            data.get("PositionID") or None,
            my_status,
            emp_id
        ))

        sql.commit()
        my.commit()
        return jsonify({"status": "success", "msg": "Cập nhật nhân viên thành công!"})
    except Exception as e:
        sql.rollback()
        my.rollback()
        return jsonify({"status": "error", "msg": str(e)}), 500

# XÓA NHÂN VIÊN (Đồng bộ sang MySQL - xóa dữ liệu liên quan trước)
@router.route("/api/employees/<int:emp_id>", methods=["DELETE"])
def delete_employee(emp_id):
    sql = get_sqlserver_connection()
    my = get_mysql_connection()
    sql.autocommit = False
    my.start_transaction()

    try:
        my_cur = my.cursor()
        
        # Xóa các bản ghi liên quan trong bảng salaries và attendance trước (MySQL)
        my_cur.execute("DELETE FROM salaries WHERE EmployeeID = %s", (emp_id,))
        my_cur.execute("DELETE FROM attendance WHERE EmployeeID = %s", (emp_id,))
        
        # Sau đó mới xóa nhân viên bên MySQL
        my_cur.execute("DELETE FROM employees_payroll WHERE EmployeeID = %s", (emp_id,))

        # Xóa bên SQL Server: xóa Dividends (FK constraint) trước, rồi mới xóa Employee
        cur = sql.cursor()
        cur.execute("DELETE FROM Dividends WHERE EmployeeID = ?", (emp_id,))
        cur.execute("DELETE FROM Employees WHERE EmployeeID = ?", (emp_id,))

        sql.commit()
        my.commit()
        return jsonify({"status": "success", "msg": "Xóa nhân viên thành công!"})
    except Exception as e:
        sql.rollback()
        my.rollback()
        return jsonify({"status": "error", "msg": f"Không thể xóa nhân viên: {str(e)}"}), 500

# ==========================================
# API ĐỒNG BỘ DỮ LIỆU (SYNC CLEANUP)
# ==========================================

# ĐỒNG BỘ MySQL VỚI SQL Server - Xóa record mồ côi, thêm record thiếu
@router.route("/api/employees/sync", methods=["POST"])
def sync_employees():
    sql = get_sqlserver_connection()
    my = get_mysql_connection()
    my.start_transaction()
    
    try:
        # 1. Lấy danh sách EmployeeID từ SQL Server (nguồn chính)
        sql_cur = sql.cursor()
        sql_cur.execute("SELECT EmployeeID, FullName, DepartmentID, PositionID, Status FROM Employees")
        sql_employees = {}
        for r in sql_cur.fetchall():
            status_val = r[4] if r[4] else "Active"
            if status_val == "Active":
                my_status = "Đang làm việc"
            elif status_val == "Inactive":
                my_status = "Nghỉ việc"
            else:
                my_status = status_val
            sql_employees[r[0]] = {
                "FullName": r[1],
                "DepartmentID": r[2],
                "PositionID": r[3],
                "Status": my_status
            }
        
        # 2. Lấy danh sách EmployeeID từ MySQL
        my_cur = my.cursor()
        my_cur.execute("SELECT EmployeeID FROM employees_payroll")
        mysql_ids = set()
        for r in my_cur.fetchall():
            mysql_ids.add(r[0])
        
        sql_ids = set(sql_employees.keys())
        
        # 3. Xóa record mồ côi trong MySQL (có trong MySQL nhưng không có trong SQL Server)
        orphan_ids = mysql_ids - sql_ids
        removed_count = 0
        for oid in orphan_ids:
            # Xóa dữ liệu liên quan trước
            my_cur.execute("DELETE FROM salaries WHERE EmployeeID = %s", (oid,))
            my_cur.execute("DELETE FROM attendance WHERE EmployeeID = %s", (oid,))
            my_cur.execute("DELETE FROM employees_payroll WHERE EmployeeID = %s", (oid,))
            removed_count += 1
        
        # 4. Thêm record thiếu trong MySQL (có trong SQL Server nhưng không có trong MySQL)
        missing_ids = sql_ids - mysql_ids
        added_count = 0
        for mid in missing_ids:
            emp = sql_employees[mid]
            my_cur.execute("""
                INSERT INTO employees_payroll (EmployeeID, FullName, DepartmentID, PositionID, Status)
                VALUES (%s, %s, %s, %s, %s)
            """, (mid, emp["FullName"], emp["DepartmentID"], emp["PositionID"], emp["Status"]))
            added_count += 1
        
        # 5. Cập nhật thông tin cho các record đã tồn tại
        existing_ids = sql_ids & mysql_ids
        updated_count = 0
        for eid in existing_ids:
            emp = sql_employees[eid]
            my_cur.execute("""
                UPDATE employees_payroll 
                SET FullName=%s, DepartmentID=%s, PositionID=%s, Status=%s
                WHERE EmployeeID=%s
            """, (emp["FullName"], emp["DepartmentID"], emp["PositionID"], emp["Status"], eid))
            updated_count += 1
        
        my.commit()
        
        msg = f"Đồng bộ thành công! Đã xóa {removed_count} record mồ côi, thêm {added_count} record thiếu, cập nhật {updated_count} record."
        return jsonify({"status": "success", "msg": msg, "removed": removed_count, "added": added_count, "updated": updated_count})
    except Exception as e:
        my.rollback()
        return jsonify({"status": "error", "msg": f"Lỗi đồng bộ: {str(e)}"}), 500

# ==========================================
# API CHO LƯƠNG, CHẤM CÔNG, BÁO CÁO, CẢNH BÁO
# ==========================================

# LẤY DANH SÁCH CHẤM CÔNG
@router.route("/api/attendance", methods=["GET"])
def get_attendance():
    my = get_mysql_connection()
    try:
        cur = my.cursor()
        cur.execute("""
            SELECT a.AttendanceID, a.EmployeeID, a.WorkDays, a.AbsentDays, a.LeaveDays, a.AttendanceMonth,
                   e.FullName, d.DepartmentName
            FROM attendance a
            JOIN employees_payroll e ON a.EmployeeID = e.EmployeeID
            LEFT JOIN departments_payroll d ON e.DepartmentID = d.DepartmentID
            ORDER BY a.AttendanceMonth DESC, e.FullName
        """)
        rows = []
        for r in cur.fetchall():
            rows.append({
                "AttendanceID": r[0],
                "EmployeeID": r[1],
                "WorkDays": r[2],
                "AbsentDays": r[3],
                "LeaveDays": r[4],
                "AttendanceMonth": r[5],
                "FullName": r[6],
                "DepartmentName": r[7] if r[7] else "Chưa có"
            })
        return jsonify(rows)
    except Exception as e:
        return jsonify({"status": "error", "msg": str(e)}), 500

# LẤY BẢNG LƯƠNG
@router.route("/api/salaries", methods=["GET"])
def get_salaries():
    my = get_mysql_connection()
    try:
        cur = my.cursor()
        cur.execute("""
            SELECT s.SalaryID, s.EmployeeID, s.SalaryMonth, s.BaseSalary, s.Bonus, s.Deductions, s.NetSalary,
                   e.FullName, d.DepartmentName
            FROM salaries s
            JOIN employees_payroll e ON s.EmployeeID = e.EmployeeID
            LEFT JOIN departments_payroll d ON e.DepartmentID = d.DepartmentID
            ORDER BY s.SalaryMonth DESC, e.FullName
        """)
        rows = []
        for r in cur.fetchall():
            rows.append({
                "SalaryID": r[0],
                "EmployeeID": r[1],
                "SalaryMonth": r[2],
                "BaseSalary": float(r[3]),
                "Bonus": float(r[4]),
                "Deductions": float(r[5]),
                "NetSalary": float(r[6]),
                "FullName": r[7],
                "DepartmentName": r[8] if r[8] else "Chưa có",
                "Status": "Đã duyệt"
            })
        return jsonify(rows)
    except Exception as e:
        return jsonify({"status": "error", "msg": str(e)}), 500

# LẤY BÁO CÁO
@router.route("/api/reports", methods=["GET"])
def get_reports():
    sql = get_sqlserver_connection()
    my = get_mysql_connection()
    try:
        # 1. Giới tính từ SQL Server
        sql_cur = sql.cursor()
        sql_cur.execute("SELECT Gender, COUNT(*) FROM Employees GROUP BY Gender")
        gender_dist = {}
        for r in sql_cur.fetchall():
            gender = r[0] if r[0] else "Unknown"
            gender_dist[gender] = r[1]
            
        # 2. Chi phí theo phòng ban từ MySQL
        my_cur = my.cursor()
        my_cur.execute("""
            SELECT d.DepartmentName, COUNT(DISTINCT s.EmployeeID) as EmployeeCount,
                   SUM(s.BaseSalary) as TotalBase, SUM(s.Bonus) as TotalBonus, SUM(s.NetSalary) as TotalNet
            FROM salaries s
            JOIN employees_payroll e ON s.EmployeeID = e.EmployeeID
            LEFT JOIN departments_payroll d ON e.DepartmentID = d.DepartmentID
            GROUP BY d.DepartmentName
        """)
        dept_costs = []
        for r in my_cur.fetchall():
            dept_costs.append({
                "DepartmentName": r[0] if r[0] else "Chưa có",
                "EmployeeCount": r[1],
                "TotalBase": float(r[2] or 0),
                "TotalBonus": float(r[3] or 0),
                "TotalNet": float(r[4] or 0)
            })
            
        # 3. Xu hướng quỹ lương 6 tháng
        my_cur.execute("""
            SELECT SalaryMonth, SUM(NetSalary) as TotalSalary
            FROM salaries
            GROUP BY SalaryMonth
            ORDER BY SalaryMonth DESC
            LIMIT 6
        """)
        salary_trend = []
        for r in my_cur.fetchall():
            salary_trend.append({
                "Month": r[0],
                "TotalSalary": float(r[1] or 0)
            })
        salary_trend.reverse() # Sort chronological
        
        return jsonify({
            "gender_distribution": gender_dist,
            "department_costs": dept_costs,
            "salary_trend": salary_trend
        })
    except Exception as e:
        return jsonify({"status": "error", "msg": str(e)}), 500

# LẤY CẢNH BÁO
@router.route("/api/alerts", methods=["GET"])
def get_alerts():
    sql = get_sqlserver_connection()
    my = get_mysql_connection()
    import datetime
    current_month = datetime.datetime.now().month
    
    try:
        # 1. Sinh nhật và kỷ niệm từ SQL Server
        sql_cur = sql.cursor()
        sql_cur.execute(f"SELECT FullName, DateOfBirth, HireDate FROM Employees WHERE MONTH(DateOfBirth) = {current_month} OR MONTH(HireDate) = {current_month}")
        events = []
        for r in sql_cur.fetchall():
            dob = r[1]
            hire = r[2]
            if dob and dob.month == current_month:
                events.append({"type": "birthday", "FullName": r[0], "Date": str(dob)})
            if hire and hire.month == current_month:
                events.append({"type": "anniversary", "FullName": r[0], "Date": str(hire)})
                
        # 2. Nghỉ phép nhiều từ MySQL
        my_cur = my.cursor()
        my_cur.execute("""
            SELECT e.FullName, d.DepartmentName, a.LeaveDays 
            FROM attendance a 
            JOIN employees_payroll e ON a.EmployeeID = e.EmployeeID 
            LEFT JOIN departments_payroll d ON e.DepartmentID = d.DepartmentID 
            WHERE a.LeaveDays > 3
        """)
        leave_alerts = []
        for r in my_cur.fetchall():
            leave_alerts.append({
                "FullName": r[0],
                "DepartmentName": r[1] if r[1] else "Chưa có",
                "LeaveDays": r[2]
            })
            
        return jsonify({
            "events": events,
            "leave_alerts": leave_alerts
        })
    except Exception as e:
        return jsonify({"status": "error", "msg": str(e)}), 500

# ==========================================
# API PHÂN QUYỀN (RBAC) - ACCESS CONTROL DB
# ==========================================
from config import get_access_control_connection

@router.route("/api/security/matrix", methods=["GET"])
def get_security_matrix():
    ac_conn = get_access_control_connection()
    try:
        cur = ac_conn.cursor(dictionary=True)
        # Lấy roles
        cur.execute("SELECT role_id, role_code, role_name FROM roles ORDER BY role_id")
        roles = cur.fetchall()
        
        # Lấy functions
        cur.execute("SELECT function_id, function_code, function_name FROM functions ORDER BY function_id")
        functions = cur.fetchall()
        
        # Lấy ma trận (role_id có function_id nào)
        cur.execute("""
            SELECT DISTINCT rp.role_id, fp.function_id
            FROM role_permissions rp
            JOIN function_permissions fp ON rp.func_perm_id = fp.func_perm_id
        """)
        matrix_rows = cur.fetchall()
        
        return jsonify({
            "roles": roles,
            "functions": functions,
            "matrix": matrix_rows
        })
    except Exception as e:
        return jsonify({"status": "error", "msg": str(e)}), 500

@router.route("/api/security/matrix", methods=["POST"])
def update_security_matrix():
    data = request.json
    changes = data.get("changes", [])
    if not changes:
        return jsonify({"status": "success", "msg": "Không có thay đổi nào."})
        
    ac_conn = get_access_control_connection()
    try:
        cur = ac_conn.cursor(dictionary=True)
        for change in changes:
            role_id = change.get("role_id")
            function_id = change.get("function_id")
            checked = change.get("checked")
            
            # Lấy tất cả func_perm_id của function_id này
            cur.execute("SELECT func_perm_id FROM function_permissions WHERE function_id = %s", (function_id,))
            func_perms = cur.fetchall()
            if not func_perms:
                continue
                
            if checked:
                # Thêm tất cả quyền (nếu chưa có)
                for fp in func_perms:
                    func_perm_id = fp['func_perm_id']
                    cur.execute("INSERT IGNORE INTO role_permissions (role_id, func_perm_id) VALUES (%s, %s)", (role_id, func_perm_id))
            else:
                # Xóa tất cả quyền
                func_perm_ids = [str(fp['func_perm_id']) for fp in func_perms]
                in_clause = ",".join(func_perm_ids)
                if in_clause:
                    cur.execute(f"DELETE FROM role_permissions WHERE role_id = %s AND func_perm_id IN ({in_clause})", (role_id,))
                
        ac_conn.commit()
        return jsonify({"status": "success", "msg": "Cập nhật phân quyền thành công!"})
    except Exception as e:
        return jsonify({"status": "error", "msg": str(e)}), 500

# ==========================================
# API ĐĂNG NHẬP VÀ QUẢN LÝ NGƯỜI DÙNG (ACCESS CONTROL DB)
# ==========================================
@router.route("/api/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    
    if not username or not password:
        return jsonify({"status": "error", "msg": "Vui lòng nhập tài khoản và mật khẩu."}), 400
        
    ac_conn = get_access_control_connection()
    try:
        cur = ac_conn.cursor(dictionary=True)
        # Bỏ qua hash ở môi trường demo này (hoặc có thể so khớp đơn giản)
        # Tra cứu user và role
        cur.execute("""
            SELECT u.user_id, u.username, u.full_name, r.role_id, r.role_code, r.role_name
            FROM users u
            LEFT JOIN user_roles ur ON u.user_id = ur.user_id
            LEFT JOIN roles r ON ur.role_id = r.role_id
            WHERE BINARY u.username = %s AND u.is_active = 1
        """, (username,))
        
        user = cur.fetchone()
        
        if not user or user["username"] != username:
            return jsonify({"status": "error", "msg": "Tài khoản không tồn tại hoặc đã bị khóa!"}), 401
            
        # Lấy danh sách function (quyền) của user
        # Dựa vào role_id, lấy danh sách function_code
        functions = []
        if user["role_id"]:
            cur.execute("""
                SELECT DISTINCT f.function_code
                FROM role_permissions rp
                JOIN function_permissions fp ON rp.func_perm_id = fp.func_perm_id
                JOIN functions f ON fp.function_id = f.function_id
                WHERE rp.role_id = %s
            """, (user["role_id"],))
            functions = [row["function_code"] for row in cur.fetchall()]
            
        return jsonify({
            "status": "success",
            "user": {
                "user_id": user["user_id"],
                "username": user["username"],
                "full_name": user["full_name"],
                "role_id": user["role_id"],
                "role_code": user["role_code"],
                "role_name": user["role_name"],
                "permissions": functions
            }
        })
    except Exception as e:
        return jsonify({"status": "error", "msg": str(e)}), 500

@router.route("/api/security/users", methods=["GET"])
def get_security_users():
    ac_conn = get_access_control_connection()
    try:
        cur = ac_conn.cursor(dictionary=True)
        cur.execute("""
            SELECT u.user_id, u.username, u.full_name, u.email, r.role_id, r.role_code, r.role_name
            FROM users u
            LEFT JOIN user_roles ur ON u.user_id = ur.user_id
            LEFT JOIN roles r ON ur.role_id = r.role_id
            ORDER BY u.user_id
        """)
        users = cur.fetchall()
        return jsonify(users)
    except Exception as e:
        return jsonify({"status": "error", "msg": str(e)}), 500

@router.route("/api/security/assign-role", methods=["POST"])
def assign_user_role():
    data = request.json
    user_id = data.get("user_id")
    role_id = data.get("role_id")
    
    if not user_id or not role_id:
        return jsonify({"status": "error", "msg": "Thiếu thông tin người dùng hoặc vai trò."}), 400
        
    ac_conn = get_access_control_connection()
    try:
        cur = ac_conn.cursor()
        # Xóa role cũ
        cur.execute("DELETE FROM user_roles WHERE user_id = %s", (user_id,))
        # Thêm role mới
        cur.execute("INSERT INTO user_roles (user_id, role_id) VALUES (%s, %s)", (user_id, role_id))
        ac_conn.commit()
        return jsonify({"status": "success", "msg": "Gán vai trò thành công!"})
    except Exception as e:
        return jsonify({"status": "error", "msg": str(e)}), 500