from pydantic import BaseModel


class ChatRequest(BaseModel):
    question: str
    tenant_id: str = "default"


class ChatResponse(BaseModel):
    answer: str
    tenant_id: str