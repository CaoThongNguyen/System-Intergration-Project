from flask import Flask, render_template
from router import router              # Import các API
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.register_blueprint(router)         # Đăng ký router chứa API

# ==========================================
# TRANG DANH SÁCH NHÂN VIÊN
# ==========================================
@app.route("/")
def index():
    return render_template("employees.html")

# ==========================================
# TRANG THÊM NHÂN VIÊN
# ==========================================
@app.route("/employees/add")
def employees_add_page():
    return render_template("employee_add.html")

# ==========================================
# TRANG CHỈNH SỬA (TRUYỀN ID)
# ==========================================
@app.route("/employees/<int:emp_id>")
def employee_edit_page(emp_id):
    return render_template("employee_edit.html", emp_id=emp_id)

if __name__ == "__main__":
    app.run(debug=True)