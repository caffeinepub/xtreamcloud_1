import { RouterProvider, createRouter, createRootRoute, createRoute, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import AuthPage from './pages/AuthPage';
import PlansPage from './pages/PlansPage';
import PaymentPage from './pages/PaymentPage';
import PanelPage from './pages/PanelPage';
import { Button } from './components/ui/button';
import { LogOut } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

function Layout() {
  const { identity, clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/assets/generated/xtreamcloud-logo.dim_512x512.png" 
              alt="XtreamCloud" 
              className="h-10 w-10 pixelated"
            />
            <h1 className="text-2xl font-bold text-foreground minecraft-text">
              XtreamCloud
            </h1>
          </div>
          {isAuthenticated && (
            <Button 
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          )}
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="border-t border-border/40 bg-card/30 mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          © 2026. Built with ❤️ using{' '}
          <a 
            href="https://caffeine.ai" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </div>
      </footer>
    </div>
  );
}

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: AuthPage,
});

const plansRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/plans',
  component: PlansPage,
});

const paymentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment',
  component: PaymentPage,
});

const panelRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/panel',
  component: PanelPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  plansRoute,
  paymentRoute,
  panelRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
