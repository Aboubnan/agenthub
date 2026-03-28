# AgentHub ���

> AI-powered SaaS platform — deploy custom RAG agents on your own data

[![CI](https://github.com/TON_USERNAME/agenthub/actions/workflows/ci.yml/badge.svg)](https://github.com/TON_USERNAME/agenthub/actions)
[![Python](https://img.shields.io/badge/Python-3.12-blue)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18-61DAFB)](https://react.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

## What is AgentHub?

AgentHub lets SMBs and agencies deploy AI agents trained on their own documents — internal knowledge base, contracts, FAQs — and expose them as a chat interface or API.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Backend | Python 3.12 · FastAPI · SQLAlchemy · Alembic |
| AI | LangChain · LlamaIndex · OpenAI · Qdrant (RAG) |
| Frontend | React 18 · TypeScript · Tailwind CSS · Vite |
| Database | PostgreSQL 16 · pgvector |
| DevOps | Docker · Docker Compose · GitHub Actions |
| Cloud | AWS EC2 · S3 (roadmap) |

## Quick Start
```bash
git clone https://github.com/TON_USERNAME/agenthub.git
cd agenthub
cp backend/.env.example backend/.env
# Edit backend/.env with your values
make build
```

API docs: http://localhost:8000/api/v1/docs
Frontend: http://localhost:5173

## Project Structure
```
agenthub/
├── backend/          # FastAPI app
│   ├── app/
│   │   ├── api/      # Route handlers
│   │   ├── core/     # Config, security
│   │   ├── db/       # Database setup
│   │   ├── models/   # SQLAlchemy models
│   │   ├── schemas/  # Pydantic schemas
│   │   └── services/ # Business logic
│   └── tests/
├── frontend/         # React/TS app
├── docs/             # Architecture diagrams
└── .github/workflows # CI/CD
```

## Roadmap

- [x] Module 1 — Base SaaS (auth, users, workspaces)
- [ ] Module 2 — RAG Engine (document ingestion, vector search)
- [ ] Module 3 — Agents & MCP (LangChain agents, MCP tools)
- [ ] Module 4 — Production (Stripe, monitoring, AWS)

## License

MIT © Abderrehman — Naya Web
