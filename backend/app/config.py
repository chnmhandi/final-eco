import os
import urllib.parse
from dotenv import load_dotenv

# Load env file from parent directory
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))

class Settings:
    PROJECT_NAME: str = "AURA E-Commerce API"
    API_V1_STR: str = "/api"
    
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "a6397eab-e3eb-4885-b6f1-f414eff75575")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    CLOUDINARY_CLOUD_NAME: str = os.getenv("CLOUDINARY_CLOUD_NAME", "dbq1w6izr")
    CLOUDINARY_API_KEY: str = os.getenv("CLOUDINARY_API_KEY", "165869378465749")
    CLOUDINARY_API_SECRET: str = os.getenv("CLOUDINARY_API_SECRET", "XrAHQ45HX6QAZ9tB5smRnaawFUM")
    
    RAZORPAY_KEY_ID: str = os.getenv("RAZORPAY_KEY_ID", "rzp_test_T5JtL8Pdk3WEcJ")
    RAZORPAY_KEY_SECRET: str = os.getenv("RAZORPAY_KEY_SECRET", "RF3wFOu3Mz2mTxwusF459VWv")
    
    RESEND_API_KEY: str = os.getenv("RESEND_API_KEY", "re_Q6zHoKzE_PK7jm8nKrR7iS1GKc3gg6L1v")
    FROM_EMAIL: str = os.getenv("FROM_EMAIL", "onboarding@resend.dev")
    
    RAW_DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:Chinmay@31handi@db.wahtdkceafdhuyrfceub.supabase.co:5432/postgres")
    
    @property
    def DATABASE_URL(self) -> str:
        # Encode password if it contains special characters like '@'
        url = self.RAW_DATABASE_URL
        if url.startswith("postgresql://"):
            content = url[13:]
            try:
                cred, host = content.rsplit("@", 1)
                if ":" in cred:
                    username, password = cred.split(":", 1)
                    # Use quote_plus to handle '@' and other special characters
                    encoded_password = urllib.parse.quote_plus(password)
                    return f"postgresql://{username}:{encoded_password}@{host}"
            except Exception:
                pass
        return url

settings = Settings()
