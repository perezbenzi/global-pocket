import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Index from './pages/Index';
import Transactions from './pages/Transactions';
import DollarRate from './pages/DollarRate';
import CryptoRates from './pages/CryptoRates';
import MonthlyExpenses from './pages/MonthlyExpenses';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Register from './pages/Register';
import RegisterDemo from './pages/RegisterDemo';
import { AuthProvider } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/ProtectedRoute';

const queryClient = new QueryClient();

// For testing purposes - will be replaced with import.meta.env.PROD in production
const isProduction = true;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/register"
              element={
                isProduction ? (
                  <RegisterDemo />
                ) : (
                  <Register />
                )
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              }
            />
            <Route
              path="/transactions"
              element={
                <ProtectedRoute>
                  <Transactions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/monthly-expenses"
              element={
                <ProtectedRoute>
                  <MonthlyExpenses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dollar"
              element={
                <ProtectedRoute>
                  <DollarRate />
                </ProtectedRoute>
              }
            />
            <Route
              path="/crypto"
              element={
                <ProtectedRoute>
                  <CryptoRates />
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
