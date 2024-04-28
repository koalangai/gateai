import inspect
import json
from typing import List

from driver.driver import Driver
from main import app
from model.DriverInfo import DriverInfo
from model.ProviderInfo import ProviderInfo
from model.ServiceInfo import ServiceInfo
from service.db_service import dbService

package = __import__('driver')

import driver


@app.get("/backend/drivers")
def get_drivers() -> List[DriverInfo]:
    mds = [md for _, md in inspect.getmembers(driver, inspect.ismodule)]
    mds.append(driver)
    result = []
    for md in mds:
        result.extend(
            [DriverInfo(name=cls.name, url="") for _, cls in inspect.getmembers(md, inspect.isclass) if
             issubclass(cls, Driver) and cls != Driver])
    return result


@app.get("/backend/provider")
async def get_providers() -> List[ProviderInfo]:
    data = await dbService.query('select * from gateai.provider where enable')
    result = [ProviderInfo.model_validate(item) for item in data]
    for item in result:
        param = json.loads(item.params)
        for key, value in param.items():
            param[key] = "".join(["*" for i in range(value.__len__())])
        item.params = json.dumps(param)
    return result


@app.get("/backend/services")
async def get_services() -> List[ServiceInfo]:
    data = await dbService.query('select * from gateai.endpoint where enable')
    result = [ServiceInfo.model_validate(item) for item in data]
    return result
