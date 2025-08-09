// Performance monitoring and optimization utilities

export class PerformanceMonitor {
  static measureApiCall(name, fn) {
    return async (...args) => {
      const start = performance.now();
      try {
        const result = await fn(...args);
        const duration = performance.now() - start;
        
        if (duration > 5000) { // Warn for calls > 5 seconds
          console.warn(`Slow API call detected: ${name} took ${duration.toFixed(2)}ms`);
        }
        
        return result;
      } catch (error) {
        const duration = performance.now() - start;
        console.error(`API call failed: ${name} after ${duration.toFixed(2)}ms`, error);
        throw error;
      }
    };
  }
  
  static measureRender(componentName) {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      if (duration > 100) { // Warn for renders > 100ms
        console.warn(`Slow render detected: ${componentName} took ${duration.toFixed(2)}ms`);
      }
    };
  }
}
