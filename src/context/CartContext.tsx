import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAddToCartMutation, useRemoveFromCartMutation, useGetCartItemsQuery } from '../Services/apiCart';
import type { CartItemDto, CartItemRequestDto } from '../Services/types';
import { selectCurrentUser } from '../Store/authSlice';

interface CartContextValue {
  cartItems: CartItemDto[];
  addToCart: (item: CartItemRequestDto) => Promise<void>;
  removeFromCart: (id: number) => Promise<void>;
  syncGuestToServer: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = !!user?.token;

  const [guestCart, setGuestCart] = useState<CartItemDto[]>([]);
  const localKey = 'guest_cart';

  const { data: serverCart = [], refetch } = useGetCartItemsQuery(undefined, {
    skip: !isAuthenticated,
  });

  const [addToCartApi] = useAddToCartMutation();
  const [removeFromCartApi] = useRemoveFromCartMutation();

  const cartItems = isAuthenticated ? serverCart : guestCart;

  useEffect(() => {
    if (!isAuthenticated) {
      const local = JSON.parse(localStorage.getItem(localKey) || '[]');
      setGuestCart(local);
    }
    else{
      syncGuestToServer();
    }
  }, [isAuthenticated]);

  const syncGuestToServer = async () => {
    if (!isAuthenticated) return;
    const items = JSON.parse(localStorage.getItem(localKey) || '[]') as CartItemRequestDto[];
    for (const item of items) {
      await addToCartApi(item);
    }
    localStorage.removeItem(localKey);
    refetch();
  };

  const addToCart = async (item: CartItemRequestDto) => {
    if (isAuthenticated) {
      await addToCartApi(item);
      refetch();
    } else {
      const updated = [...guestCart];
      const idx = updated.findIndex(i => i.productVariantId === item.productVariantId);
      if (idx !== -1) {
        updated[idx].quantity += item.quantity;
      } else {
        updated.push({ ...item, price: 0, name: '', categoryId: 0, categoryName: '', imageName: '' } as CartItemDto);
      }
      localStorage.setItem(localKey, JSON.stringify(updated));
      setGuestCart(updated);
    }
  };

  const removeFromCart = async (id: number) => {
    if (isAuthenticated) {
      await removeFromCartApi(id);
      refetch();
    } else {
      const updated = guestCart.filter(i => i.productVariantId !== id);
      localStorage.setItem(localKey, JSON.stringify(updated));
      setGuestCart(updated);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, syncGuestToServer }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextValue => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
