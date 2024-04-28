import json
from datetime import datetime

from fastapi import HTTPException
from starlette.background import BackgroundTasks

from main import app
from model.ChatRequest import ChatRequest
from model.ChatResponse import ChatResponse
from model.EmbeddingRequest import EmbeddingRequest
from model.EmbeddingResponse import EmbeddingResponse
from service.db_service import dbService
from service.endpoint_service import endpoint_service
from service.provider_service import provider_service


@app.post("/v1/chat/completions")
async def chat(background_tasks: BackgroundTasks, body: ChatRequest) -> ChatResponse:
    endpoint = endpoint_service.get_endpoint_by_id(body.endpoint)
    if endpoint is None:
        provider = provider_service.defaultProvider
        model = body.model
        endpoint_id = None
    else:
        model = endpoint.model
        provider = endpoint.provider
        endpoint_id = endpoint.id

    logPoint = {}

    logPoint['app'] = body.app
    logPoint['service'] = body.appServiceName
    logPoint['category'] = body.category
    logPoint['batch'] = body.batch
    logPoint['user'] = body.user
    logPoint['endpoint_id'] = endpoint_id
    logPoint['provider_id'] = provider.id
    logPoint['provider_type'] = provider.driver.__class__.name
    logPoint['model'] = model
    logPoint['message'] = json.dumps([item.model_dump() for item in body.messages])
    logPoint['temperature'] = body.temperature
    logPoint['max_tokens'] = body.max_tokens
    logPoint['max_tokens'] = body.max_tokens
    logPoint['n'] = body.n
    logPoint['seed'] = body.seed
    logPoint['stop'] = json.dumps(body.stop) if body.stop is not None else None
    logPoint['response_format'] = body.response_format.value
    logPoint['presence_penalty'] = body.presence_penalty
    logPoint['frequency_penalty'] = body.frequency_penalty
    logPoint['stream'] = body.stream
    logPoint['top_p'] = body.top_p
    logPoint['timeout'] = body.timeout
    logPoint['start'] = datetime.now()
    logPoint['exception'] = None
    logPoint['choices'] = None
    logPoint['prompt'] = None
    logPoint['completion'] = None
    logPoint['success'] = True

    try:
        result = provider.driver.chat(message=body.messages,
                                      model=model,
                                      temperature=body.temperature,
                                      max_tokens=body.max_tokens,
                                      n=body.n,
                                      seed=body.seed,
                                      stop=body.stop,
                                      response_format=body.response_format,
                                      presence_penalty=body.presence_penalty,
                                      frequency_penalty=body.frequency_penalty,
                                      stream=body.stream,
                                      top_p=body.top_p,
                                      user=body.user,
                                      timeout=body.timeout,
                                      )
        logPoint['choices'] = json.dumps([item.model_dump() for item in result.choices])
        logPoint['prompt'] = result.usage.prompt_tokens
        logPoint['completion'] = result.usage.completion_tokens
        logPoint['success'] = True
        logPoint['end'] = datetime.now()
        background_tasks.add_task(dbService.logChat, logPoint)
        return result
    except Exception as e:
        logPoint['success'] = False
        logPoint['exception'] = e.args[0]
        logPoint['end'] = datetime.now()
        await dbService.logChat(logPoint)
        raise HTTPException(status_code=500, detail=logPoint['exception'])


@app.post("/v1/embeddings")
async def chat(background_tasks: BackgroundTasks, body: EmbeddingRequest) -> EmbeddingResponse:
    endpoint = endpoint_service.get_endpoint_by_id(body.endpoint)
    if endpoint is None:
        provider = provider_service.defaultProvider
        model = body.model
        endpoint_id = None
    else:
        provider = endpoint.provider
        model = endpoint.model
        endpoint_id = endpoint.id
    try:
        result = provider.driver.embedding(input=body.input, model=model, dimensions=body.dimensions,
                                           encoding_format=body.encoding_format, user=body.user, timeout=body.timeout)
        return result
    except Exception as e:
        return HTTPException(status_code=500, detail=e.args[0])
