from typing import Optional

from main import app
from model.service import Service
from service.db_service import dbService
from service.provider_service import provider_service


# 对应客户端调用，组合provider和model
class EndpointService(object):
    def __init__(self):
        self.endpoints = {}

    async def init(self):
        config = await dbService.query('select * from gateai.endpoint where true')
        for c in config:
            self.endpoints[c['id']] = Service(
                id=c['id'],
                name=c['name'],
                provider=provider_service.get_provider_by_id(c['provider_id']),
                model=c['model'])
        print(f'load {self.endpoints.__len__()} endpoints.')

    def get_endpoint_by_id(self, serviceID) -> Optional[Service]:
        if serviceID not in self.endpoints:
            return None
        return self.endpoints[serviceID]


endpoint_service = EndpointService()


@app.on_event('startup')
async def init():
    await endpoint_service.init()
