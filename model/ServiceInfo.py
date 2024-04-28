from pydantic import BaseModel


class ServiceInfo(BaseModel):
    id: str
    provider_id: str
    model: str
    name: str
