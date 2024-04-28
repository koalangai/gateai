from pydantic import BaseModel


class EmbeddingUsage(BaseModel):
    prompt_tokens: int
    total_tokens: int
