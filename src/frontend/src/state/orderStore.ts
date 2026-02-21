import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Plan {
  name: string;
  price: string;
  period: string;
  ram: string;
  cpu: string;
  storage: string;
  ddos: string;
}

interface OrderState {
  selectedPlan: Plan | null;
  paymentCompleted: boolean;
  setSelectedPlan: (plan: Plan) => void;
  setPaymentCompleted: (completed: boolean) => void;
  clearOrder: () => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      selectedPlan: null,
      paymentCompleted: false,
      setSelectedPlan: (plan) => set({ selectedPlan: plan }),
      setPaymentCompleted: (completed) => set({ paymentCompleted: completed }),
      clearOrder: () => set({ selectedPlan: null, paymentCompleted: false }),
    }),
    {
      name: 'xtreamcloud-order',
    }
  )
);
