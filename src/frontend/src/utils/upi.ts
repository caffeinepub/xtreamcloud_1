interface Plan {
  name: string;
  price: string;
}

export function generateUPIString(plan: Plan, paymentMethod: string): string {
  const upiId = 'xtreamcloud@upi';
  const amount = plan.price.replace('₹', '');
  const name = 'XtreamCloud';
  const note = `${plan.name} Plan - XtreamCloud Hosting`;
  
  return `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
}
