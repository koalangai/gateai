from enum import Enum
from typing import List, Optional

from pydantic import BaseModel

from model.ChatMessage import ChatMessage


class FinishReason(str, Enum):
    stop = "stop"
    length = "length"
    tool_calls = "tool_calls"
    content_filter = "content_filter"
    function_call = "function_call"


class Choice(BaseModel):
    finish_reason: FinishReason
    index: int
    message: ChatMessage


class Usage(BaseModel):
    completion_tokens: int
    prompt_tokens: int
    total_tokens: int


class ChatResponse(BaseModel):
    id: str
    choices: List[Choice]
    created: int
    model: str
    system_fingerprint: Optional[str] = None
    object: Optional[str] = None
    usage: Usage
