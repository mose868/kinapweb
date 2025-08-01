// Performance monitoring and throttling utilities to prevent IPC flooding

interface ThrottleOptions {
  delay: number;
  leading?: boolean;
  trailing?: boolean;
}

class PerformanceMonitor {
  private requestCount = 0;
  private navigationCount = 0;
  private lastReset = Date.now();
  private readonly RESET_INTERVAL = 60000; // 1 minute

  incrementRequest() {
    this.requestCount++;
    this.checkLimits();
  }

  incrementNavigation() {
    this.navigationCount++;
    this.checkLimits();
  }

  private checkLimits() {
    const now = Date.now();
    if (now - this.lastReset > this.RESET_INTERVAL) {
      this.reset();
      return;
    }

    // Only warn, don't block operations
    if (this.requestCount > 200) {
      console.warn('High request rate detected. Consider implementing request batching.');
    }

    if (this.navigationCount > 20) {
      console.warn('High navigation rate detected. Consider implementing navigation throttling.');
    }
  }

  private reset() {
    this.requestCount = 0;
    this.navigationCount = 0;
    this.lastReset = Date.now();
  }

  getMetrics() {
    return {
      requestCount: this.requestCount,
      navigationCount: this.navigationCount,
      timeSinceReset: Date.now() - this.lastReset,
    };
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Throttle function to limit function execution frequency
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
  options: ThrottleOptions = { delay, leading: true, trailing: true }
): T {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastExecTime = 0;

  return ((...args: any[]) => {
    const now = Date.now();

    if (lastExecTime && now < lastExecTime + delay) {
      // Throttled
      if (options.trailing) {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          lastExecTime = now;
          func(...args);
        }, delay - (now - lastExecTime));
      }
    } else {
      // Execute immediately
      if (options.leading) {
        lastExecTime = now;
        func(...args);
      }
    }
  }) as T;
}

// Debounce function to delay execution until after a pause
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T {
  let timeoutId: NodeJS.Timeout | null = null;

  return ((...args: any[]) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  }) as T;
}

// Gentle navigation monitoring (no blocking)
export function monitorNavigation(callback: () => void) {
  performanceMonitor.incrementNavigation();
  callback();
}

// Gentle request monitoring (no blocking)
export function monitorRequest<T extends (...args: any[]) => Promise<any>>(
  requestFn: T
): T {
  return ((...args: any[]) => {
    performanceMonitor.incrementRequest();
    return requestFn(...args);
  }) as T;
} 