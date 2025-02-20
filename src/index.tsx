import { Hono } from 'hono';
import { basicAuth } from 'hono/basic-auth';
import { createMiddleware } from 'hono/factory';
import { logger } from 'hono/logger';
import { poweredBy } from 'hono/powered-by';
import IndexPage from '~/ui/pages/_index';

interface Bindings {
  ADMIN_USERNAME: string;
  ADMIN_PASSWORD: string;
  KV_STORE: KVNamespace;
  DB: D1Database;
}

const basicAuthMiddleware = () =>
  basicAuth({
    verifyUser(username, password, c) {
      return (
        username === c.env.ADMIN_USERNAME && password === c.env.ADMIN_PASSWORD
      );
    },
  });

const app = new Hono<{ Bindings: Bindings }>();

app.use(poweredBy());
app.use(logger());

app.get('/analytics', basicAuthMiddleware(), (c) => {
  return c.text('Hello Analytics Page!');
});

app.get('/', basicAuthMiddleware(), (c) => {
  return c.html(<IndexPage />);
});

export default app;
