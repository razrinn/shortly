import { Hono } from 'hono';

interface Bindings {
  ADMIN_USERNAME: string;
  ADMIN_PASSWORD: string;
  KV_STORE: KVNamespace;
  DB: D1Database;
}

const app = new Hono<{ Bindings: Bindings }>();

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

export default app;
