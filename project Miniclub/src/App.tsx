import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AnimatorAuthProvider } from './contexts/animator/AuthContext';
import { ParentAuthProvider } from './contexts/parents/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';
import { AnimatorRoute } from './components/AnimatorRoute';
import { ParentRoute } from './components/parents/ParentRoute';

// Pages générales
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';

// Pages de pointage
import { AttendancePage } from './pages/AttendancePage';
import { PresencePage } from './pages/PresencePage';
import { StatisticsPage } from './pages/StatisticsPage';
import { Layout } from './components/Layout';
import { AdminLayout } from './components/AdminLayout';
import { InviteCodesPage } from './pages/admin/InviteCodesPage';

// Pages des classes
import { CM2Page } from './pages/classes/CM2Page';
import { CM1Page } from './pages/classes/CM1Page';
import { CE2Page } from './pages/classes/CE2Page';
import { CE1Page } from './pages/classes/CE1Page';
import { CPPage } from './pages/classes/CPPage';
import { PK4Page } from './pages/classes/PK4Page';
import { PK3Page } from './pages/classes/PK3Page';
import { PK2Page } from './pages/classes/PK2Page';
import { PK1Page } from './pages/classes/PK1Page';

// Pages animateur
import { AnimatorLoginPage } from './pages/animator/LoginPage';
import { RegisterPage as AnimatorRegisterPage } from './pages/animator/RegisterPage';
import { AnimatorLayout } from './components/animator/Layout';
import { ActivitiesPage } from './pages/animator/ActivitiesPage';
import { MaterialPage } from './pages/animator/MaterialPage';
import { OrganizationPage } from './pages/animator/OrganizationPage';

// Pages parents
import { ParentLoginPage } from './pages/parents/LoginPage';
import { ParentRegisterPage } from './pages/parents/RegisterPage';
import { ParentLayout } from './components/parents/Layout';
import { RegistrationPage } from './pages/parents/RegistrationPage';
import { ParentActivitiesPage } from './pages/parents/ActivitiesPage';
import { ParentMealsPage } from './pages/parents/MealsPage';

export default function App() {
  return (
    <AuthProvider>
      <AnimatorAuthProvider>
        <ParentAuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              
              {/* Routes Pointage */}
              <Route path="/login" element={<LoginPage />} />
              <Route element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route path="/attendance" element={<AttendancePage />} />
                <Route path="/presence" element={<PresencePage />} />
                <Route path="/statistics" element={<StatisticsPage />} />
                <Route path="/class/cm2" element={<CM2Page />} />
                <Route path="/class/cm1" element={<CM1Page />} />
                <Route path="/class/ce2" element={<CE2Page />} />
                <Route path="/class/ce1" element={<CE1Page />} />
                <Route path="/class/cp" element={<CPPage />} />
                <Route path="/class/pk4" element={<PK4Page />} />
                <Route path="/class/pk3" element={<PK3Page />} />
                <Route path="/class/pk2" element={<PK2Page />} />
                <Route path="/class/pk1" element={<PK1Page />} />
              </Route>

              {/* Routes Animateur */}
              <Route path="/animator/login" element={<AnimatorLoginPage />} />
              <Route path="/animator/register" element={<AnimatorRegisterPage />} />
              <Route element={
                <AnimatorRoute>
                  <AnimatorLayout />
                </AnimatorRoute>
              }>
                <Route path="/animator/activities" element={<ActivitiesPage />} />
                <Route path="/animator/material" element={<MaterialPage />} />
                <Route path="/animator/organization" element={<OrganizationPage />} />
              </Route>
              
              {/* Routes Parents */}
              <Route path="/parents/login" element={<ParentLoginPage />} />
              <Route path="/parents/register" element={<ParentRegisterPage />} />
              <Route element={
                <ParentRoute>
                  <ParentLayout />
                </ParentRoute>
              }>
                <Route path="/parents/registration" element={<RegistrationPage />} />
                <Route path="/parents/activities" element={<ParentActivitiesPage />} />
                <Route path="/parents/meals" element={<ParentMealsPage />} />
              </Route>
              
              {/* Routes Admin */}
              <Route element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }>
                <Route path="/admin/invite-codes" element={<InviteCodesPage />} />
              </Route>
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </ParentAuthProvider>
      </AnimatorAuthProvider>
    </AuthProvider>
  );
}