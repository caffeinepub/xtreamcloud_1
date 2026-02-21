import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useOrderStore } from '../state/orderStore';
import { generateUPIString } from '../utils/upi';
import QRCode from '../components/QRCode';
import { usePurchasePlan } from '../hooks/useQueries';
import { Loader2, CheckCircle2 } from 'lucide-react';

type PaymentMethod = 'phonepe' | 'googlepay' | 'paytm' | 'upi';

export default function PaymentPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { selectedPlan, setPaymentCompleted } = useOrderStore();
  const purchasePlan = usePurchasePlan();
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [showQR, setShowQR] = useState(false);
  const [upiString, setUpiString] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!identity) {
      navigate({ to: '/' });
    } else if (!selectedPlan) {
      navigate({ to: '/plans' });
    }
  }, [identity, selectedPlan, navigate]);

  if (!selectedPlan) {
    return null;
  }

  const handlePay = () => {
    setError('');
    const upi = generateUPIString(selectedPlan, paymentMethod);
    setUpiString(upi);
    setShowQR(true);
  };

  const handleConfirmPayment = async () => {
    try {
      setError('');
      
      // Convert plan to backend HostingPackage format
      const hostingPackage = {
        name: selectedPlan.name,
        cpu: selectedPlan.cpu,
        ram: selectedPlan.ram,
        storage: selectedPlan.storage,
        lifetime: { oneYear: null } as any,
        websites: BigInt(1),
      };

      await purchasePlan.mutateAsync(hostingPackage);
      setPaymentCompleted(true);
      navigate({ to: '/panel' });
    } catch (err: any) {
      setError(err.message || 'Failed to confirm payment');
    }
  };

  const priceValue = selectedPlan.price.replace('₹', '');

  return (
    <div className="min-h-[calc(100vh-200px)] py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 minecraft-text">Complete Payment</h1>
          <p className="text-muted-foreground">Secure your {selectedPlan.name} plan</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="minecraft-card">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-bold text-xl minecraft-text">{selectedPlan.name} Plan</h3>
                <p className="text-2xl font-bold text-primary mt-2">{selectedPlan.price}/month</p>
              </div>
              <Separator />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">RAM:</span>
                  <span className="font-medium">{selectedPlan.ram}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">CPU:</span>
                  <span className="font-medium">{selectedPlan.cpu}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Storage:</span>
                  <span className="font-medium">{selectedPlan.storage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Protection:</span>
                  <span className="font-medium">{selectedPlan.ddos}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="minecraft-card">
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>Choose your preferred payment option</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {!showQR ? (
                <>
                  <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="phonepe" id="phonepe" />
                      <Label htmlFor="phonepe" className="cursor-pointer">PhonePe</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="googlepay" id="googlepay" />
                      <Label htmlFor="googlepay" className="cursor-pointer">Google Pay</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="paytm" id="paytm" />
                      <Label htmlFor="paytm" className="cursor-pointer">Paytm</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="upi" id="upi" />
                      <Label htmlFor="upi" className="cursor-pointer">UPI</Label>
                    </div>
                  </RadioGroup>
                  <Button onClick={handlePay} className="w-full minecraft-button">
                    Proceed to Pay
                  </Button>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <QRCode value={upiString} size={200} />
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <Label className="text-muted-foreground">UPI ID:</Label>
                      <p className="font-mono text-xs break-all bg-muted p-2 rounded mt-1">
                        xtreamcloud@upi
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Amount:</Label>
                      <p className="font-bold text-lg">{selectedPlan.price}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Payment String:</Label>
                      <p className="font-mono text-xs break-all bg-muted p-2 rounded mt-1">
                        {upiString}
                      </p>
                    </div>
                  </div>
                  <Alert>
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>
                      Scan the QR code or use the UPI ID to complete payment
                    </AlertDescription>
                  </Alert>
                  <Button 
                    onClick={handleConfirmPayment} 
                    className="w-full minecraft-button"
                    disabled={purchasePlan.isPending}
                  >
                    {purchasePlan.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    I've Completed Payment
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
