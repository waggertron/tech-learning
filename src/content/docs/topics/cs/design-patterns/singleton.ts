// Approach 1: classic GoF Singleton
class AppConfig {
  private static instance: AppConfig | null = null;
  private settings = new Map<string, string>();

  private constructor() {
    // Load from environment at construction time.
    this.settings.set('env', process.env.NODE_ENV ?? 'development');
    this.settings.set('port', process.env.PORT ?? '3000');
  }

  static getInstance(): AppConfig {
    if (!AppConfig.instance) {
      AppConfig.instance = new AppConfig();
    }
    return AppConfig.instance;
  }

  get(key: string): string | undefined {
    return this.settings.get(key);
  }

  set(key: string, value: string): void {
    this.settings.set(key, value);
  }
}

const config1 = AppConfig.getInstance();
const config2 = AppConfig.getInstance();
console.log(config1 === config2); // true

config1.set('feature_x', 'enabled');
console.log(config2.get('feature_x')); // enabled

// Approach 2: module-level instance (idiomatic TypeScript/Node.js)
class Config {
  private settings = new Map<string, string>();

  get(key: string): string | undefined {
    return this.settings.get(key);
  }

  set(key: string, value: string): void {
    this.settings.set(key, value);
  }
}

export const config = new Config();
// Node.js loads each module once and caches it.
// Every import of this module receives the same `config` object.
