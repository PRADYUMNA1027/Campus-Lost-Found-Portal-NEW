import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loginWithToken } = useAuth();

  const [error, setError] = useState("");

  useEffect(() => {
    const completeGoogleLogin = async () => {
      const token = searchParams.get("token");

      console.log("OAuth callback received");

      if (!token) {
        console.error("No Google OAuth token found");

        setError("Google authentication failed. No token received.");

        setTimeout(() => {
          navigate("/login?error=google_auth_failed", {
            replace: true,
          });
        }, 1500);

        return;
      }

      console.log("Google OAuth token received");

      try {
        /*
         * Send the JWT to AuthContext.
         *
         * loginWithToken:
         * 1. Saves the token
         * 2. Calls /api/auth/me
         * 3. Gets the logged-in user
         * 4. Updates React authentication state
         */
        const result = await loginWithToken(token);

        if (result.success) {
          console.log("Google login successful");
          console.log("Logged in user:", result.user);

          navigate("/dashboard", {
            replace: true,
          });
        } else {
          console.error(
            "Unable to complete Google login:",
            result.error
          );

          setError(
            result.error || "Unable to complete Google login."
          );

          setTimeout(() => {
            navigate("/login?error=google_auth_failed", {
              replace: true,
            });
          }, 1500);
        }
      } catch (err) {
        console.error(
          "OAuth callback error:",
          err
        );

        setError(
          "Something went wrong while completing Google login."
        );

        setTimeout(() => {
          navigate("/login?error=google_auth_failed", {
            replace: true,
          });
        }, 1500);
      }
    };

    completeGoogleLogin();
  }, [navigate, searchParams, loginWithToken]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-md w-full mx-4">

        {!error ? (
          <>
            {/* Loading spinner */}
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>

            <h1 className="text-2xl font-bold text-slate-900">
              Signing you in...
            </h1>

            <p className="mt-3 text-slate-500">
              Completing Google authentication
            </p>
          </>
        ) : (
          <>
            <div className="text-red-500 text-4xl mb-4">
              ⚠
            </div>

            <h1 className="text-2xl font-bold text-slate-900">
              Authentication Failed
            </h1>

            <p className="mt-3 text-red-500">
              {error}
            </p>

            <p className="mt-4 text-sm text-slate-500">
              Redirecting you to the login page...
            </p>
          </>
        )}

      </div>
    </div>
  );
}