from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
import uuid
from datetime import datetime

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="Dhyey Portfolio API")
api_router = APIRouter(prefix="/api")


class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class StatusCheckCreate(BaseModel):
    client_name: str


class ContactMessageCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    email: EmailStr
    subject: Optional[str] = Field(default="", max_length=200)
    message: str = Field(..., min_length=1, max_length=5000)


class ContactMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    subject: Optional[str] = ""
    message: str
    created_at: datetime = Field(default_factory=datetime.utcnow)


@api_router.get("/")
async def root():
    return {"message": "Hello World"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.dict())
    await db.status_checks.insert_one(status_obj.dict())
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    docs = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**d) for d in docs]


@api_router.post("/contact", status_code=201)
async def create_contact_message(payload: ContactMessageCreate):
    try:
        msg = ContactMessage(**payload.dict())
        doc = msg.dict()
        # store created_at as ISO string for consistency
        doc_to_store = {**doc, "created_at": doc["created_at"].isoformat()}
        await db.contact_messages.insert_one(doc_to_store)
        return {
            "id": msg.id,
            "status": "received",
            "created_at": doc_to_store["created_at"],
        }
    except Exception as e:
        logger.exception("Failed to save contact message")
        raise HTTPException(status_code=500, detail="Unable to save message. Please try again.") from e


@api_router.get("/contact")
async def list_contact_messages(limit: int = 100):
    docs = await db.contact_messages.find().sort("created_at", -1).to_list(limit)
    for d in docs:
        d.pop("_id", None)
    return {"count": len(docs), "messages": docs}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
