import datetime
import re
from typing import Optional, List

from main import app
from model.UsageChatRecord import UsageChatRecord
from model.backend_type import BackendType
from service.db_service import dbService


@app.get("/usage/{type}")
async def usage(type: BackendType, start: datetime.datetime, end: datetime.datetime,
                query: str | None = None) -> List[UsageChatRecord]:
    filterSQL = '1=1 and '
    if query is not None:
        queries = query.split("&")
        for q in queries:
            fields = ['app', 'service', 'category', 'batch', 'user', 'service_id', 'provider_id', 'provider_type',
                      'model']
            for f in fields:
                if q.startswith(f'{f} in ['):
                    values = ["'" + item.trim() + "'" for item in
                              re.findall('(?<=\\[)[a-zA-Z0-9, ]+(?=\\])', q)[0].split(',')]
                    filterSQL += f'{f} in [{",".join(values)}] and '
                elif q.startswith(f'{f} ='):
                    value = re.findall('(?<=\\= )[a-zA-Z0-9]+', q)[0]
                    filterSQL += f"{f} = '{value}' and "
                elif q == f"{f} is null":
                    filterSQL += f"{f} is null and "
    data = await dbService.query(
        f"select * from gateai.{type.value} where {filterSQL} start between '{start}' and '{end}'")
    if type == BackendType.CHAT:
        return [UsageChatRecord.model_validate(item) for item in data]


@app.get("/usage/applications/{type}")
async def getApplications(type: BackendType, start: datetime.datetime, end: datetime.datetime) -> List[str]:
    data = await dbService.query(
        f"select distinct app from gateai.{type.value} where start between '{start}' and '{end}'")
    return [item['app'] for item in data if item['app'] is not None]


@app.get("/usage/services/{type}")
async def getServices(type: BackendType, start: datetime.datetime, end: datetime.datetime) -> List[str]:
    data = await dbService.query(
        f"select distinct service from gateai.{type.value} where start between '{start}' and '{end}'")
    return [item['service'] for item in data if item['service'] is not None]


@app.get("/usage/categories/{type}")
async def getCategories(type: BackendType, start: datetime.datetime, end: datetime.datetime) -> List[str]:
    data = await dbService.query(
        f"select distinct category from gateai.{type.value} where start between '{start}' and '{end}'")
    return [item['category'] for item in data if item['category'] is not None]
