import psycopg2
import sys

def init_database():
    # Database connection parameters
    host = "db.wahtdkceafdhuyrfceub.supabase.co"
    port = 5432
    database = "postgres"
    user = "postgres"
    password = "Chinmay@31handi"

    print("Connecting to Supabase PostgreSQL database...")
    try:
        conn = psycopg2.connect(
            host=host,
            port=port,
            database=database,
            user=user,
            password=password
        )
        conn.autocommit = True
        cursor = conn.cursor()
        print("Connected successfully. Reading schema.sql...")

        with open("schema.sql", "r") as f:
            schema_sql = f.read()

        print("Executing schema.sql...")
        cursor.execute(schema_sql)
        print("Schema initialized successfully!")

        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Error initializing database: {e}")
        sys.exit(1)

if __name__ == "__main__":
    init_database()
