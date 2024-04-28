import pkgutil

import shortuuid
from fastapi import FastAPI, Request
from starlette.responses import RedirectResponse
from starlette.staticfiles import StaticFiles

from service.db_service import dbService

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")


@app.on_event("startup")
async def startup():
    await dbService.create_pool()


@app.get("/")
async def root():
    return RedirectResponse(url="/static/index.html")


package = __import__('route')

# 遍历并导入 'route' 包下的所有模块
for loader, module_name, is_pkg in pkgutil.iter_modules(package.__path__, package.__name__ + '.'):
    __import__(module_name)
