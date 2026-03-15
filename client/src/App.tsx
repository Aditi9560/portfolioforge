import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

const LandingPage   = lazy(() => import('./pages/LandingPage'));
const BuilderPage   = lazy(() => import('./pages/BuilderPage'));
const PreviewPage   = lazy(() => import('./pages/PreviewPage'));
const PortfolioPage = lazy(() => import('./pages/PortfolioPage'));
const StatsPage     = lazy(() => import('./pages/StatsPage'));
const NotFoundPage  = lazy(() => import('./pages/NotFoundPage'));

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#111111', color: '#fff', border: '1px solid #1f1f1f' },
        }}
      />
      <Suspense fallback={<LoadingSpinner />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/"              element={<LandingPage />} />
            <Route path="/create"        element={<BuilderPage />} />
            <Route path="/preview"       element={<PreviewPage />} />
            <Route path="/p/:slug"       element={<PortfolioPage />} />
            <Route path="/p/:slug/stats" element={<StatsPage />} />
            <Route path="*"              element={<NotFoundPage />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </>
  );
}
