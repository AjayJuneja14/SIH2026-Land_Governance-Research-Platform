from fastapi import APIRouter
from backend.app.models import ChatRequest, ChatResponse
from backend.app.services.rag_engine import process_chat_query

router = APIRouter(prefix="/api/chat", tags=["AI Chatbot"])

@router.post("/query", response_model=ChatResponse)
def chat_query(request: ChatRequest) -> ChatResponse:
    return process_chat_query(request)
