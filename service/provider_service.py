import importlib

import inspect
import json

from main import app
from model.provider import Provider
from service.db_service import dbService


# 对应配置，组合驱动和key（租户）
class ProviderService(object):
    providers = {}

    async def init(self):
        config = await dbService.query('select * from gateai.provider where true')

        for c in config:
            module = importlib.import_module(f'driver.{c["driver"]}')
            cls = getattr(module, c['driver'])
            # paramNames = list(inspect.signature(cls.__init__).parameters.keys())[1:]
            # param = {}
            # for k in paramNames:
            #     param[k] = c[''][k]
            self.providers[c['id']] = Provider(id=c['id'], name=c['name'], driver=cls(**json.loads(c['params'])))
            if 'default' in c and c['default']:
                self.defaultProvider = self.providers[c['id']]

    def get_provider_by_id(self, id):
        return self.providers[id]


provider_service = ProviderService()


@app.on_event('startup')
async def init():
    await provider_service.init()
