import { listingToProduct, CATEGORIES } from '../types/marketplace';
import type { Listing } from '../types/marketplace';

describe('listingToProduct', () => {
  const mockListing: Listing = {
    id: 'abc-123',
    seller_id: 'seller-001',
    title: 'Vintage Lamp',
    description: 'Beautiful brass lamp from the 1940s.',
    price: 120.0,
    category: 'Home',
    image_urls: ['https://example.com/lamp.jpg'],
    status: 'active',
    created_at: '2024-01-15T10:00:00Z',
  };

  it('maps listing title to product name', () => {
    const product = listingToProduct(mockListing);
    expect(product.name).toBe('Vintage Lamp');
  });

  it('preserves price as a number', () => {
    const product = listingToProduct(mockListing);
    expect(product.price).toBe(120.0);
    expect(typeof product.price).toBe('number');
  });

  it('sets inStock to true for active listings', () => {
    const product = listingToProduct(mockListing);
    expect(product.inStock).toBe(true);
  });

  it('sets inStock to false for sold listings', () => {
    const soldListing: Listing = { ...mockListing, status: 'sold' };
    const product = listingToProduct(soldListing);
    expect(product.inStock).toBe(false);
  });

  it('sets rating and reviewCount to 0', () => {
    const product = listingToProduct(mockListing);
    expect(product.rating).toBe(0);
    expect(product.reviewCount).toBe(0);
  });

  it('preserves id, description, and category', () => {
    const product = listingToProduct(mockListing);
    expect(product.id).toBe('abc-123');
    expect(product.description).toBe('Beautiful brass lamp from the 1940s.');
    expect(product.category).toBe('Home');
  });
});

describe('CATEGORIES', () => {
  it('includes All as the first category', () => {
    expect(CATEGORIES[0]).toBe('All');
  });

  it('includes standard marketplace categories', () => {
    expect(CATEGORIES).toContain('Electronics');
    expect(CATEGORIES).toContain('Clothing');
    expect(CATEGORIES).toContain('Home');
    expect(CATEGORIES).toContain('Sports');
  });

  it('has no duplicate entries', () => {
    const unique = new Set(CATEGORIES);
    expect(unique.size).toBe(CATEGORIES.length);
  });
});
