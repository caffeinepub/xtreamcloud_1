import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { HostingPackage } from '../backend';

interface UserProfile {
  id: string;
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const accounts = await actor.getAllAccounts();
      if (accounts.length > 0) {
        return { id: accounts[0].id };
      }
      return null;
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      // The backend doesn't have a direct method to save profile,
      // but we can use the authorization system which creates an account
      // This is a workaround - in production you'd want a dedicated method
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetPurchasedPlan() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<HostingPackage | null>({
    queryKey: ['purchasedPlan'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return await actor.getPurchasedPlan();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function usePurchasePlan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (plan: HostingPackage) => {
      if (!actor) throw new Error('Actor not available');
      await actor.purchasePlan(plan);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchasedPlan'] });
    },
  });
}
