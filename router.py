from flask import Blueprint, jsonify, request
from config import get_sqlserver_connection, get_mysql_connection

# Khởi tạo đối tượng Blueprint
router = Blueprint("router", __name__)
# ==========================================
# 6. API CRUD CHO PHÒNG BAN (DEPARTMENTS)
# ==========================================

# THÊM PHÒNG BAN MỚI
@router.route("/api/departments", methods=["POST"])
def add_department():
    data = request.get_json()
    dept_name = data.get("DepartmentName")
    
    sql = get_sqlserver_connection()
    try:
        cur = sql.cursor()
        cur.execute("INSERT INTO Departments (DepartmentName) VALUES (?)", (dept_name,))
        sql.commit()
        return jsonify({"status": "success", "msg": "Thêm phòng ban thành công!"})
    except Exception as e:
        sql.rollback()
        return jsonify({"status": "error", "msg": str(e)}), 500

# CẬP NHẬT PHÒNG BAN
@router.route("/api/departments/<int:dept_id>", methods=["PUT"])
def update_department(dept_id):
    data = request.get_json()
    dept_name = data.get("DepartmentName")
    
    sql = get_sqlserver_connection()
    try:
        cur = sql.cursor()
        cur.execute("UPDATE Departments SET DepartmentName = ? WHERE DepartmentID = ?", (dept_name, dept_id))
        sql.commit()
        return jsonify({"status": "success", "msg": "Cập nhật thành công!"})
    except Exception as e:
        sql.rollback()
        return jsonify({"status": "error", "msg": str(e)}), 500

# XÓA PHÒNG BAN
@router.route("/api/departments/<int:dept_id>", methods=["DELETE"])
def delete_department(dept_id):
    sql = get_sqlserver_connection()
    try:
        cur = sql.cursor()
        # Lưu ý: Cần kiểm tra xem phòng ban có nhân viên không trước khi xóa
        cur.execute("SELECT COUNT(*) FROM Employees WHERE DepartmentID = ?", (dept_id,))
        if cur.fetchone()[0] > 0:
            return jsonify({"status": "error", "msg": "Không thể xóa vì phòng ban đang có nhân viên!"}), 400
            
        cur.execute("DELETE FROM Departments WHERE DepartmentID = ?", (dept_id,))
        sql.commit()
        return jsonify({"status": "success", "msg": "Xóa phòng ban thành công!"})
    except Exception as e:
        sql.rollback()
        return jsonify({"status": "error", "msg": str(e)}), 500


# ==========================================
# 7. API CRUD CHO VỊ TRÍ (POSITIONS)
# ==========================================

# THÊM VỊ TRÍ
@router.route("/api/positions", methods=["POST"])
def add_position():
    data = request.get_json()
    pos_name = data.get("PositionName")
    
    sql = get_sqlserver_connection()
    try:
        cur = sql.cursor()
        cur.execute("INSERT INTO Positions (PositionName) VALUES (?)", (pos_name,))
        sql.commit()
        return jsonify({"status": "success", "msg": "Thêm vị trí thành công!"})
    except Exception as e:
        sql.rollback()
        return jsonify({"status": "error", "msg": str(e)}), 500

# CẬP NHẬT VỊ TRÍ
@router.route("/api/positions/<int:pos_id>", methods=["PUT"])
def update_position(pos_id):
    data = request.get_json()
    pos_name = data.get("PositionName")
    
    sql = get_sqlserver_connection()
    try:
        cur = sql.cursor()
        cur.execute("UPDATE Positions SET PositionName = ? WHERE PositionID = ?", (pos_name, pos_id))
        sql.commit()
        return jsonify({"status": "success", "msg": "Cập nhật thành công!"})
    except Exception as e:
        sql.rollback()
        return jsonify({"status": "error", "msg": str(e)}), 500

# XÓA VỊ TRÍ
@router.route("/api/positions/<int:pos_id>", methods=["DELETE"])
def delete_position(pos_id):
    sql = get_sqlserver_connection()
    try:
        cur = sql.cursor()
        # Kiểm tra xem chức vụ có nhân viên không trước khi xóa
        cur.execute("SELECT COUNT(*) FROM Employees WHERE PositionID = ?", (pos_id,))
        if cur.fetchone()[0] > 0:
            return jsonify({"status": "error", "msg": "Không thể xóa vì vị trí đang được sử dụng!"}), 400
            
        cur.execute("DELETE FROM Positions WHERE PositionID = ?", (pos_id,))
        sql.commit()
        return jsonify({"status": "success", "msg": "Xóa vị trí thành công!"})
    except Exception as e:
        sql.rollback()
        return jsonify({"status": "error", "msg": str(e)}), 500