from enum import IntEnum, Enum
from typing import Optional, List

from pydantic import BaseModel, ConfigDict


class ChatRole(str, Enum):
    SYSTEM = "system"
    USER = "user"
    ASSISTANT = "assistant"


class ChatMessage(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    role: ChatRole
    content: str

    def serialize(self) -> dict:
        return self.model_dump()
