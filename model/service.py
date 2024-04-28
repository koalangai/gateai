from typing import Type

from model.provider import Provider


class Service:
    id: str
    name: str
    provider: Provider
    model: str

    def __init__(self, id: str, name: str, provider: Provider, model: str):
        self.id = id
        self.name = name
        self.provider = provider
        self.model = model
