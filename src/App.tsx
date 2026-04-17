/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Home from './pages/Home';
import PlaceholderPage from './pages/PlaceholderPage';
import UserPermissions from './pages/UserPermissions';
import MasterItems from './pages/MasterItems';
import STDProcess from './pages/STDProcess';
import ProductMatrix from './pages/ProductMatrix';
import EquipmentRegistry from './pages/EquipmentRegistry';
import ProductionTracking from './pages/ProductionTracking';
import PlanFromPlanning from './pages/PlanFromPlanning';
import ProductionPlan from './pages/ProductionPlan';
import MachineBreakdown from './pages/MachineBreakdown';
import UnplannedJobs from './pages/UnplannedJobs';
import MixingBoard from './pages/MixingBoard';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route element={<Layout />}>
            <Route path="/" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            
            {/* General Modules (Read-only by default) */}
            <Route path="/inbound" element={
              <ProtectedRoute>
                <PlaceholderPage title="Inbound Control" />
              </ProtectedRoute>
            } />
            <Route path="/outbound" element={
              <ProtectedRoute>
                <PlaceholderPage title="Outbound Control" />
              </ProtectedRoute>
            } />
            <Route path="/inventory" element={
              <ProtectedRoute>
                <PlaceholderPage title="Inventory Core" />
              </ProtectedRoute>
            } />
            <Route path="/returns" element={
              <ProtectedRoute>
                <PlaceholderPage title="Returns & QC" />
              </ProtectedRoute>
            } />
            <Route path="/daily-board/tracking" element={
              <ProtectedRoute>
                <ProductionTracking />
              </ProtectedRoute>
            } />
            <Route path="/planning/fr" element={
              <ProtectedRoute>
                <PlanFromPlanning />
              </ProtectedRoute>
            } />
            <Route path="/planning/prod" element={
              <ProtectedRoute>
                <ProductionPlan />
              </ProtectedRoute>
            } />
            <Route path="/daily-problem/machine" element={
              <ProtectedRoute>
                <MachineBreakdown />
              </ProtectedRoute>
            } />
            <Route path="/daily-problem/unplanned" element={
              <ProtectedRoute>
                <UnplannedJobs />
              </ProtectedRoute>
            } />
            <Route path="/daily-board/mixing" element={
              <ProtectedRoute>
                <MixingBoard />
              </ProtectedRoute>
            } />

            {/* Confidential Modules */}
            <Route path="/prod-config/master-item" element={
              <ProtectedRoute isConfidential>
                <MasterItems />
              </ProtectedRoute>
            } />
            <Route path="/prod-config/std-process" element={
              <ProtectedRoute isConfidential>
                <STDProcess />
              </ProtectedRoute>
            } />
            <Route path="/prod-config/product-matrix" element={
              <ProtectedRoute isConfidential>
                <ProductMatrix />
              </ProtectedRoute>
            } />
            <Route path="/prod-config/equipment-registry" element={
              <ProtectedRoute isConfidential>
                <EquipmentRegistry />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute isConfidential>
                <PlaceholderPage title="WMS Settings" />
              </ProtectedRoute>
            } />
            <Route path="/permissions" element={
              <ProtectedRoute isConfidential>
                <UserPermissions />
              </ProtectedRoute>
            } />
            
            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
