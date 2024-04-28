from pydantic import BaseModel


class ProviderInfo(BaseModel):
    id: str
    driver: str
    params: str
    name: str
    default: bool
