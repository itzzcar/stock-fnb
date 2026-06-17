import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../services/productService';

// Centraliza el acceso a productos con caché, estados de carga y error (react-query).
export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: productService.list,
  });
}

// Devuelve mutaciones que invalidan la caché al terminar para refrescar la lista.
export function useProductMutations() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ['products'] });

  const create = useMutation({ mutationFn: productService.create, onSuccess: invalidate });
  const update = useMutation({
    mutationFn: ({ id, data }) => productService.update(id, data),
    onSuccess: invalidate,
  });
  const adjust = useMutation({
    mutationFn: ({ id, delta }) => productService.adjustStock(id, delta),
    onSuccess: invalidate,
  });
  const remove = useMutation({ mutationFn: productService.remove, onSuccess: invalidate });

  return { create, update, adjust, remove };
}
