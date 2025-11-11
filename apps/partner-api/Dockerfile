
# Minimal Python FastAPI image
FROM python:3.11-slim

WORKDIR /app
COPY . /app

# If your API is nested, adjust ADD path as needed
RUN pip install --no-cache-dir fastapi uvicorn[standard]

EXPOSE 8080
CMD ["uvicorn", "apps.partner-api.main:app", "--host", "0.0.0.0", "--port", "8080"]
