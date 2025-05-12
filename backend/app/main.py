from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import models, database
from pydantic import BaseModel
from typing import List
import json

# Ensure all tables are created
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load essay data
with open("essay_feedback.json", "r") as f:
    essay_data = json.load(f)

class CommentCreate(BaseModel):
    content: str

class Comment(BaseModel):
    id: int
    content: str
    created_at: str

    class Config:
        from_attributes = True

@app.get("/api/essay")
async def get_essay():
    return essay_data

@app.post("/api/comments", response_model=Comment)
async def create_comment(comment: CommentCreate, db: Session = Depends(database.get_db)):
    db_comment = models.Comment(content=comment.content)
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

@app.get("/api/comments", response_model=List[Comment])
async def get_comments(db: Session = Depends(database.get_db)):
    comments = db.query(models.Comment).order_by(models.Comment.created_at.desc()).all()
    return comments 