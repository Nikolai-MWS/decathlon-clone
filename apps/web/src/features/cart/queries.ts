import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type CartDto } from '@decathlon/shared';
import { apiClient } from '../../lib/apiClient';

const CART_KEY = ['cart'];

export function useCart() {
  return useQuery({ queryKey: CART_KEY, queryFn: apiClient.getCart });
}

export function useAddToCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ skuId, quantity }: { skuId: string; quantity: number }) =>
      apiClient.addCartItem(skuId, quantity),
    onSuccess: (cart: CartDto) => qc.setQueryData(CART_KEY, cart),
  });
}

export function useUpdateCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      apiClient.updateCartItem(itemId, quantity),
    onSuccess: (cart: CartDto) => qc.setQueryData(CART_KEY, cart),
  });
}

export function useRemoveCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) => apiClient.removeCartItem(itemId),
    onSuccess: (cart: CartDto) => qc.setQueryData(CART_KEY, cart),
  });
}
