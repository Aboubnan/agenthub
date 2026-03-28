from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime


class WorkspaceBase(BaseModel):
    name: str
    description: Optional[str] = None


class WorkspaceCreate(WorkspaceBase):
    pass


class WorkspaceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None


class WorkspaceResponse(WorkspaceBase):
    id: UUID
    owner_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True


class DocumentResponse(BaseModel):
    id: UUID
    filename: str
    original_filename: str
    file_size: int
    mime_type: str
    workspace_id: UUID
    uploaded_by: UUID
    created_at: datetime

    class Config:
        from_attributes = True