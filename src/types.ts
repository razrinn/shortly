import { DrizzleD1Database } from 'drizzle-orm/d1';

interface Bindings {
  ADMIN_USERNAME: string;
  ADMIN_PASSWORD: string;
  KV_STORE: KVNamespace;
  DB: D1Database;
}

export interface HonoApp {
  Bindings: Bindings;
  Variables: {
    db: DrizzleD1Database;
  };
}

export interface UrlRow {
  shortUrl: string;
  originalUrl: string;
  clicksCount: number;
}
