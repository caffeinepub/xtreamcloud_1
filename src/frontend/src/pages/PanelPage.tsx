import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useOrderStore } from '../state/orderStore';
import { useGetPurchasedPlan } from '../hooks/useQueries';
import { Loader2, Server, Cpu, HardDrive, Shield, Activity } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function PanelPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { paymentCompleted, selectedPlan } = useOrderStore();
  const { data: purchasedPlan, isLoading, error } = useGetPurchasedPlan();

  useEffect(() => {
    if (!identity) {
      navigate({ to: '/' });
    } else if (!paymentCompleted && !purchasedPlan) {
      navigate({ to: '/plans' });
    }
  }, [identity, paymentCompleted, purchasedPlan, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const activePlan = purchasedPlan || selectedPlan;

  if (!activePlan) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>
            No active plan found. Please purchase a plan first.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Parse resource values
  const ramValue = parseInt(activePlan.ram) || 0;
  const storageValue = parseInt(activePlan.storage) || 0;
  const cpuValue = activePlan.cpu.includes('Unlimited') ? 100 : parseInt(activePlan.cpu) || 0;

  // Simulated usage (30-70% of allocated)
  const ramUsage = Math.floor(ramValue * (0.3 + Math.random() * 0.4));
  const storageUsage = Math.floor(storageValue * (0.3 + Math.random() * 0.4));
  const cpuUsage = Math.floor(cpuValue * (0.3 + Math.random() * 0.4));

  return (
    <div className="min-h-[calc(100vh-200px)] py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold minecraft-text">Hosting Panel</h1>
              <p className="text-muted-foreground mt-2">Manage your Minecraft server</p>
            </div>
            <Badge className="text-lg px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-900">
              {activePlan.name} Plan
            </Badge>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card className="minecraft-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5 text-primary" />
                Server Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status:</span>
                <Badge className="bg-green-600">Online</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Uptime:</span>
                <span className="font-medium">99.9%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Players:</span>
                <span className="font-medium">0 / 100</span>
              </div>
            </CardContent>
          </Card>

          <Card className="minecraft-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Protection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">DDoS Protection:</span>
                <Badge variant="outline">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Firewall:</span>
                <Badge variant="outline">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Backups:</span>
                <Badge variant="outline">Daily</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="minecraft-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Resource Usage
            </CardTitle>
            <CardDescription>Real-time monitoring of your server resources</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Server className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">RAM Usage</span>
                </div>
                <span className="text-muted-foreground">
                  {ramUsage} GB / {ramValue} GB
                </span>
              </div>
              <Progress value={(ramUsage / ramValue) * 100} className="h-2" />
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">CPU Usage</span>
                </div>
                <span className="text-muted-foreground">
                  {cpuUsage}% / {activePlan.cpu}
                </span>
              </div>
              <Progress value={cpuUsage} className="h-2" />
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <HardDrive className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Storage Usage</span>
                </div>
                <span className="text-muted-foreground">
                  {storageUsage} GB / {storageValue} GB
                </span>
              </div>
              <Progress value={(storageUsage / storageValue) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="minecraft-card">
          <CardHeader>
            <CardTitle>Process Information</CardTitle>
            <CardDescription>Active server processes and services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Minecraft Server</p>
                  <p className="text-xs text-muted-foreground">minecraft-server.jar</p>
                </div>
                <Badge className="bg-green-600">Running</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Database Service</p>
                  <p className="text-xs text-muted-foreground">mysql-server</p>
                </div>
                <Badge className="bg-green-600">Running</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Backup Service</p>
                  <p className="text-xs text-muted-foreground">backup-daemon</p>
                </div>
                <Badge className="bg-green-600">Running</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
