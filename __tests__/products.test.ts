import { MOCK_PRODUCTS } from '../data/products';
import type { Product } from '../types/marketplace';

describe('MOCK_PRODUCTS', () => {
  it('exports an array of products', () => {
    expect(Array.isArray(MOCK_PRODUCTS)).toBe(true);
    expect(MOCK_PRODUCTS.length).toBeGreaterThan(0);
  });

  it('each product has all required fields', () => {
    const requiredKeys: (keyof Product)[] = [
      'id',
      'name',
      'description',
      'price',
      'category',
      'rating',
      'reviewCount',
      'inStock',
    ];

    MOCK_PRODUCTS.forEach((product) => {
      requiredKeys.forEach((key) => {
        expect(product).toHaveProperty(key);
      });
    });
  });

  it('all product IDs are unique', () => {
    const ids = MOCK_PRODUCTS.map((p) => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('all prices are positive numbers', () => {
    MOCK_PRODUCTS.forEach((product) => {
      expect(typeof product.price).toBe('number');
      expect(product.price).toBeGreaterThan(0);
    });
  });

  it('all ratings are between 0 and 5', () => {
    MOCK_PRODUCTS.forEach((product) => {
      expect(product.rating).toBeGreaterThanOrEqual(0);
      expect(product.rating).toBeLessThanOrEqual(5);
    });
  });

  it('all review counts are non-negative integers', () => {
    MOCK_PRODUCTS.forEach((product) => {
      expect(Number.isInteger(product.reviewCount)).toBe(true);
      expect(product.reviewCount).toBeGreaterThanOrEqual(0);
    });
  });

  it('contains products from multiple categories', () => {
    const categories = new Set(MOCK_PRODUCTS.map((p) => p.category));
    expect(categories.size).toBeGreaterThanOrEqual(2);
  });

  it('contains both in-stock and out-of-stock products', () => {
    const hasInStock = MOCK_PRODUCTS.some((p) => p.inStock);
    const hasOutOfStock = MOCK_PRODUCTS.some((p) => !p.inStock);
    expect(hasInStock).toBe(true);
    expect(hasOutOfStock).toBe(true);
  });

  it('product names are non-empty strings', () => {
    MOCK_PRODUCTS.forEach((product) => {
      expect(typeof product.name).toBe('string');
      expect(product.name.trim().length).toBeGreaterThan(0);
    });
  });

  it('product descriptions are non-empty strings', () => {
    MOCK_PRODUCTS.forEach((product) => {
      expect(typeof product.description).toBe('string');
      expect(product.description.trim().length).toBeGreaterThan(0);
    });
  });
});
