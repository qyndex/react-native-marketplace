import { useCartStore, CartItem } from '../store/cartStore';
import type { Product } from '../types/marketplace';

// Reset store state between tests
beforeEach(() => {
  useCartStore.setState({ items: [] });
});

const mockProduct: Product = {
  id: 'p1',
  name: 'Wireless Headphones',
  description: 'Premium over-ear headphones with ANC.',
  price: 79.99,
  category: 'Electronics',
  rating: 4.5,
  reviewCount: 312,
  inStock: true,
};

const mockProduct2: Product = {
  id: 'p2',
  name: 'Running Shoes',
  description: 'Lightweight shoes for long-distance runs.',
  price: 59.99,
  category: 'Sports',
  rating: 4.7,
  reviewCount: 198,
  inStock: true,
};

describe('cartStore', () => {
  describe('addItem', () => {
    it('adds a new product to the cart', () => {
      const { addItem } = useCartStore.getState();
      addItem(mockProduct);

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(1);
      expect(items[0].product.id).toBe('p1');
      expect(items[0].quantity).toBe(1);
    });

    it('increments quantity when adding an existing product', () => {
      const { addItem } = useCartStore.getState();
      addItem(mockProduct);
      addItem(mockProduct);

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(1);
      expect(items[0].quantity).toBe(2);
    });

    it('adds multiple different products', () => {
      const { addItem } = useCartStore.getState();
      addItem(mockProduct);
      addItem(mockProduct2);

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(2);
    });
  });

  describe('removeItem', () => {
    it('removes a product from the cart', () => {
      useCartStore.setState({
        items: [{ product: mockProduct, quantity: 2 }],
      });

      const { removeItem } = useCartStore.getState();
      removeItem('p1');

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(0);
    });

    it('does nothing when removing a non-existent product', () => {
      useCartStore.setState({
        items: [{ product: mockProduct, quantity: 1 }],
      });

      const { removeItem } = useCartStore.getState();
      removeItem('nonexistent');

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(1);
    });
  });

  describe('updateQuantity', () => {
    it('updates the quantity of a cart item', () => {
      useCartStore.setState({
        items: [{ product: mockProduct, quantity: 1 }],
      });

      const { updateQuantity } = useCartStore.getState();
      updateQuantity('p1', 5);

      const { items } = useCartStore.getState();
      expect(items[0].quantity).toBe(5);
    });

    it('removes the item when quantity is set to 0', () => {
      useCartStore.setState({
        items: [{ product: mockProduct, quantity: 3 }],
      });

      const { updateQuantity } = useCartStore.getState();
      updateQuantity('p1', 0);

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(0);
    });

    it('removes the item when quantity is negative', () => {
      useCartStore.setState({
        items: [{ product: mockProduct, quantity: 2 }],
      });

      const { updateQuantity } = useCartStore.getState();
      updateQuantity('p1', -1);

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(0);
    });

    it('does not affect other items', () => {
      useCartStore.setState({
        items: [
          { product: mockProduct, quantity: 1 },
          { product: mockProduct2, quantity: 3 },
        ],
      });

      const { updateQuantity } = useCartStore.getState();
      updateQuantity('p1', 10);

      const { items } = useCartStore.getState();
      expect(items[0].quantity).toBe(10);
      expect(items[1].quantity).toBe(3);
    });
  });

  describe('clearCart', () => {
    it('removes all items from the cart', () => {
      useCartStore.setState({
        items: [
          { product: mockProduct, quantity: 2 },
          { product: mockProduct2, quantity: 1 },
        ],
      });

      const { clearCart } = useCartStore.getState();
      clearCart();

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(0);
    });

    it('is safe to call on an empty cart', () => {
      const { clearCart } = useCartStore.getState();
      clearCart();

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(0);
    });
  });

  describe('totalItems', () => {
    it('returns 0 for an empty cart', () => {
      const { totalItems } = useCartStore.getState();
      expect(totalItems()).toBe(0);
    });

    it('sums quantities across all items', () => {
      useCartStore.setState({
        items: [
          { product: mockProduct, quantity: 2 },
          { product: mockProduct2, quantity: 3 },
        ],
      });

      const { totalItems } = useCartStore.getState();
      expect(totalItems()).toBe(5);
    });
  });

  describe('totalPrice', () => {
    it('returns 0 for an empty cart', () => {
      const { totalPrice } = useCartStore.getState();
      expect(totalPrice()).toBe(0);
    });

    it('calculates the total price correctly', () => {
      useCartStore.setState({
        items: [
          { product: mockProduct, quantity: 2 },   // 79.99 * 2 = 159.98
          { product: mockProduct2, quantity: 1 },   // 59.99 * 1 = 59.99
        ],
      });

      const { totalPrice } = useCartStore.getState();
      expect(totalPrice()).toBeCloseTo(219.97, 2);
    });

    it('reflects quantity changes', () => {
      useCartStore.setState({
        items: [{ product: mockProduct, quantity: 1 }],
      });

      expect(useCartStore.getState().totalPrice()).toBeCloseTo(79.99, 2);

      useCartStore.getState().updateQuantity('p1', 3);
      expect(useCartStore.getState().totalPrice()).toBeCloseTo(239.97, 2);
    });
  });
});
