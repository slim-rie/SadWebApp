import pymysql
from ..config import Config

def update_database():
    # Connect to the database
    connection = pymysql.connect(
        host=Config.MYSQL_HOST,
        user=Config.MYSQL_USER,
        password=Config.MYSQL_PASSWORD,
        database=Config.MYSQL_DB
    )
    
    try:
        with connection.cursor() as cursor:
            # Add phone_number column
            cursor.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20) AFTER profile_image")
            connection.commit()
            print("Successfully added phone_number column to users table")
    except Exception as e:
        print(f"Error updating database: {str(e)}")
    finally:
        connection.close()

if __name__ == '__main__':
    update_database() 