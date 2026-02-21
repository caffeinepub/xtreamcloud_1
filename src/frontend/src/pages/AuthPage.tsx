import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../hooks/useQueries';

export default function AuthPage() {
  const navigate = useNavigate();
  const { login, identity, isLoggingIn } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();
  
  const [username, setUsername] = useState('');
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [error, setError] = useState('');

  const isAuthenticated = !!identity;

  useEffect(() => {
    if (isAuthenticated && !profileLoading && isFetched) {
      if (userProfile === null) {
        setShowProfileSetup(true);
      } else {
        navigate({ to: '/plans' });
      }
    }
  }, [isAuthenticated, userProfile, profileLoading, isFetched, navigate]);

  const handleLogin = async () => {
    try {
      setError('');
      await login();
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  const handleSaveProfile = async () => {
    if (!username.trim()) {
      setError('Please enter your name');
      return;
    }
    try {
      setError('');
      await saveProfile.mutateAsync({ id: username.trim() });
      navigate({ to: '/plans' });
    } catch (err: any) {
      setError(err.message || 'Failed to save profile');
    }
  };

  if (showProfileSetup) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center p-4 hero-bg">
        <Card className="w-full max-w-md minecraft-card">
          <CardHeader>
            <CardTitle className="minecraft-text">Welcome to XtreamCloud!</CardTitle>
            <CardDescription>Please tell us your name to get started</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="username">Your Name</Label>
              <Input
                id="username"
                placeholder="Enter your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={saveProfile.isPending}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleSaveProfile} 
              className="w-full minecraft-button"
              disabled={saveProfile.isPending}
            >
              {saveProfile.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Continue
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center p-4 hero-bg">
      <Card className="w-full max-w-md minecraft-card">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl minecraft-text">XtreamCloud</CardTitle>
          <CardDescription className="text-base">
            Premium Minecraft Server Hosting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="space-y-4 mt-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  Sign in with Internet Identity to access your hosting panel
                </p>
                <Button 
                  onClick={handleLogin} 
                  className="w-full minecraft-button"
                  disabled={isLoggingIn}
                >
                  {isLoggingIn && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoggingIn ? 'Logging in...' : 'Login with Internet Identity'}
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="register" className="space-y-4 mt-4">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  Create a new account with Internet Identity
                </p>
                <Button 
                  onClick={handleLogin} 
                  className="w-full minecraft-button"
                  disabled={isLoggingIn}
                >
                  {isLoggingIn && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoggingIn ? 'Creating account...' : 'Register with Internet Identity'}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
          {isAuthenticated && (
            <div className="mt-4 text-center">
              <Button 
                variant="link" 
                onClick={() => navigate({ to: '/plans' })}
                className="text-primary"
              >
                Already logged in? Go to Plans →
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
