import sys
sys.stdout.reconfigure(encoding='utf-8')
from config import get_mysql_connection

my = get_mysql_connection()
my_cur = my.cursor()
my_cur.execute("SHOW TABLES")
my_tables = [r[0] for r in my_cur.fetchall()]
print("\nMySQL PAYROLL tables:", my_tables)

for t in my_tables:
    my_cur.execute(f"SELECT COUNT(*) FROM `{t}`")
    cnt = my_cur.fetchall()[0][0]
    my_cur.execute(f"SELECT * FROM `{t}` LIMIT 1")
    res = my_cur.fetchall()
    if my_cur.description:
        cols = [d[0] for d in my_cur.description]
        print(f"\n  `{t}` = {cnt} rows")
        print(f"    Columns: {cols}")
