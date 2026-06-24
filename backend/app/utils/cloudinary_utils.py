import cloudinary
import cloudinary.uploader
from app.config import settings

# Configure Cloudinary
cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True
)

def upload_image_to_cloudinary(file_content, folder: str = "aura_ecommerce") -> str:
    """
    Uploads a file to Cloudinary and returns the secure URL.
    """
    try:
        response = cloudinary.uploader.upload(file_content, folder=folder)
        return response.get("secure_url")
    except Exception as e:
        print(f"Cloudinary upload error: {e}")
        raise e
