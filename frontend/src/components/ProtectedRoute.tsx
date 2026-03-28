import { Navigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
	const { token, isLoading } = useAuth();

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500" />
			</div>
		);
	}

	if (!token) {
		return <Navigate to="/login" replace />;
	}

	return <>{children}</>;
}
