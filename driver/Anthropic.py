import time
from typing import List, Optional, Literal

from anthropic import Anthropic as Client, NOT_GIVEN
from anthropic.types import MessageParam, TextBlock

from driver.driver import Driver
from model.ChatMessage import ChatMessage, ChatRole
from model.ChatRequest import ResponseFormat
from model.ChatResponse import ChatResponse, Choice, FinishReason, Usage


class Anthropic(Driver):
    params_api_key: str
    client: Client
    name = "Anthropic"

    def __init__(self, api_key: str):
        super().__init__()
        self.params_api_key = api_key
        self.client = Client(api_key=api_key)

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
             timeout: Optional[int]):
        system = next(iter([item.content for item in message if item.role == ChatRole.SYSTEM]), NOT_GIVEN)
        messages = [self.messageConvert(item) for item in message if item.role != ChatRole.SYSTEM]
        if response_format == ResponseFormat.JSON:
            messages.append(self.messageConvert(ChatMessage(content="{", role=ChatRole.ASSISTANT)))
        elif response_format == ResponseFormat.XML:
            messages.append(self.messageConvert(ChatMessage(content="[", role=ChatRole.ASSISTANT)))
        create = int(time.time())
        try:
            resp = self.client.messages.create(
                max_tokens=max_tokens,
                messages=messages,
                model=model,
                temperature=float(temperature) if temperature is not None else 0.7,
                stop_sequences=stop,
                stream=bool(stream) if stream is not None else False,
                system=system,
                top_p=float(top_p) if top_p is not None else NOT_GIVEN,
                timeout=timeout
            )
            result = ChatResponse(id=resp.id,
                                  choices=[Choice(finish_reason=self.finishReasonConvert(resp.stop_reason), index=idx,
                                                  message=self.compMessageConvert(item, response_format)) for idx, item
                                           in
                                           enumerate(resp.content)],
                                  created=create,
                                  model=model,
                                  usage=Usage(
                                      completion_tokens=resp.usage.output_tokens,
                                      prompt_tokens=resp.usage.input_tokens,
                                      total_tokens=resp.usage.output_tokens + resp.usage.input_tokens
                                  )
                                  )
            return result
        except Exception as e:
            raise e

    def messageConvert(self, message: ChatMessage) -> MessageParam:
        return MessageParam(content=message.content, role=message.role.value)

    def finishReasonConvert(self, reason: Optional[Literal["end_turn", "max_tokens", "stop_sequence"]]) -> Optional[
        FinishReason]:
        if reason is None:
            return None
        elif reason == "end_turn":
            return FinishReason.stop
        elif reason == "max_tokens":
            return FinishReason.length
        elif reason == "stop_sequence":
            return FinishReason.stop

    def compMessageConvert(self, message: TextBlock, response_format: ResponseFormat) -> ChatMessage:
        content = message.text
        if response_format == ResponseFormat.XML:
            content = "<" + content
        elif response_format == ResponseFormat.JSON:
            content = "{" + content
        return ChatMessage(content=content, role=ChatRole.ASSISTANT)
