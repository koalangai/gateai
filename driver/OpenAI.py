from typing import List, Optional, Literal

import openai.types.chat.completion_create_params
from openai import OpenAI as Client, NOT_GIVEN
from openai.types.chat import ChatCompletionUserMessageParam, ChatCompletionAssistantMessageParam, \
    ChatCompletionSystemMessageParam, ChatCompletionMessageParam, ChatCompletionMessage

from driver.driver import Driver
from model.ChatMessage import ChatMessage, ChatRole
from model.ChatRequest import ResponseFormat
from model.ChatResponse import ChatResponse, Choice, FinishReason, Usage
from model.EmbeddingResponse import EmbeddingResponse, EmbeddingData
from model.EmbeddingUsage import EmbeddingUsage


class OpenAI(Driver):
    params_api_key: str
    client: Client
    name = "OpenAI"

    def __init__(self, api_key: str):
        super().__init__()
        self.params_api_key = api_key
        self.client = Client(api_key=self.params_api_key)

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
             timeout: Optional[int],
             ):
        try:
            resp = self.client.chat.completions.create(messages=[self.messageConvert(item) for item in message],
                                                       model=model,
                                                       frequency_penalty=frequency_penalty,
                                                       max_tokens=max_tokens,
                                                       n=n,
                                                       presence_penalty=presence_penalty,
                                                       response_format=self.responseFormatConvert(response_format),
                                                       seed=seed,
                                                       stop=stop,
                                                       stream=stream,
                                                       temperature=temperature,
                                                       top_p=top_p,
                                                       user=user,
                                                       timeout=timeout)
            result = ChatResponse(
                id=resp.id,
                choices=[Choice(finish_reason=FinishReason[resp.choices[0].finish_reason], index=item.index,
                                message=self.messageConvert(item.message)) for item in resp.choices],
                created=resp.created,
                model=resp.model,
                system_fingerprint=resp.system_fingerprint,
                object=resp.object,
                usage=Usage(
                    completion_tokens=resp.usage.completion_tokens,
                    prompt_tokens=resp.usage.prompt_tokens,
                    total_tokens=resp.usage.total_tokens,
                )
            )
            return result
        except Exception as e:
            raise e

    def embedding(self, input: str | List[str], model: str, dimensions: int | None,
                  encoding_format: Literal["float", "base64"] | None, user: str | None,
                  timeout: int) -> EmbeddingResponse:
        resp = self.client.embeddings.create(input=input, model=model,
                                             dimensions=dimensions if dimensions is not None else NOT_GIVEN,
                                             encoding_format=encoding_format if encoding_format is not None else NOT_GIVEN,
                                             user=user if user is not None else NOT_GIVEN, timeout=timeout)
        return EmbeddingResponse(object="list", model=resp.model,
                                 usage=EmbeddingUsage(prompt_tokens=resp.usage.prompt_tokens,
                                                      total_tokens=resp.usage.total_tokens),
                                 data=[EmbeddingData(object=item.object, index=item.index, embedding=item.embedding) for
                                       item in resp.data])

    def messageConvert(self, message: ChatMessage) -> ChatCompletionMessageParam:
        if message.role == ChatRole.USER:
            return ChatCompletionUserMessageParam(content=message.content, role='user')
        elif message.role == ChatRole.ASSISTANT:
            return ChatCompletionAssistantMessageParam(content=message.content, role='assistant')
        elif message.role == ChatRole.SYSTEM:
            return ChatCompletionSystemMessageParam(content=message.content, role='system')
        else:
            raise Exception(f"Unexpected chat role {message.role}")

    def responseFormatConvert(self,
                              format: ResponseFormat) -> openai.types.chat.completion_create_params.ResponseFormat:
        if format == ResponseFormat.JSON:
            return {'type': 'json_object'}
        elif format == ResponseFormat.TEXT:
            return {'type': 'text'}
        else:
            raise Exception(f"Unexpected response format {format} in OpenAI")

    def compMessageConvert(self, message: ChatCompletionMessage) -> ChatMessage:
        if message.role == ChatRole.ASSISTANT.value:
            return ChatMessage(content=message.content, role=ChatRole.ASSISTANT)
