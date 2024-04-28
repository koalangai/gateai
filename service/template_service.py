from main import app
from service.db_service import dbService


class TemplateService(object):
    def __init__(self):
        self.templates = {}

    async def init(self):
        datas = await dbService.query('select * from template where enable')
        self.templates = {item['id']: item for item in datas}

    def get_template(self, template_id):
        return self.templates.get(template_id)


templateService = TemplateService()


@app.on_event('startup')
async def init():
    await templateService.init()
