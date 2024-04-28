from typing import Optional, Literal

from pydantic import BaseModel


class EmbeddingRequest(BaseModel):
    endpoint: Optional[str] = None
    model: Optional[str] = None
    input: list[str]
    encoding_format: Literal["float"] = "float"
    dimensions: Optional[int] = None
    user: Optional[str] = None
    timeout: Optional[int] = 5000

    app: Optional[str] = None
    appServiceName: Optional[str] = None
    category: Optional[str] = None
    batch: Optional[str] = None
