from enum import Enum


class BackendType(str, Enum):
    CHAT = 'chat'
    IMAGE = 'image'
