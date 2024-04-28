from pydantic import BaseModel


class DriverInfo(BaseModel):
    name: str
    url: str