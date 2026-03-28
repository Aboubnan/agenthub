import os
import uuid
from typing import List

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session

from app.api.v1.deps import get_current_user
from app.db.base import get_db
from app.models.user import User
from app.models.workspace import Workspace
from app.models.document import Document
from app.schemas.workspace import (
    WorkspaceCreate,
    WorkspaceUpdate,
    WorkspaceResponse,
    DocumentResponse,
)

router = APIRouter()

UPLOAD_DIR = "/app/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_TYPES = {
    "application/pdf",
    "text/plain",
    "text/markdown",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}


# --- WORKSPACES ---

@router.get("/", response_model=List[WorkspaceResponse])
def list_workspaces(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retourne tous les workspaces de l'utilisateur connecté."""
    return db.query(Workspace).filter(
        Workspace.owner_id == current_user.id
    ).all()


@router.post("/", response_model=WorkspaceResponse, status_code=201)
def create_workspace(
    workspace_in: WorkspaceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Crée un nouveau workspace pour l'utilisateur connecté."""
    workspace = Workspace(
        name=workspace_in.name,
        description=workspace_in.description,
        owner_id=current_user.id,
    )
    db.add(workspace)
    db.commit()
    db.refresh(workspace)
    return workspace


@router.get("/{workspace_id}", response_model=WorkspaceResponse)
def get_workspace(
    workspace_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Récupère un workspace par son ID — seulement si il appartient au user."""
    workspace = db.query(Workspace).filter(
        Workspace.id == workspace_id,
        Workspace.owner_id == current_user.id,
    ).first()
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return workspace


@router.patch("/{workspace_id}", response_model=WorkspaceResponse)
def update_workspace(
    workspace_id: uuid.UUID,
    workspace_in: WorkspaceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Met à jour partiellement un workspace (PATCH = seulement les champs envoyés)."""
    workspace = db.query(Workspace).filter(
        Workspace.id == workspace_id,
        Workspace.owner_id == current_user.id,
    ).first()
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")

    # model_dump(exclude_unset=True) = seulement les champs que l'user a envoyés
    for field, value in workspace_in.model_dump(exclude_unset=True).items():
        setattr(workspace, field, value)

    db.commit()
    db.refresh(workspace)
    return workspace


@router.delete("/{workspace_id}", status_code=204)
def delete_workspace(
    workspace_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Supprime un workspace et tous ses documents (cascade)."""
    workspace = db.query(Workspace).filter(
        Workspace.id == workspace_id,
        Workspace.owner_id == current_user.id,
    ).first()
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    db.delete(workspace)
    db.commit()


# --- DOCUMENTS ---

@router.get("/{workspace_id}/documents", response_model=List[DocumentResponse])
def list_documents(
    workspace_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Liste tous les documents d'un workspace."""
    workspace = db.query(Workspace).filter(
        Workspace.id == workspace_id,
        Workspace.owner_id == current_user.id,
    ).first()
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return workspace.documents


@router.post("/{workspace_id}/documents", response_model=DocumentResponse, status_code=201)
async def upload_document(
    workspace_id: uuid.UUID,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Upload un document dans un workspace.
    - Vérifie le type MIME
    - Limite à 10MB
    - Stocke le fichier sur disque avec un nom unique
    - Extrait le contenu texte pour TXT et MD
    - Sauvegarde les métadonnées en base
    """
    workspace = db.query(Workspace).filter(
        Workspace.id == workspace_id,
        Workspace.owner_id == current_user.id,
    ).first()
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")

    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Type '{file.content_type}' non autorisé. Formats acceptés : PDF, TXT, MD, DOCX",
        )

    content = await file.read()
    file_size = len(content)

    if file_size > 10 * 1024 * 1024:  # 10 MB
        raise HTTPException(status_code=400, detail="Fichier trop lourd. Max 10MB.")

    # Nom unique sur disque pour éviter les collisions
    unique_filename = f"{uuid.uuid4()}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    with open(file_path, "wb") as f:
        f.write(content)

    # Extraction texte immédiate pour TXT/MD (les PDF = Module 3)
    text_content = None
    if file.content_type in ("text/plain", "text/markdown"):
        text_content = content.decode("utf-8", errors="ignore")

    document = Document(
        filename=unique_filename,
        original_filename=file.filename,
        file_size=file_size,
        mime_type=file.content_type,
        content=text_content,
        workspace_id=workspace_id,
        uploaded_by=current_user.id,
    )
    db.add(document)
    db.commit()
    db.refresh(document)
    return document