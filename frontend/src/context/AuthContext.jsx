import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import api from "../services/api";

import {
  MOCK_USER_STUDENT,
  MOCK_USER_ADMIN,
} from "../data/mockData";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // ============================================================
  // Authentication State
  // ============================================================

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser);
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  });

  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null
  );

  const [loading, setLoading] = useState(true);

  // ============================================================
  // Firebase Authentication Listener
  // ============================================================

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        console.log("Firebase user detected:", firebaseUser.email);

        try {
          const firebaseToken = await firebaseUser.getIdToken();

          setToken(firebaseToken);

          localStorage.setItem("token", firebaseToken);

          const firebaseUserData = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || "Campus User",
            email: firebaseUser.email,
            role: "student",
            photoURL: firebaseUser.photoURL || null,
            provider: "google",
          };

          setUser(firebaseUserData);

          localStorage.setItem(
            "user",
            JSON.stringify(firebaseUserData)
          );

          console.log("Firebase authentication successful.");
        } catch (error) {
          console.error(
            "Failed to process Firebase authentication:",
            error
          );
        }
      } else {
        console.log("No Firebase user currently signed in.");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ============================================================
  // Fetch Current Backend User
  // ============================================================

  const fetchCurrentUser = useCallback(
    async (authToken) => {
      try {
        const res = await api.get("/auth/me", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (res.data) {
          setUser(res.data);

          localStorage.setItem(
            "user",
            JSON.stringify(res.data)
          );

          return {
            success: true,
            user: res.data,
          };
        }

        return {
          success: false,
          error: "Failed to fetch user profile.",
        };
      } catch (err) {
        console.error(
          "Failed to fetch current user:",
          err
        );

        return {
          success: false,
          error:
            err.response?.data?.detail ||
            "Unable to fetch user profile.",
        };
      }
    },
    []
  );

  // ============================================================
  // Backend Authentication Initialization
  // ============================================================

  useEffect(() => {
    const initializeBackendAuth = async () => {
      const storedToken =
        localStorage.getItem("token");

      const firebaseUser = auth.currentUser;

      // Firebase user already exists.
      // Firebase authentication listener handles this.
      if (firebaseUser) {
        setLoading(false);
        return;
      }

      if (!storedToken) {
        setLoading(false);
        return;
      }

      const result =
        await fetchCurrentUser(storedToken);

      if (!result.success) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setToken(null);
        setUser(null);
      }

      setLoading(false);
    };

    initializeBackendAuth();
  }, [fetchCurrentUser]);

  // ============================================================
  // Normal Email / Password Login
  // ============================================================

  const login = async (email, password) => {
    try {
      const res = await api.post(
        "/auth/login",
        {
          email,
          password,
        }
      );

      const {
        access_token,
        user: userData,
      } = res.data;

      setToken(access_token);
      setUser(userData);

      localStorage.setItem(
        "token",
        access_token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(userData)
      );

      return {
        success: true,
        user: userData,
      };
    } catch (err) {
      if (err.response) {
        return {
          success: false,
          error:
            err.response.data?.detail ||
            "Invalid email or password.",
        };
      }

      // ========================================================
      // Development Mock Login
      // ========================================================

      console.warn(
        "Backend unavailable. Using mock login."
      );

      if (
        email
          .toLowerCase()
          .includes("admin")
      ) {
        const mockAdminToken =
          "mock-admin-jwt-token";

        setToken(mockAdminToken);
        setUser(MOCK_USER_ADMIN);

        localStorage.setItem(
          "token",
          mockAdminToken
        );

        localStorage.setItem(
          "user",
          JSON.stringify(MOCK_USER_ADMIN)
        );

        return {
          success: true,
          user: MOCK_USER_ADMIN,
          isMock: true,
        };
      }

      const mockStudentUser = {
        ...MOCK_USER_STUDENT,
        email:
          email ||
          "student@campus.edu",
      };

      const mockToken =
        "mock-student-jwt-token";

      setToken(mockToken);
      setUser(mockStudentUser);

      localStorage.setItem(
        "token",
        mockToken
      );

      localStorage.setItem(
        "user",
        JSON.stringify(mockStudentUser)
      );

      return {
        success: true,
        user: mockStudentUser,
        isMock: true,
      };
    }
  };

  // ============================================================
  // Google / Firebase Login
  // ============================================================

  const loginWithFirebaseUser = async (
    firebaseUser
  ) => {
    try {
      if (!firebaseUser) {
        return {
          success: false,
          error: "Google authentication failed.",
        };
      }

      const firebaseToken =
        await firebaseUser.getIdToken();

      const userData = {
        id: firebaseUser.uid,
        name:
          firebaseUser.displayName ||
          "Campus User",
        email: firebaseUser.email,
        role: "student",
        photoURL:
          firebaseUser.photoURL || null,
        provider: "google",
      };

      setToken(firebaseToken);
      setUser(userData);

      localStorage.setItem(
        "token",
        firebaseToken
      );

      localStorage.setItem(
        "user",
        JSON.stringify(userData)
      );

      console.log(
        "Google user logged in:",
        userData
      );

      return {
        success: true,
        user: userData,
      };
    } catch (error) {
      console.error(
        "Firebase login error:",
        error
      );

      return {
        success: false,
        error:
          error.message ||
          "Google login failed.",
      };
    }
  };

  // ============================================================
  // Existing Backend Google Token Login
  // ============================================================

  const loginWithToken = async (newToken) => {
    try {
      setToken(newToken);

      localStorage.setItem(
        "token",
        newToken
      );

      const res = await api.get(
        "/auth/me",
        {
          headers: {
            Authorization:
              `Bearer ${newToken}`,
          },
        }
      );

      if (!res.data) {
        throw new Error(
          "Backend returned no user profile."
        );
      }

      const userData = res.data;

      setUser(userData);

      localStorage.setItem(
        "user",
        JSON.stringify(userData)
      );

      return {
        success: true,
        user: userData,
      };
    } catch (err) {
      console.error(
        "Error completing Google login:",
        err
      );

      return {
        success: false,
        error:
          err.response?.data?.detail ||
          err.message ||
          "Failed to fetch user profile.",
      };
    }
  };

  // ============================================================
  // Registration
  // ============================================================

  const register = async (
    name,
    email,
    password
  ) => {
    try {
      const res = await api.post(
        "/auth/register",
        {
          name,
          email,
          password,
        }
      );

      const {
        access_token,
        user: userData,
      } = res.data;

      setToken(access_token);
      setUser(userData);

      localStorage.setItem(
        "token",
        access_token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(userData)
      );

      return {
        success: true,
        user: userData,
      };
    } catch (err) {
      if (err.response) {
        return {
          success: false,
          error:
            err.response.data?.detail ||
            "Registration failed. Please try again.",
        };
      }

      const newMockUser = {
        id: Date.now(),
        name,
        email,
        role: "student",
        created_at:
          new Date().toISOString(),
      };

      const mockToken =
        "mock-registered-jwt-token";

      setToken(mockToken);
      setUser(newMockUser);

      localStorage.setItem(
        "token",
        mockToken
      );

      localStorage.setItem(
        "user",
        JSON.stringify(newMockUser)
      );

      return {
        success: true,
        user: newMockUser,
        isMock: true,
      };
    }
  };

  // ============================================================
  // Logout
  // ============================================================

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(
        "Firebase logout error:",
        error
      );
    }

    setUser(null);
    setToken(null);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // ============================================================
  // Context
  // ============================================================

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,

        login,
        loginWithToken,
        loginWithFirebaseUser,
        register,
        logout,

        isAuthenticated: !!user,

        isAdmin:
          user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ============================================================
// useAuth Hook
// ============================================================

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider"
    );
  }

  return context;
};