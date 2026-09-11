from sqlalchemy import text

from database import engine


try:
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        print("Database connection successful!")
        print(result.fetchone())

except Exception as error:
    print("Database connection failed:")
    print(error)
