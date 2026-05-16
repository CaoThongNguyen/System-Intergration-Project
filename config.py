import pyodbc
import mysql.connector

# ==========================================
# KẾT NỐI SQL SERVER (HUMAN)
# Hàm này tạo kết nối tới DB HUMAN_2025 bằng ODBC
# ==========================================
def get_sqlserver_connection():
    try:
        conn = pyodbc.connect(
            "DRIVER={ODBC Driver 17 for SQL Server};"
            "SERVER=localhost\\SQLEXPRESS;"  # Giữ nguyên instance SQLEXPRESS của máy bạn
            "DATABASE=HUMAN_2025;"           # Đã cập nhật theo SSMS mới
            "UID=sa;"                    
            "PWD=123456;",               
            timeout=5
        )
        return conn
    except Exception as e:
        print("Lỗi kết nối SQL Server:", str(e))
        raise

# ==========================================
# KẾT NỐI MYSQL (PAYROLL)
# Dùng mysql.connector với autocommit = False
# ==========================================
def get_mysql_connection():
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="123456",
            database="PAYROLL",              # Đã cập nhật theo Navicat mới
            autocommit=False             
        )
        return conn
    except Exception as e:
        print("Lỗi kết nối MySQL:", str(e))
        raise