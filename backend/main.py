from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import SessionLocal, engine, Base
from models import User
from schemas import UserCreate, UserUpdate, UserResponse

Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database Connection
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Home Route
@app.get("/")
def home():
    return {
        "message": "User Management Backend Running Successfully"
    }

# Default Startup Data
@app.on_event("startup")
def startup_data():
    db = SessionLocal()

    if db.query(User).count() == 0:
        users = [
            User(
                name="Sharath",
                email="sharath@example.com",
                role="Frontend Developer",
                company="Tech Solutions",
                bio="Passionate React Developer"
            ),
            User(
                name="Rahul",
                email="rahul@example.com",
                role="Backend Developer",
                company="CodeCraft",
                bio="FastAPI Expert"
            ),
            User(
                name="Anjali",
                email="anjali@example.com",
                role="UI/UX Designer",
                company="Creative Studio",
                bio="Design Enthusiast"
            ),
        ]

        db.add_all(users)
        db.commit()

    db.close()

# Get All Users
@app.get("/users", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()

# Get Single User
@app.get("/users/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user

# Create User
@app.post("/users", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    new_user = User(**user.model_dump())

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

# Update User
@app.put("/users/{user_id}", response_model=UserResponse)
def update_user(
    user_id: int,
    updated_user: UserUpdate,
    db: Session = Depends(get_db)
):
    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    for key, value in updated_user.model_dump().items():
        setattr(user, key, value)

    db.commit()
    db.refresh(user)

    return user

# Delete User
@app.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    db.delete(user)
    db.commit()

    return {
        "message": "User deleted successfully"
    }