import mysql.connector

conn = mysql.connector.connect(
    host='localhost', user='root', password='123456',
    database='access_control_db'
)
cur = conn.cursor()

# === ACCOUNTANT (role_id=3): SAL_MGT + REP_MGT ===
cur.execute('DELETE FROM role_permissions WHERE role_id = 3')
# SAL_MGT func_perm_id: 5(VIEW),6(ADD),7(EDIT),8(DELETE)
for fp in [5, 6, 7, 8]:
    cur.execute('INSERT IGNORE INTO role_permissions (role_id, func_perm_id) VALUES (3, %s)', (fp,))
# REP_MGT func_perm_id: 13(VIEW)
cur.execute('INSERT IGNORE INTO role_permissions (role_id, func_perm_id) VALUES (3, 13)')

# === HR_MANAGER (role_id=2): EMP_MGT + REP_MGT (khong co SAL_MGT) ===
cur.execute('DELETE FROM role_permissions WHERE role_id = 2')
# EMP_MGT func_perm_id: 1(VIEW),2(ADD),3(EDIT),4(DELETE)
for fp in [1, 2, 3, 4]:
    cur.execute('INSERT IGNORE INTO role_permissions (role_id, func_perm_id) VALUES (2, %s)', (fp,))
# REP_MGT func_perm_id: 13(VIEW)
cur.execute('INSERT IGNORE INTO role_permissions (role_id, func_perm_id) VALUES (2, 13)')

# === STAFF (role_id=4): chi VIEW nhan vien ===
cur.execute('DELETE FROM role_permissions WHERE role_id = 4')
cur.execute('INSERT IGNORE INTO role_permissions (role_id, func_perm_id) VALUES (4, 1)')

conn.commit()
print("Da cap nhat quyen thanh cong!")

# Kiem tra lai
cur2 = conn.cursor(dictionary=True)
cur2.execute("""
    SELECT rp.role_id, r.role_name, f.function_code, f.function_name, p.permission_name
    FROM role_permissions rp
    JOIN function_permissions fp ON rp.func_perm_id = fp.func_perm_id
    JOIN functions f ON fp.function_id = f.function_id
    JOIN permissions p ON fp.permission_id = p.permission_id
    JOIN roles r ON rp.role_id = r.role_id
    ORDER BY rp.role_id, f.function_id
""")
for row in cur2.fetchall():
    print(f"  {row['role_name']:25s} | {row['function_name']:25s} | {row['permission_name']}")
