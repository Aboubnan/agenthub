from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.v1.router import api_router

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    openapi_url=f"{settings.API_V1_PREFIX}/openapi.json",
    docs_url=f"{settings.API_V1_PREFIX}/docs",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_PREFIX)
```

---

### `backend/requirements.txt`
```
# Web framework
fastapi==0.115.0
uvicorn[standard]==0.30.6

# Database
sqlalchemy==2.0.35
alembic==1.13.3
psycopg2-binary==2.9.9

# Auth & Security
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.9

# Validation & Settings
pydantic==2.9.2
pydantic-settings==2.5.2
email-validator==2.2.0

# HTTP client
httpx==0.27.2

# Dev & Quality
pytest==8.3.3
pytest-asyncio==0.24.0
black==24.8.0
isort==5.13.2
flake8==7.1.1
mypy==1.11.2