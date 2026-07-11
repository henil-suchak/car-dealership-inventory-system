import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import useDebounce from './useDebounce';

describe('useDebounce', () => {
  it('should return debounced value after delay', async () => {
    vi.useFakeTimers();
    
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'test', delay: 500 } }
    );
    
    expect(result.current).toBe('test');
    
    rerender({ value: 'updated', delay: 500 });
    
    // Value should not update immediately
    expect(result.current).toBe('test');
    
    // Advance timers
    act(() => {
      vi.advanceTimersByTime(500);
    });
    
    // Now it should be updated
    expect(result.current).toBe('updated');
    
    vi.useRealTimers();
  });
});
