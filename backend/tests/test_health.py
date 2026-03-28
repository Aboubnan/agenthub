from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def test_health_check():
    with patch("app.core.config.Settings._settings_build_values", return_value={}):
        with patch.dict(os.environ, {
            "SECRET_KEY": "test-secret-key",
            "DATABASE_URL": "postgresql://test:test@localhost/test"
        }):
            from app.main import app
            client = TestClient(app)
            response = client.get("/api/v1/health")
            assert response.status_code == 200
            assert response.json()["status"] == "ok"
