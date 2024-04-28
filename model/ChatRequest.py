from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, ConfigDict

from model.ChatMessage import ChatMessage


class ResponseFormat(str, Enum):
    JSON = "json",
    TEXT = "text",
    XML = "xml",


class ChatRequest(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    endpoint: Optional[str] = None
    model: Optional[str] = None

    messages: List[ChatMessage]

    temperature: Optional[float] = 0.7
    max_tokens: Optional[int] = 256
    n: Optional[int] = None
    seed: Optional[int] = None
    stop: Optional[List[str]] = None
    response_format: ResponseFormat = ResponseFormat.TEXT
    presence_penalty: Optional[float] = None
    frequency_penalty: Optional[float] = None
    stream: Optional[bool] = False
    top_p: Optional[float] = None
    user: Optional[str] = None
    timeout: Optional[int] = 30000

    app: Optional[str] = None
    appServiceName: Optional[str] = None
    category: Optional[str] = None
    batch: Optional[str] = None
