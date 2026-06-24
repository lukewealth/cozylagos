import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

export function useListings() {
  return useQuery({
    queryKey: ['listings'],
    queryFn: () => api.get('/listings'),
  });
}

export function useListing(id: string) {
  return useQuery({
    queryKey: ['listing', id],
    queryFn: () => api.get(`/listings/${id}`),
    enabled: !!id,
  });
}

export function useBookings() {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: () => api.get('/bookings'),
  });
}

export function useUserBookings(userId: string) {
  return useQuery({
    queryKey: ['bookings', 'user', userId],
    queryFn: () => api.get(`/bookings/user/${userId}`),
    enabled: !!userId,
  });
}

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => api.get('/users'),
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => api.get(`/users/${id}`),
    enabled: !!id,
  });
}

export function useCreateListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => api.post('/listings', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });
}

export function useUpdateListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      api.put(`/listings/${id}`, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['listing', id] });
    },
  });
}

export function useDeleteListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/listings/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => api.post('/bookings', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/bookings/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}

export function useHealth() {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => api.get('/health'),
    refetchInterval: 1000 * 60,
  });
}
