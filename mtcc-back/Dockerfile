FROM python:3.11-buster as py-build

RUN apt-get update && apt-get install -y curl

RUN curl -sSL https://install.python-poetry.org | POETRY_HOME=/opt/poetry python3 -

COPY . /app
WORKDIR /app
ENV PATH=/opt/poetry/bin:$PATH
RUN poetry config virtualenvs.in-project true && poetry install

FROM python:3.11-slim-buster

RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    software-properties-common \
    libmediainfo-dev \
    && rm -rf /var/lib/apt/lists/*

EXPOSE 8000
HEALTHCHECK CMD curl --fail http://localhost:8000/_stcore/health
COPY --from=py-build /app /app
WORKDIR /app
ENV VIRTUAL_ENV=/app/.venv
ENV PATH=$VIRTUAL_ENV/bin:$PATH
ENTRYPOINT ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]