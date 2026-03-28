import os
import pytest
from unittest.mock import patch


def test_health_check():
    with patch.dict(os.environ, {
        "SECRET_KEY": "test-secret-key-for-ci-only",
        "DATABASE_URL": "postgresql://test:test@localhost/test"
    }):
        from fastapi.testclient import TestClient
        from app.main import app
        client = TestClient(app)
        response = client.get("/api/v1/health")
        assert response.status_code == 200
        assert response.json()["status"] == "ok"