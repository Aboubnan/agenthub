import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/api";

export function RegisterPage() {
	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setIsLoading(true);
		try {
			await authService.register(email, password, fullName);
			navigate("/login?registered=1");
		} catch (err: any) {
			setError(err.response?.data?.detail || "Erreur lors de l'inscription");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-gray-900">AgentHub</h1>
					<p className="text-gray-500 mt-2">Créez votre compte</p>
				</div>

				<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
					<form onSubmit={handleSubmit} className="space-y-5">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Nom complet
							</label>
							<input
								type="text"
								value={fullName}
								onChange={(e) => setFullName(e.target.value)}
								className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
								placeholder="Abderrehman Boubnan"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Email
							</label>
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
								placeholder="vous@exemple.fr"
								required
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Mot de passe
							</label>
							<input
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
								placeholder="••••••••"
								required
								minLength={8}
							/>
						</div>

						{error && (
							<div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg">
								{error}
							</div>
						)}

						<button
							type="submit"
							disabled={isLoading}
							className="w-full bg-brand-500 hover:bg-brand-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50"
						>
							{isLoading ? "Création..." : "Créer mon compte"}
						</button>
					</form>

					<p className="text-center text-sm text-gray-500 mt-6">
						Déjà un compte ?{" "}
						<Link
							to="/login"
							className="text-brand-500 hover:underline font-medium"
						>
							Se connecter
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
