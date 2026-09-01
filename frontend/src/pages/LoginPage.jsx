import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import {
  FiLock,
  FiMail,
  FiArrowRight,
  FiShield,
  FiUserCheck,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

import { signInWithPopup } from "firebase/auth";
import {
  auth,
  googleProvider,
} from "../firebase/firebase";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ============================================================
  // Email / Password Login
  // ============================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await login(
        email,
        password
      );

      if (result.success) {
        if (result.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      } else {
        setError(
          result.error ||
            "Invalid email or password."
        );
      }
    } catch (err) {
      console.error(
        "Login error:",
        err
      );

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================================
  // Quick Demo Login
  // ============================================================

  const handleQuickDemo = async (role) => {
    setError("");
    setIsSubmitting(true);

    try {
      if (role === "admin") {
        const demoEmail =
          "admin@campus.edu";

        const demoPassword =
          "admin123";

        setEmail(demoEmail);
        setPassword(demoPassword);

        const res = await login(
          demoEmail,
          demoPassword
        );

        if (res.success) {
          navigate("/admin");
        } else {
          setError(
            res.error ||
              "Admin demo login failed."
          );
        }
      } else {
        const demoEmail =
          "student@campus.edu";

        const demoPassword =
          "student123";

        setEmail(demoEmail);
        setPassword(demoPassword);

        const res = await login(
          demoEmail,
          demoPassword
        );

        if (res.success) {
          navigate("/dashboard");
        } else {
          setError(
            res.error ||
              "Student demo login failed."
          );
        }
      }
    } catch (err) {
      console.error(
        "Demo login error:",
        err
      );

      setError(
        "Demo login failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================================
  // Google Firebase Login
  // ============================================================

  const handleGoogleLogin = async () => {
    setError("");
    setIsSubmitting(true);

    try {
      console.log(
        "Starting Google Firebase login..."
      );

      const result =
        await signInWithPopup(
          auth,
          googleProvider
        );

      const firebaseUser =
        result.user;

      console.log(
        "Google login successful:",
        firebaseUser
      );

      // Get Firebase ID token
      const firebaseToken =
        await firebaseUser.getIdToken();

      // Create local user object
      const userData = {
        id: firebaseUser.uid,
        name:
          firebaseUser.displayName ||
          "Campus User",
        email:
          firebaseUser.email,
        role: "student",
        photoURL:
          firebaseUser.photoURL ||
          null,
        provider: "google",
      };

      // Save authentication data
      localStorage.setItem(
        "token",
        firebaseToken
      );

      localStorage.setItem(
        "user",
        JSON.stringify(userData)
      );

      console.log(
        "Firebase user saved successfully."
      );

      // Redirect Google users to dashboard
      navigate("/dashboard");

    } catch (error) {
      console.error(
        "Google login failed:",
        error
      );

      // Handle common Firebase errors
      if (
        error.code ===
        "auth/popup-closed-by-user"
      ) {
        setError(
          "Google login popup was closed."
        );
      } else if (
        error.code ===
        "auth/popup-blocked"
      ) {
        setError(
          "Google login popup was blocked by the browser."
        );
      } else if (
        error.code ===
        "auth/cancelled-popup-request"
      ) {
        setError(
          "Google login request was cancelled."
        );
      } else {
        setError(
          error.message ||
            "Google login failed. Please try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.4,
      }}
      className="max-w-md mx-auto px-4 py-16"
    >
      <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-8 space-y-6">

        {/* ======================================================
            Header
        ====================================================== */}

        <div className="text-center space-y-2">
          <h1 className="text-2xl font-extrabold text-slate-900">
            Welcome Back
          </h1>

          <p className="text-xs text-slate-500">
            Sign in to your Campus Lost & Found account
          </p>
        </div>

        {/* ======================================================
            Demo Quick Login
        ====================================================== */}

        <div className="p-3 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-2">

          <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider block text-center">
            Quick Demo Login Toggles
          </span>

          <div className="grid grid-cols-2 gap-2">

            {/* Student */}

            <motion.button
              type="button"
              whileHover={{
                scale: 1.02,
              }}
              whileTap={{
                scale: 0.98,
              }}
              onClick={() =>
                handleQuickDemo(
                  "student"
                )
              }
              disabled={isSubmitting}
              className="py-2 px-3 bg-white rounded-xl border border-blue-200 text-xs font-bold text-blue-700 hover:bg-blue-50 flex items-center justify-center space-x-1 cursor-pointer disabled:opacity-50"
            >
              <FiUserCheck className="w-3.5 h-3.5" />

              <span>
                Student Account
              </span>
            </motion.button>

            {/* Admin */}

            <motion.button
              type="button"
              whileHover={{
                scale: 1.02,
              }}
              whileTap={{
                scale: 0.98,
              }}
              onClick={() =>
                handleQuickDemo(
                  "admin"
                )
              }
              disabled={isSubmitting}
              className="py-2 px-3 bg-white rounded-xl border border-amber-200 text-xs font-bold text-amber-800 hover:bg-amber-50 flex items-center justify-center space-x-1 cursor-pointer disabled:opacity-50"
            >
              <FiShield className="w-3.5 h-3.5 text-amber-600" />

              <span>
                Admin Account
              </span>
            </motion.button>

          </div>
        </div>

        {/* ======================================================
            Error Message
        ====================================================== */}

        {error && (
          <motion.div
            initial={{
              opacity: 0,
              y: -5,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold text-center"
          >
            {error}
          </motion.div>
        )}

        {/* ======================================================
            Email / Password Form
        ====================================================== */}

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          {/* Email */}

          <div className="space-y-1">

            <label className="block text-xs font-semibold text-slate-700">
              Campus Email
            </label>

            <div className="relative">

              <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                placeholder="student@campus.edu"
                disabled={isSubmitting}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
              />

            </div>
          </div>

          {/* Password */}

          <div className="space-y-1">

            <label className="block text-xs font-semibold text-slate-700">
              Password
            </label>

            <div className="relative">

              <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                placeholder="••••••••"
                disabled={isSubmitting}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
              />

            </div>
          </div>

          {/* Sign In */}

          <motion.button
            type="submit"
            whileHover={{
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.98,
            }}
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >

            <span>
              {isSubmitting
                ? "Authenticating..."
                : "Sign In"}
            </span>

            {!isSubmitting && (
              <FiArrowRight />
            )}

          </motion.button>

        </form>

        {/* ======================================================
            Divider
        ====================================================== */}

        <div className="relative my-4">

          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>

          <div className="relative flex justify-center text-xs uppercase">

            <span className="bg-white px-2.5 text-slate-400 font-semibold tracking-wider">
              Or
            </span>

          </div>

        </div>

        {/* ======================================================
            Google SSO
        ====================================================== */}

        <motion.button
          type="button"
          whileHover={{
            scale: 1.02,
          }}
          whileTap={{
            scale: 0.98,
          }}
          onClick={
            handleGoogleLogin
          }
          disabled={isSubmitting}
          className="w-full py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm shadow-xs hover:shadow transition-all flex items-center justify-center space-x-2.5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >

          <FcGoogle className="w-5 h-5 shrink-0" />

          <span>
            {isSubmitting
              ? "Authenticating..."
              : "Continue with Google"}
          </span>

        </motion.button>

        {/* ======================================================
            Register
        ====================================================== */}

        <div className="text-center pt-2 border-t border-slate-100">

          <p className="text-xs text-slate-500">

            Don't have an account?{" "}

            <Link
              to="/register"
              className="font-bold text-blue-600 hover:underline"
            >
              Register Here
            </Link>

          </p>

        </div>

      </div>
    </motion.div>
  );
};

export default LoginPage;