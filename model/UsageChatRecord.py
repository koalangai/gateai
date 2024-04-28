import datetime
from typing import Optional, List

from pydantic import BaseModel


class UsageChatRecord(BaseModel):
    app: Optional[str]
    service: Optional[str]
    category: Optional[str]
    batch: Optional[str]
    user: Optional[str]
    endpoint_id: Optional[str]
    provider_id: Optional[str]
    provider_type: Optional[str]
    model: Optional[str]
    message: Optional[str]
    temperature: Optional[float]
    max_tokens: Optional[int]
    n: Optional[int]
    seed: Optional[int]
    stop: Optional[str]
    response_format: Optional[str]
    presence_penalty: Optional[float]
    frequency_penalty: Optional[float]
    stream: Optional[bool]
    top_p: Optional[float]
    timeout: Optional[int]
    start: datetime.datetime
    choices: Optional[str]
    prompt: Optional[int]
    completion: Optional[int]
    end: datetime.datetime
    success: Optional[bool]
    exception: Optional[str]
