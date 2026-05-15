import { create } from "zustand";

export interface CartItem {
  item_id: string;
  item_name: string;
  price: number;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (item_id: string) => void;
  updateQuantity: (item_id: string, quantity: number) => void;
  clearCart: () => void;
  totalPrice: () => number;
  totalItems: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem: (item) => {
    const existing = get().items.find((i) => i.item_id === item.item_id);
    if (existing) {
      set((state) => ({
        items: state.items.map((i) =>
          i.item_id === item.item_id
            ? { ...i, quantity: i.quantity + (item.quantity || 1) }
            : i
        ),
      }));
    } else {
      set((state) => ({
        items: [...state.items, { ...item, quantity: item.quantity || 1 }],
      }));
    }
  },

  removeItem: (item_id) => {
    set((state) => ({
      items: state.items.filter((i) => i.item_id !== item_id),
    }));
  },

  updateQuantity: (item_id, quantity) => {
    if (quantity <= 0) {
      get().removeItem(item_id);
      return;
    }
    set((state) => ({
      items: state.items.map((i) =>
        i.item_id === item_id ? { ...i, quantity } : i
      ),
    }));
  },

  clearCart: () => set({ items: [] }),

  totalPrice: () => {
    return get().items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  },

  totalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },
}));
