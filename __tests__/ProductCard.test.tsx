import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ProductCard } from '../components/ProductCard';
import type { Product } from '../types/marketplace';

// Mock the hooks and constants used by ProductCard
jest.mock('../hooks/useColorScheme', () => ({
  useColorScheme: () => 'light',
}));

jest.mock('../constants/Colors', () => ({
  Colors: {
    light: {
      text: '#1c1917',
      background: '#fff7ed',
      tint: '#f97316',
      icon: '#78716c',
      subtext: '#a8a29e',
      border: '#e7e5e4',
      card: '#ffffff',
    },
    dark: {
      text: '#fafaf9',
      background: '#1c1917',
      tint: '#fb923c',
      icon: '#a8a29e',
      subtext: '#78716c',
      border: '#292524',
      card: '#292524',
    },
  },
}));

const inStockProduct: Product = {
  id: 'p1',
  name: 'Wireless Headphones',
  description: 'Premium over-ear headphones with ANC.',
  price: 79.99,
  category: 'Electronics',
  rating: 4.5,
  reviewCount: 312,
  inStock: true,
};

const outOfStockProduct: Product = {
  id: 'p4',
  name: 'Cotton Crew T-Shirt',
  description: '100% organic cotton, pre-shrunk.',
  price: 19.99,
  category: 'Clothing',
  rating: 4.6,
  reviewCount: 421,
  inStock: false,
};

describe('ProductCard', () => {
  const mockOnPress = jest.fn();
  const mockOnAddToCart = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders product name', () => {
    const { getByText } = render(
      <ProductCard
        product={inStockProduct}
        onPress={mockOnPress}
        onAddToCart={mockOnAddToCart}
      />
    );

    expect(getByText('Wireless Headphones')).toBeTruthy();
  });

  it('renders formatted price', () => {
    const { getByText } = render(
      <ProductCard
        product={inStockProduct}
        onPress={mockOnPress}
        onAddToCart={mockOnAddToCart}
      />
    );

    expect(getByText('$79.99')).toBeTruthy();
  });

  it('renders rating and review count', () => {
    const { getByText } = render(
      <ProductCard
        product={inStockProduct}
        onPress={mockOnPress}
        onAddToCart={mockOnAddToCart}
      />
    );

    expect(getByText('4.5 (312)')).toBeTruthy();
  });

  it('has accessible label with name and price', () => {
    const { getByLabelText } = render(
      <ProductCard
        product={inStockProduct}
        onPress={mockOnPress}
        onAddToCart={mockOnAddToCart}
      />
    );

    expect(getByLabelText('Wireless Headphones, $79.99')).toBeTruthy();
  });

  it('calls onPress when card is tapped', () => {
    const { getByLabelText } = render(
      <ProductCard
        product={inStockProduct}
        onPress={mockOnPress}
        onAddToCart={mockOnAddToCart}
      />
    );

    fireEvent.press(getByLabelText('Wireless Headphones, $79.99'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('calls onAddToCart when add button is pressed for in-stock product', () => {
    const { getByLabelText } = render(
      <ProductCard
        product={inStockProduct}
        onPress={mockOnPress}
        onAddToCart={mockOnAddToCart}
      />
    );

    fireEvent.press(getByLabelText('Add Wireless Headphones to cart'));
    expect(mockOnAddToCart).toHaveBeenCalledTimes(1);
  });

  it('shows out of stock text for unavailable products', () => {
    const { getByText } = render(
      <ProductCard
        product={outOfStockProduct}
        onPress={mockOnPress}
        onAddToCart={mockOnAddToCart}
      />
    );

    expect(getByText('Out of stock')).toBeTruthy();
  });

  it('has "Out of stock" accessibility label when product is unavailable', () => {
    const { getByLabelText } = render(
      <ProductCard
        product={outOfStockProduct}
        onPress={mockOnPress}
        onAddToCart={mockOnAddToCart}
      />
    );

    expect(getByLabelText('Out of stock')).toBeTruthy();
  });

  it('renders different price formats correctly', () => {
    const cheapProduct: Product = {
      ...inStockProduct,
      id: 'p-cheap',
      price: 5.0,
    };

    const { getByText } = render(
      <ProductCard
        product={cheapProduct}
        onPress={mockOnPress}
        onAddToCart={mockOnAddToCart}
      />
    );

    expect(getByText('$5.00')).toBeTruthy();
  });
});
