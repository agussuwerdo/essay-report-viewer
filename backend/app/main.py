from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import models, database
from pydantic import BaseModel
from typing import List, Optional
import json
from datetime import datetime

# Ensure all tables are created
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(
    title="Essay Report Viewer API",
    description="API for managing essay reports and comments",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

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

class Annotation(BaseModel):
    end: int
    text: str
    error: str
    start: int
    suggestion: str
    explanation: str

    class Config:
        schema_extra = {
            "example": {
                "end": 168,
                "text": "was",
                "error": "subject-verb agreement",
                "start": 165,
                "suggestion": "were",
                "explanation": "The subject 'streets' is plural, so the verb should also be in plural form."
            }
        }

class EssayFeedback(BaseModel):
    essay: str
    annotations: List[List[Annotation]]

    class Config:
        schema_extra = {
            "example": {
                "essay": "The people gathered around a poor little boy...",
                "annotations": [
                    [
                        {
                            "end": 168,
                            "text": "was",
                            "error": "subject-verb agreement",
                            "start": 165,
                            "suggestion": "were",
                            "explanation": "The subject 'streets' is plural, so the verb should also be in plural form."
                        }
                    ]
                ]
            }
        }

class CommentCreate(BaseModel):
    content: str

    class Config:
        schema_extra = {
            "example": {
                "content": "This is a great essay!"
            }
        }

class Comment(BaseModel):
    id: int
    content: str
    created_at: datetime

    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

@app.get("/api/essay", 
    response_model=EssayFeedback,
    tags=["Essay"],
    summary="Get essay data",
    description="Retrieves the essay data including the essay text and annotations with feedback"
)
async def get_essay():
    return essay_data

@app.post("/api/comments", 
    response_model=Comment,
    tags=["Comments"],
    summary="Create a new comment",
    description="Creates a new comment for the essay"
)
async def create_comment(comment: CommentCreate, db: Session = Depends(database.get_db)):
    db_comment = models.Comment(content=comment.content)
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

@app.get("/api/comments", 
    response_model=List[Comment],
    tags=["Comments"],
    summary="Get all comments",
    description="Retrieves all comments for the essay, ordered by creation date"
)
async def get_comments(db: Session = Depends(database.get_db)):
    comments = db.query(models.Comment).order_by(models.Comment.created_at.desc()).all()
    return comments 