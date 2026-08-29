import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      navigate("/login?error=google_auth_failed", {
        replace: true,
      });
      return;
    }

    // Save JWT
    localStorage.setItem("token", token);

    // Redirect to dashboard
    navigate("/dashboard", {
      replace: true,
    });
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="text-2xl font-bold text-slate-900">
          Signing you in...
        </div>

        <p className="mt-2 text-slate-500">
          Completing Google authentication
        </p>
      </div>
    </div>
  );
}