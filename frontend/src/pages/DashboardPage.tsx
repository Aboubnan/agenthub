import { useState, useEffect } from "react";
import { useAuth } from "../store/AuthContext";
import { workspaceService } from "../services/api";

interface Workspace {
	id: string;
	name: string;
	description: string | null;
	owner_id: string;
	created_at: string;
}

export function DashboardPage() {
	const { user, logout } = useAuth();
	const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [showForm, setShowForm] = useState(false);
	const [newName, setNewName] = useState("");
	const [newDesc, setNewDesc] = useState("");
	const [creating, setCreating] = useState(false);

	useEffect(() => {
		workspaceService
			.list()
			.then(setWorkspaces)
			.finally(() => setIsLoading(false));
	}, []);

	const handleCreate = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newName.trim()) return;
		setCreating(true);
		try {
			const workspace = await workspaceService.create(newName, newDesc);
			setWorkspaces((prev) => [workspace, ...prev]);
			setNewName("");
			setNewDesc("");
			setShowForm(false);
		} finally {
			setCreating(false);
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm("Supprimer ce workspace et tous ses documents ?")) return;
		await workspaceService.delete(id);
		setWorkspaces((prev) => prev.filter((w) => w.id !== id));
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<nav className="bg-white border-b border-gray-100 px-6 py-4">
				<div className="max-w-5xl mx-auto flex items-center justify-between">
					<span className="text-xl font-bold text-gray-900">AgentHub</span>
					<div className="flex items-center gap-4">
						<span className="text-sm text-gray-500">
							{user?.full_name || user?.email}
						</span>
						<button
							onClick={logout}
							className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
						>
							Déconnexion
						</button>
					</div>
				</div>
			</nav>

			<main className="max-w-5xl mx-auto px-6 py-8">
				<div className="flex items-center justify-between mb-8">
					<div>
						<h1 className="text-2xl font-bold text-gray-900">Mes workspaces</h1>
						<p className="text-gray-500 text-sm mt-1">
							Chaque workspace contient les documents de votre agent IA
						</p>
					</div>
					<button
						onClick={() => setShowForm(!showForm)}
						className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
					>
						+ Nouveau workspace
					</button>
				</div>

				{showForm && (
					<form
						onSubmit={handleCreate}
						className="bg-white rounded-xl border border-gray-100 p-6 mb-6"
					>
						<h2 className="font-medium text-gray-900 mb-4">
							Nouveau workspace
						</h2>
						<div className="space-y-3">
							<input
								type="text"
								value={newName}
								onChange={(e) => setNewName(e.target.value)}
								placeholder="Nom du workspace"
								className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
								required
							/>
							<textarea
								value={newDesc}
								onChange={(e) => setNewDesc(e.target.value)}
								placeholder="Description (optionnelle)"
								rows={2}
								className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm resize-none"
							/>
						</div>
						<div className="flex gap-3 mt-4">
							<button
								type="submit"
								disabled={creating}
								className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
							>
								{creating ? "Création..." : "Créer"}
							</button>
							<button
								type="button"
								onClick={() => setShowForm(false)}
								className="text-gray-500 hover:text-gray-800 px-4 py-2 rounded-lg text-sm transition-colors"
							>
								Annuler
							</button>
						</div>
					</form>
				)}

				{isLoading ? (
					<div className="flex justify-center py-16">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500" />
					</div>
				) : workspaces.length === 0 ? (
					<div className="text-center py-16 text-gray-400">
						<p className="text-lg">Aucun workspace</p>
						<p className="text-sm mt-1">
							Créez votre premier workspace pour commencer
						</p>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{workspaces.map((ws) => (
							<div
								key={ws.id}
								className="bg-white rounded-xl border border-gray-100 p-6 hover:border-brand-500 transition-colors group"
							>
								<div className="flex items-start justify-between">
									<div className="flex-1 min-w-0">
										<h3 className="font-medium text-gray-900 truncate">
											{ws.name}
										</h3>
										{ws.description && (
											<p className="text-sm text-gray-500 mt-1 line-clamp-2">
												{ws.description}
											</p>
										)}
										<p className="text-xs text-gray-400 mt-3">
											Créé le{" "}
											{new Date(ws.created_at).toLocaleDateString("fr-FR")}
										</p>
									</div>
									<button
										onClick={() => handleDelete(ws.id)}
										className="ml-4 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 text-lg"
									>
										×
									</button>
								</div>
							</div>
						))}
					</div>
				)}
			</main>
		</div>
	);
}
