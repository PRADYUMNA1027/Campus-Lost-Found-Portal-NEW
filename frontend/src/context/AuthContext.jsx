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
  // Fetch Current User
  // ============================================================

  const fetchCurrentUser = useCallback(
    async (authToken) => {

      try {

        const res = await api.get(
          "/auth/me",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

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
  // Initialize Authentication
  // ============================================================

  useEffect(() => {

    const initializeAuth = async () => {

      const storedToken =
        localStorage.getItem("token");

      if (!storedToken) {

        setLoading(false);

        return;
      }

      /*
       * Always verify the token with the backend.
       *
       * This is important after Google OAuth because
       * the token is received before the user object exists
       * in localStorage.
       */

      const result =
        await fetchCurrentUser(storedToken);


      if (!result.success) {

        console.warn(
          "Stored token is invalid or expired."
        );

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setToken(null);
        setUser(null);
      }

      setLoading(false);
    };


    initializeAuth();

  }, [fetchCurrentUser]);


  // ============================================================
  // Normal Login
  // ============================================================

  const login = async (
    email,
    password
  ) => {

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
      // Development fallback
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
  // Google OAuth Login
  // ============================================================

  const loginWithToken = async (
    newToken
  ) => {

    try {

      console.log(
        "Saving Google OAuth token..."
      );


      // Save token to React state
      setToken(newToken);


      // Save token to localStorage
      localStorage.setItem(
        "token",
        newToken
      );


      console.log(
        "Fetching Google user profile..."
      );


      /*
       * Ask backend who owns this JWT.
       */

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


      console.log(
        "Google user profile:",
        userData
      );


      // Update React authentication state
      setUser(userData);


      // Save user
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


      /*
       * IMPORTANT:
       *
       * Do NOT silently create a mock user here.
       *
       * If Google authentication succeeded but
       * /auth/me fails, we want to see the actual
       * backend error instead of pretending login worked.
       */

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


      // ========================================================
      // Development fallback
      // ========================================================

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

  const logout = () => {

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
        register,
        logout,

        isAuthenticated:
          !!user,

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

  const context =
    useContext(AuthContext);


  if (!context) {

    throw new Error(
      "useAuth must be used within an AuthProvider"
    );
  }


  return context;
};