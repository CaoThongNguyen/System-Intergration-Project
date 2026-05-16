from flask import Blueprint, jsonify, request
from config import get_sqlserver_connection, get_mysql_connection

# Khởi tạo đối tượng Blueprint
router = Blueprint("router", __name__)

# ==========================================
# 6. API CRUD CHO PHÒNG BAN (DEPARTMENTS)
# ==========================================

# THÊM PHÒNG BAN MỚI (Đồng bộ sang MySQL)
@router.route("/api/departments", methods=["POST"])
def add_department():
    data = request.get_json()
    dept_name = data.get("DepartmentName")
    
    sql = get_sqlserver_connection()
    my = get_mysql_connection()
    sql.autocommit = False
    my.start_transaction()

    try:
        cur = sql.cursor()
        # Insert vào SQL Server và lấy ra ID tự tăng vừa tạo
        cur.execute("""
            INSERT INTO Departments (DepartmentName) 
            OUTPUT INSERTED.DepartmentID 
            VALUES (?)
        """, (dept_name,))
        new_dept_id = int(cur.fetchone()[0])

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
    dept_name = data.get("DepartmentName")
    
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
# 7. API CRUD CHO VỊ TRÍ (POSITIONS)
# ==========================================

# THÊM VỊ TRÍ (Đồng bộ sang MySQL)
@router.route("/api/positions", methods=["POST"])
def add_position():
    data = request.get_json()
    pos_name = data.get("PositionName")
    
    sql = get_sqlserver_connection()
    my = get_mysql_connection()
    sql.autocommit = False
    my.start_transaction()

    try:
        cur = sql.cursor()
        cur.execute("""
            INSERT INTO Positions (PositionName) 
            OUTPUT INSERTED.PositionID 
            VALUES (?)
        """, (pos_name,))
        new_pos_id = int(cur.fetchone()[0])

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
    pos_name = data.get("PositionName")
    
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
# API LẤY DANH SÁCH NHÂN VIÊN
# ==========================================
@router.route("/api/employees", methods=["GET"])
def get_employees():
    sql = get_sqlserver_connection()
    try:
        cur = sql.cursor()
        # Lấy dữ liệu nhân viên kèm tên phòng ban và chức vụ
        cur.execute("""
            SELECT e.EmployeeID, e.FullName, d.DepartmentName, p.PositionName
            FROM Employees e
            LEFT JOIN Departments d ON e.DepartmentID = d.DepartmentID
            LEFT JOIN Positions p ON e.PositionID = p.PositionID
            ORDER BY e.EmployeeID
        """)
        
        rows = []
        for r in cur.fetchall():
            rows.append({
                "EmployeeID": r[0],
                "FullName": r[1],
                "Department": r[2] if r[2] else "Chưa có",
                "Position": r[3] if r[3] else "Chưa có"
            })
            
        return jsonify(rows)
    except Exception as e:
        return jsonify({"status": "error", "msg": str(e)}), 500