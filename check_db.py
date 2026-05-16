import sys
sys.stdout.reconfigure(encoding='utf-8')
from config import get_sqlserver_connection

sql = get_sqlserver_connection()
cur = sql.cursor()
cur.execute("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE='BASE TABLE' ORDER BY TABLE_NAME")
tables = [r[0] for r in cur.fetchall()]
print("SQL Server HUMAN_2025 tables:", tables)

for t in tables:
    cur.execute(f"SELECT COUNT(*) FROM [{t}]")
    cnt = cur.fetchone()[0]
    cur.execute(f"SELECT TOP 1 * FROM [{t}]")
    cols = [d[0] for d in cur.description]
    print(f"\n  [{t}] = {cnt} rows")
    print(f"    Columns: {cols}")
