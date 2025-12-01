import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function PrivateRoute({ children }) {
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        async function checkAuth() {
            const token = localStorage.getItem("token");

            if (!token) {
                setAuthorized(false);
                setLoading(false);
                return;
            }

            try {
                const response = await fetch("http://localhost:8000/api/auth/me", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Accept": "application/json",
                    },
                });

                if (response.status === 401) {
                    localStorage.removeItem("token");
                    setAuthorized(false);
                } else {
                    setAuthorized(true);
                }
            } catch (err) {
                console.error("Erro de autenticação:", err);
                setAuthorized(false);
            }

            setLoading(false);
        }

        checkAuth();
    }, []);

    if (loading) return <div>Carregando...</div>;

    if (!authorized) return <Navigate to="/login" replace />;

    return children;
}
