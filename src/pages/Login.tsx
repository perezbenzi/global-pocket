import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Eye, EyeOff, X } from 'lucide-react';
import { toast } from '@/lib/toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isRecoveryOpen, setIsRecoveryOpen] =
    useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [isRecoveryLoading, setIsRecoveryLoading] =
    useState(false);
  const navigate = useNavigate();
  const { signIn, user, resetPassword } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handlePasswordReset = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    if (!recoveryEmail) {
      toast.error('Please enter your email address');
      return;
    }

    setIsRecoveryLoading(true);
    try {
      await resetPassword(recoveryEmail);
      toast.success(
        'Password reset email sent. Please check your inbox.'
      );
      setIsRecoveryOpen(false);
      setRecoveryEmail('');
    } catch (err: any) {
      toast.error(
        err.message || 'Error sending reset email'
      );
    } finally {
      setIsRecoveryLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-[100dvh] bg-background">
      <div className="w-full max-w-md px-4">
        <div className="rounded-xl overflow-hidden shadow-lg bg-card">
          <div className="bg-primary p-5">
            <h2 className="text-xl font-bold text-primary-foreground">
              Login
            </h2>
          </div>
          <form
            onSubmit={handleSubmit}
            className="p-8 space-y-6"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-2 text-foreground"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full p-3 border border-input rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2 text-foreground"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e =>
                    setPassword(e.target.value)
                  }
                  placeholder="••••••••"
                  className="w-full p-3 pr-12 border border-input rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md bg-muted/20 hover:bg-muted/50 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-foreground" />
                  ) : (
                    <Eye className="h-5 w-5 text-foreground" />
                  )}
                </button>
              </div>
              <button
                type="button"
                onClick={() => setIsRecoveryOpen(true)}
                className="text-sm text-primary hover:text-primary/80 mt-1"
              >
                Forgot password?
              </button>
            </div>
            {error && (
              <p className="text-destructive text-sm rounded-lg bg-destructive/10 p-3">
                {error}
              </p>
            )}
            <button
              type="submit"
              className="w-full py-3 px-5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-md transition-colors"
            >
              Login
            </button>
            <p className="text-sm text-foreground text-center pt-3">
              Don't have an account?{' '}
              <a
                href="/register"
                className="text-primary font-medium hover:text-primary/80 transition-colors"
              >
                Create account
              </a>
            </p>
          </form>
        </div>
      </div>

      {isRecoveryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsRecoveryOpen(false)}
          />
          <div className="relative bg-card rounded-lg shadow-lg w-full max-w-md mx-4">
            <div className="flex justify-between items-center p-5 border-b">
              <h3 className="text-lg font-semibold">
                Reset Password
              </h3>
              <button
                onClick={() => setIsRecoveryOpen(false)}
                className="p-1 hover:bg-muted/50 rounded-md transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form
              onSubmit={handlePasswordReset}
              className="p-5 space-y-4"
            >
              <p className="text-sm">
                Enter your email address and we'll send you
                a link to reset your password.
              </p>
              <div>
                <label
                  htmlFor="recovery-email"
                  className="block text-sm font-medium mb-2"
                >
                  Email
                </label>
                <input
                  id="recovery-email"
                  type="email"
                  value={recoveryEmail}
                  onChange={e =>
                    setRecoveryEmail(e.target.value)
                  }
                  placeholder="example@email.com"
                  className="w-full p-3 border border-input rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRecoveryOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted/50 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRecoveryLoading}
                  className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRecoveryLoading
                    ? 'Sending...'
                    : 'Send Reset Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
