import os
from threading import Thread

import asyncpg
from asyncpg import Record


class LogService():

    def __init__(self):
        self.db_pool = None

    async def create_pool(self):
        self.db_pool = await asyncpg.create_pool(
            host=os.environ['DB_HOST'],
            port=os.environ['DB_PORT'],
            user=os.environ['DB_USER'],
            password=os.environ['DB_PASSWORD'],
            database=os.environ['DB_DATABASE'],
        )


    async def logChat(self, data: {}):
        print('???')
        async with self.db_pool.acquire() as conn:
            async with conn.transaction():
                try:
                    await conn.execute(
                        'insert into gateai.chat(app, service, category, batch, "user", endpoint_id, provider_id, provider_type, model, message,\
                                temperature, max_tokens, n, seed, stop, response_format, presence_penalty, frequency_penalty,\
                                stream, top_p, timeout, start, choices, prompt, completion, "end", success, exception)\
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28)',
                        data['app'],
                        data['service'],
                        data['category'],
                        data['batch'],
                        data['user'],
                        data['endpoint_id'],
                        data['provider_id'],
                        data['provider_type'],
                        data['model'],
                        data['message'],
                        data['temperature'],
                        data['max_tokens'],
                        data['n'],
                        data['seed'],
                        data['stop'],
                        data['response_format'],
                        data['presence_penalty'],
                        data['frequency_penalty'],
                        data['stream'],
                        data['top_p'],
                        data['timeout'],
                        data['start'],
                        data['choices'],
                        data['prompt'],
                        data['completion'],
                        data['end'],
                        data['success'],
                        data['exception'],
                    )
                except Exception as e:
                    print(e)

    async def query(self, query):
        async with self.db_pool.acquire() as conn:
            result = await conn.fetch(query)
            data = []
            for row in result:
                item = {}
                for key in list(result[0].keys()):
                    item[key] = row[key]
                data.append(item)
            return data


dbService = LogService()
