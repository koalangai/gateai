#!/bin/zsh
rm -rf src/generated-api
openapi-generator generate -i http://127.0.0.1:8000/openapi.json -g typescript-fetch -o src/generated-api