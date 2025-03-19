
import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FaGoogle } from 'react-icons/fa';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { z } from 'zod';

const authSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const Auth: React.FC = () => {
  const { user, loading, signIn, signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If user is already logged in, redirect to profile
  if (!loading && user) {
    return <Navigate to="/profile" />;
  }

  const validateForm = () => {
    try {
      authSchema.parse({ email, password });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      if (isSignIn) {
        await signIn(email, password);
        navigate('/profile');
      } else {
        await signUp(email, password);
        setIsSignIn(true);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('Google sign in error:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12 px-6">
        <div className="max-w-md mx-auto">
          <Tabs defaultValue="signin" onValueChange={(value) => setIsSignIn(value === 'signin')}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <Card>
              <CardHeader>
                <CardTitle>{isSignIn ? 'Welcome Back' : 'Create Account'}</CardTitle>
                <CardDescription>
                  {isSignIn ? 'Sign in to access your account' : 'Sign up to get started with MathTrainer'}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
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
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting 
                      ? 'Processing...' 
                      : isSignIn 
                        ? 'Sign In' 
                        : 'Create Account'
                    }
                  </Button>
                </form>
                
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleGoogleSignIn}
                >
                  <FaGoogle className="mr-2 h-4 w-4" />
                  Google
                </Button>
              </CardContent>
            </Card>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Auth;
