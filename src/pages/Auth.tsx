
import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { z } from 'zod';

const authSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const passwordResetSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

const newPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const Auth: React.FC = () => {
  const { user, loading, signIn, signUp, resetPassword, updatePassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isResetMode = searchParams.get('reset') === 'true';
  const isPasswordResetMode = searchParams.get('type') === 'recovery';
  
  const [activeView, setActiveView] = useState<'signin' | 'signup' | 'forgot' | 'reset'>(() => {
    if (isPasswordResetMode) return 'reset';
    if (isResetMode) return 'forgot';
    return 'signin';
  });
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  // If user is already logged in, redirect to profile
  if (!loading && user && !isPasswordResetMode) {
    return <Navigate to="/profile" />;
  }

  const validateForm = (schema: z.ZodTypeAny, data: any) => {
    try {
      schema.parse(data);
      return true;
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        setError('Invalid form data');
      }
      return false;
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateForm(authSchema, { email, password })) return;

    setIsSubmitting(true);
    try {
      if (activeView === 'signin') {
        await signIn(email, password);
        navigate('/profile');
      } else if (activeView === 'signup') {
        await signUp(email, password);
        // Don't navigate away after signup - show a success message instead
        // and let the user log in (as they might need to verify email depending on settings)
      }
    } catch (err: any) {
      console.error('Auth error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateForm(passwordResetSchema, { email })) return;

    setIsSubmitting(true);
    try {
      await resetPassword(email);
      setSuccess('Password reset email sent! Please check your inbox.');
    } catch (err: any) {
      console.error('Password reset error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateForm(newPasswordSchema, { password, confirmPassword })) return;

    setIsSubmitting(true);
    try {
      await updatePassword(password);
      setSuccess('Password has been reset successfully! You can now log in with your new password.');
      // Clear password fields after successful reset
      setPassword('');
      setConfirmPassword('');
      setActiveView('signin');
    } catch (err: any) {
      console.error('Password update error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTabsContent = () => {
    if (activeView === 'forgot') {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>
              Enter your email address and we'll send you a link to reset your password
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email</Label>
                <Input 
                  id="reset-email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="youremail@example.com"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
              </Button>
              
              <div className="text-center mt-4">
                <Button
                  variant="link"
                  type="button"
                  onClick={() => setActiveView('signin')}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Back to Sign In
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      );
    } else if (activeView === 'reset') {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Set New Password</CardTitle>
            <CardDescription>
              Enter your new password below
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handlePasswordResetSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input 
                  id="new-password" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input 
                  id="confirm-password" 
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Updating...' : 'Update Password'}
              </Button>
            </form>
          </CardContent>
        </Card>
      );
    } else {
      return (
        <Tabs defaultValue={activeView === 'signin' ? 'signin' : 'signup'} onValueChange={(value) => setActiveView(value as 'signin' | 'signup')}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <Card>
            <CardHeader>
              <CardTitle>{activeView === 'signin' ? 'Welcome Back' : 'Create Account'}</CardTitle>
              <CardDescription>
                {activeView === 'signin' ? 'Sign in to access your account' : 'Sign up to get started with MathTrainer'}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {success && (
                <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="youremail@example.com"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
                
                {activeView === 'signin' && (
                  <div className="text-right">
                    <Button
                      variant="link"
                      type="button"
                      onClick={() => setActiveView('forgot')}
                      className="text-sm text-blue-600 hover:text-blue-800 p-0"
                    >
                      Forgot Password?
                    </Button>
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting 
                    ? 'Processing...' 
                    : activeView === 'signin' 
                      ? 'Sign In' 
                      : 'Create Account'
                  }
                </Button>
              </form>
            </CardContent>
          </Card>
        </Tabs>
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12 px-6">
        <div className="max-w-md mx-auto">
          {renderTabsContent()}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Auth;
