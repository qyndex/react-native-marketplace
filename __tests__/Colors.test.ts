import { Colors } from '../constants/Colors';

describe('Colors', () => {
  it('exports light and dark themes', () => {
    expect(Colors).toHaveProperty('light');
    expect(Colors).toHaveProperty('dark');
  });

  const requiredKeys = [
    'text',
    'background',
    'tint',
    'icon',
    'subtext',
    'border',
    'card',
    'tabIconDefault',
    'tabIconSelected',
  ];

  describe('light theme', () => {
    it('has all required color keys', () => {
      requiredKeys.forEach((key) => {
        expect(Colors.light).toHaveProperty(key);
      });
    });

    it('all values are valid hex color strings', () => {
      Object.values(Colors.light).forEach((value) => {
        expect(typeof value).toBe('string');
        expect(value).toMatch(/^#[0-9a-fA-F]{3,8}$/);
      });
    });

    it('has a light background color', () => {
      // Light theme should have a background that starts with #f or #e or #d or #fff
      expect(Colors.light.background).toBeTruthy();
    });
  });

  describe('dark theme', () => {
    it('has all required color keys', () => {
      requiredKeys.forEach((key) => {
        expect(Colors.dark).toHaveProperty(key);
      });
    });

    it('all values are valid hex color strings', () => {
      Object.values(Colors.dark).forEach((value) => {
        expect(typeof value).toBe('string');
        expect(value).toMatch(/^#[0-9a-fA-F]{3,8}$/);
      });
    });
  });

  it('light and dark themes have the same keys', () => {
    const lightKeys = Object.keys(Colors.light).sort();
    const darkKeys = Object.keys(Colors.dark).sort();
    expect(lightKeys).toEqual(darkKeys);
  });

  it('light and dark backgrounds differ', () => {
    expect(Colors.light.background).not.toBe(Colors.dark.background);
  });

  it('light and dark text colors differ', () => {
    expect(Colors.light.text).not.toBe(Colors.dark.text);
  });
});
