import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import { AuthProvider } from './context/AuthContext';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

import {
  ProtectedRoute,
  AdminRoute
} from './components/common/ProtectedRoute';

import HomePage from './pages/HomePage';
import LostItemsPage from './pages/LostItemsPage';
import FoundItemsPage from './pages/FoundItemsPage';
import ItemDetailsPage from './pages/ItemDetailsPage';

import ReportLostPage from './pages/ReportLostPage';
import ReportFoundPage from './pages/ReportFoundPage';
import ClaimItemPage from './pages/ClaimItemPage';

import UserDashboardPage from './pages/UserDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import NotificationsPage from './pages/NotificationsPage';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutPage from './pages/AboutPage';

import OAuthCallbackPage from './pages/OAuthCallbackPage';

import NotFoundPage from './pages/NotFoundPage';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="flex-1 flex flex-col"
      >
        <Routes location={location} key={location.pathname}>

          {/* ==================================================
              PUBLIC ROUTES
          ================================================== */}

          <Route
            path="/"
            element={<HomePage />}
          />

          <Route
            path="/lost-items"
            element={<LostItemsPage />}
          />

          <Route
            path="/found-items"
            element={<FoundItemsPage />}
          />

          <Route
            path="/items/:id"
            element={<ItemDetailsPage />}
          />

          {/* Item route alias */}
          <Route
            path="/item/:id"
            element={<ItemDetailsPage />}
          />

          <Route
            path="/about"
            element={<AboutPage />}
          />

          <Route
            path="/login"
            element={<LoginPage />}
          />

          <Route
            path="/register"
            element={<RegisterPage />}
          />

          {/* ==================================================
              GOOGLE OAUTH CALLBACK
          ================================================== */}

          <Route
            path="/oauth-callback"
            element={<OAuthCallbackPage />}
          />


          {/* ==================================================
              PROTECTED USER ROUTES
          ================================================== */}

          <Route
            path="/report-lost"
            element={
              <ProtectedRoute>
                <ReportLostPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/report-found"
            element={
              <ProtectedRoute>
                <ReportFoundPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/items/:id/claim"
            element={
              <ProtectedRoute>
                <ClaimItemPage />
              </ProtectedRoute>
            }
          />

          {/* Claim route alias */}
          <Route
            path="/claim/:id"
            element={
              <ProtectedRoute>
                <ClaimItemPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />


          {/* ==================================================
              ADMIN ROUTE
          ================================================== */}

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            }
          />


          {/* ==================================================
              404 / UNKNOWN ROUTES
          ================================================== */}

          <Route
            path="*"
            element={<NotFoundPage />}
          />

        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>

        <div className="flex flex-col min-h-screen bg-[#F8FAFC]">

          {/* Navbar */}
          <Navbar />

          {/* Main Content with Animated Routes */}
          <main className="flex-1 flex flex-col">
            <AnimatedRoutes />
          </main>

          {/* Footer */}
          <Footer />

        </div>

      </Router>
    </AuthProvider>
  );
}

export default App;