import { renderHook } from '@testing-library/react-native';
import { Appearance } from 'react-native';
import { useColorScheme } from '../hooks/useColorScheme';

describe('useColorScheme', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns a valid color scheme string', () => {
    const { result } = renderHook(() => useColorScheme());
    expect(['light', 'dark']).toContain(result.current);
  });

  it('defaults to "light" in test environment', () => {
    // In Jest, Appearance.getColorScheme() returns null
    // Our hook should fallback to 'light'
    const { result } = renderHook(() => useColorScheme());
    expect(result.current).toBe('light');
  });

  it('is exported as a named function', () => {
    expect(typeof useColorScheme).toBe('function');
    expect(useColorScheme.name).toBe('useColorScheme');
  });

  it('returns only "light" or "dark", never null or undefined', () => {
    const { result } = renderHook(() => useColorScheme());
    expect(result.current).not.toBeNull();
    expect(result.current).not.toBeUndefined();
    expect(result.current === 'light' || result.current === 'dark').toBe(true);
  });
});
