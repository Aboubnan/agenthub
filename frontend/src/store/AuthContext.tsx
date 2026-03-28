import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from "react";
import { User } from "../types";
import { api } from "../services/api";

interface AuthContextType {
	user: User | null;
	token: string | null;
	login: (token: string) => void;
	logout: () => void;
	isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<string | null>(
		localStorage.getItem("access_token"),
	);
	const [isLoading, setIsLoading] = useState(true);

	// Au chargement, si un token existe, on récupère le profil user
	useEffect(() => {
		if (token) {
			api
				.get<User>("/auth/me")
				.then((res) => setUser(res.data))
				.catch(() => {
					localStorage.removeItem("access_token");
					setToken(null);
				})
				.finally(() => setIsLoading(false));
		} else {
			setIsLoading(false);
		}
	}, [token]);

	const login = (newToken: string) => {
		localStorage.setItem("access_token", newToken);
		setToken(newToken);
	};

	const logout = () => {
		localStorage.removeItem("access_token");
		setToken(null);
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within AuthProvider");
	return ctx;
}
