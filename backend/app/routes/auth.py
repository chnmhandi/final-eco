from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import User, Profile
from app.schemas.schemas import UserSignUp, UserLogin, Token, ProfileResponse, ProfileUpdate
from app.services import auth_service
from app.services.auth_service import get_current_user
from datetime import datetime

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/signup", response_model=Token)
def signup(user_data: UserSignUp, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists."
        )

    # Determine if it should be an admin (e.g. first user or email domain aura.design / custom)
    role = "user"
    if user_data.email.endswith("@aura.design"):
         role = "admin"

    # Create new user
    new_user = User(
        email=user_data.email,
        password_hash=auth_service.get_password_hash(user_data.password),
        role=role
    )
    db.add(new_user)
    db.flush()  # get the ID

    # Create user profile
    new_profile = Profile(
        id=new_user.id,
        email=user_data.email,
        full_name=user_data.full_name,
        member_since=datetime.utcnow()
    )
    db.add(new_profile)
    db.commit()
    db.refresh(new_user)

    # Generate token
    token_data = {"sub": str(new_user.id), "email": new_user.email, "role": new_user.role}
    access_token = auth_service.create_access_token(data=token_data)
    
    return {"access_token": access_token, "token_type": "bearer", "role": new_user.role}

@router.post("/login", response_model=Token)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user or not auth_service.verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )

    # Generate token
    token_data = {"sub": str(user.id), "email": user.email, "role": user.role}
    access_token = auth_service.create_access_token(data=token_data)
    
    return {"access_token": access_token, "token_type": "bearer", "role": user.role}

@router.get("/profile", response_model=ProfileResponse)
def get_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found.")
    return profile

@router.put("/profile", response_model=ProfileResponse)
def update_profile(
    profile_data: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(Profile).filter(Profile.id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found.")
        
    for key, value in profile_data.dict(exclude_unset=True).items():
        setattr(profile, key, value)
        
    profile.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(profile)
    return profile
