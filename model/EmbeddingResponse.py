from typing import List

from pydantic import BaseModel

from model.EmbeddingUsage import EmbeddingUsage


class EmbeddingData(BaseModel):
    object: str
    embedding: List[float]
    index: int


class EmbeddingResponse(BaseModel):
    object: str
    model: str
    data: List[EmbeddingData]
    usage: EmbeddingUsage
