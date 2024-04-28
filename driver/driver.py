from typing import List, Optional, Literal

from model.ChatMessage import ChatMessage
from model.ChatRequest import ResponseFormat
from model.EmbeddingResponse import EmbeddingResponse


class Driver:
    name: str = ""

    def __init__(self):
        self.name = Driver.name

    def chat(self,
             message: List[ChatMessage],
             model: str,
             temperature: Optional[float],
             max_tokens: Optional[int],
             n: Optional[int],
             seed: Optional[int],
             stop: Optional[str] | Optional[List[str]],
             response_format: ResponseFormat,
             presence_penalty: Optional[float],
             frequency_penalty: Optional[float],
             stream: Optional[bool],
             top_p: Optional[float],
             user: Optional[str],
             timeout: Optional[int], ):
        pass

    def embedding(self, input: str | List[str], model: str, dimensions: int | None,
                  encoding_format: Literal["float", "base64"] | None, user: str | None,
                  timeout: int) -> EmbeddingResponse:
        pass
