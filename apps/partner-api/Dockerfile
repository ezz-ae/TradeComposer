
# API container
FROM python:3.11-slim AS base
WORKDIR /app
COPY . /app
RUN pip install --no-cache-dir fastapi uvicorn
EXPOSE 8080
CMD ["uvicorn", "apps.partner-api.main:app", "--host", "0.0.0.0", "--port", "8080"]
