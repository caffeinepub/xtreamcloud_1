import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { useOrderStore } from '../state/orderStore';
import { useEffect } from 'react';

const plans = [
  {
    name: 'HEXO',
    price: '₹80',
    period: '/MONTH',
    ram: '6 GB RAM',
    cpu: '200% CPU',
    storage: '12 GB NVMe SSD',
    ddos: 'Basic DDoS Protection',
    color: 'from-purple-600 to-purple-800',
  },
  {
    name: 'METEOR',
    price: '₹280',
    period: '/MONTH',
    ram: '12 GB RAM',
    cpu: '300% CPU',
    storage: '24 GB NVMe SSD',
    ddos: 'Basic DDoS Protection',
    color: 'from-purple-700 to-purple-900',
    popular: true,
  },
  {
    name: 'DOOMSDAY',
    price: '₹850',
    period: '/MONTH',
    ram: '32 GB RAM',
    cpu: 'Unlimited CPU',
    storage: '64 GB NVMe SSD',
    ddos: 'Basic DDoS Protection',
    color: 'from-purple-800 to-black',
  },
  {
    name: 'XTREME',
    price: '₹950',
    period: '/MONTH',
    ram: '64 GB RAM',
    cpu: 'Unlimited CPU',
    storage: '96 GB NVMe SSD',
    ddos: 'Basic DDoS Protection',
    color: 'from-purple-900 to-black',
    premium: true,
  },
];

export default function PlansPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { setSelectedPlan } = useOrderStore();

  useEffect(() => {
    if (!identity) {
      navigate({ to: '/' });
    }
  }, [identity, navigate]);

  const handleOrderNow = (plan: typeof plans[0]) => {
    setSelectedPlan(plan);
    navigate({ to: '/payment' });
  };

  return (
    <div className="min-h-[calc(100vh-200px)] py-12 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 minecraft-text">
            Choose Your Plan
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select the perfect hosting plan for your Minecraft server. All plans include premium features and 24/7 support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.name} 
              className={`minecraft-card relative overflow-hidden ${
                plan.popular || plan.premium ? 'border-primary shadow-lg shadow-primary/20' : ''
              }`}
            >
              {plan.popular && (
                <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                  Popular
                </Badge>
              )}
              {plan.premium && (
                <Badge className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-purple-900 text-white">
                  Premium
                </Badge>
              )}
              <CardHeader>
                <div className={`w-full h-2 rounded-full bg-gradient-to-r ${plan.color} mb-4`} />
                <CardTitle className="text-2xl minecraft-text">{plan.name}</CardTitle>
                <CardDescription className="text-3xl font-bold text-foreground mt-2">
                  {plan.price}
                  <span className="text-sm font-normal text-muted-foreground">{plan.period}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{plan.ram}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{plan.cpu}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{plan.storage}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{plan.ddos}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => handleOrderNow(plan)}
                  className="w-full minecraft-button"
                  variant={plan.popular || plan.premium ? 'default' : 'outline'}
                >
                  ORDER NOW
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
