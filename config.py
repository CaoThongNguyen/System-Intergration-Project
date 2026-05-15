import pyodbc
import mysql.connector

# ==========================================
# KẾT NỐI SQL SERVER (HUMAN)
# Hàm này tạo kết nối tới DB HUMAN bằng ODBC
# ==========================================
def get_sqlserver_connection():
    try:
        conn = pyodbc.connect(
            "DRIVER={ODBC Driver 17 for SQL Server};"
            "SERVER=localhost;"          # Tên server
            "DATABASE=HUMAN;"            # Tên database Human Resource
            "UID=sa;"                    # Username SQL Server
            "PWD=123456;"                # Password
            "timeout=5"
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
            database="PAYROLL",
            autocommit=False            # REQUIRED cho 2-phase-commit
        )
        return conn
    except Exception as e:
        print("Lỗi kết nối MySQL:", str(e))
        raise