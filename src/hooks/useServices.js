import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiService from '../services/apiService';

// Fetch all services
export const useServices = () => {
  return useQuery({
    queryKey: ['services'],
    queryFn: () => apiService.get('/services'),
    onError: (error) => {
      console.error('Failed to fetch services:', error);
    }
  });
};

// Fetch single service by slug
export const useServiceBySlug = (slug) => {
  return useQuery({
    queryKey: ['service', slug],
    queryFn: () => apiService.get(`/services/${slug}`),
    enabled: !!slug,
    onError: (error) => {
      console.error(`Failed to fetch service ${slug}:`, error);
    }
  });
};

// Create a new service
export const useCreateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newService) => apiService.post('/services', newService),
    onSuccess: () => {
      // Invalidate and refetch services query
      queryClient.invalidateQueries(['services']);
    },
    onError: (error) => {
      console.error('Service creation failed:', error);
    }
  });
};

// Update a service
export const useUpdateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, updatedService }) => 
      apiService.put(`/services/${slug}`, updatedService),
    onSuccess: (_, variables) => {
      // Invalidate specific service and services list
      queryClient.invalidateQueries(['services']);
      queryClient.invalidateQueries(['service', variables.slug]);
    },
    onError: (error) => {
      console.error('Service update failed:', error);
    }
  });
};

// Delete a service
export const useDeleteService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug) => apiService.delete(`/services/${slug}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['services']);
    },
    onError: (error) => {
      console.error('Service deletion failed:', error);
    }
  });
};
