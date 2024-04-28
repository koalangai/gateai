from typing import Type

from driver.driver import Driver


class Provider:
    id: str
    name: str
    driver: Driver

    def __init__(self, id: str, name: str, driver: Driver):
        self.id = id
        self.name = name
        self.driver = driver
