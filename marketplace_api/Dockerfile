# syntax=docker/dockerfile:1

FROM python:3.8-slim-buster


WORKDIR /usr/src/app/

COPY requirements.txt ./

RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt


EXPOSE 5000

COPY . .
