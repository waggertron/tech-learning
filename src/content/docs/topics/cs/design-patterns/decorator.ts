interface DataService {
  fetchData(key: string): string;
}

class RealDataService implements DataService {
  fetchData(key: string): string {
    console.log(`  [DB] Fetching key: ${key}`);
    return `value_for_${key}`;
  }
}

class LoggerDecorator implements DataService {
  constructor(private wrapped: DataService) {}

  fetchData(key: string): string {
    console.log(`[LOG] fetchData called with key="${key}"`);
    const result = this.wrapped.fetchData(key);
    console.log(`[LOG] fetchData returned "${result}"`);
    return result;
  }
}

class CacheDecorator implements DataService {
  private cache = new Map<string, string>();

  constructor(private wrapped: DataService) {}

  fetchData(key: string): string {
    if (this.cache.has(key)) {
      console.log(`[CACHE] hit for "${key}"`);
      return this.cache.get(key)!;
    }
    const result = this.wrapped.fetchData(key);
    this.cache.set(key, result);
    console.log(`[CACHE] stored "${key}"`);
    return result;
  }
}

// Stack: Cache wraps Logger wraps Real
const service: DataService = new CacheDecorator(
  new LoggerDecorator(
    new RealDataService()
  )
);

console.log('--- First call ---');
service.fetchData('user:42');
// [LOG] fetchData called with key="user:42"
//   [DB] Fetching key: user:42
// [LOG] fetchData returned "value_for_user:42"
// [CACHE] stored "user:42"

console.log('--- Second call (cache hit) ---');
service.fetchData('user:42');
// [CACHE] hit for "user:42"
