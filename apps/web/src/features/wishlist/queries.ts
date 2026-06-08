import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type ProductCardDto } from '@decathlon/shared';
import { apiClient } from '../../lib/apiClient';

const KEY = ['wishlist'];

export function useWishlist() {
  return useQuery({ queryKey: KEY, queryFn: apiClient.getWishlist });
}

export function useToggleWishlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, inList }: { productId: string; inList: boolean }) =>
      inList ? apiClient.removeFromWishlist(productId) : apiClient.addToWishlist(productId),
    onSuccess: (items: ProductCardDto[]) => qc.setQueryData(KEY, items),
  });
}
