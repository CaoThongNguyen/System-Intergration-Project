from flask import Flask
from router import router
from flask_cors import CORS

app = Flask(__name__)
# Bật CORS để cho phép giao diện React (cổng 3000) gọi được API từ Flask (cổng 5000)
CORS(app) 

# Đăng ký toàn bộ các API (như /api/employees, /api/departments...) đã viết trong router.py
app.register_blueprint(router)

if __name__ == "__main__":
    app.run(debug=True) 