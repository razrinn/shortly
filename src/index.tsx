import { Hono } from 'hono';
import { basicAuth } from 'hono/basic-auth';
import { createMiddleware } from 'hono/factory';
import { logger } from 'hono/logger';
import { poweredBy } from 'hono/powered-by';
import IndexPage from '~/ui/pages/_index';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { nanoid } from '~/utils';

interface Bindings {
  ADMIN_USERNAME: string;
  ADMIN_PASSWORD: string;
  KV_STORE: KVNamespace;
  DB: D1Database;
}

const basicAuthMiddleware = createMiddleware<{ Bindings: Bindings }>(
  async (c, next) => {
    basicAuth({
      verifyUser(username, password) {
        return (
          username === c.env.ADMIN_USERNAME && password === c.env.ADMIN_PASSWORD
        );
      },
    });

    await next();
  }
);

const app = new Hono<{ Bindings: Bindings }>();

app.use(poweredBy());
app.use(logger());

app.get('/analytics', basicAuthMiddleware, (c) => {
  return c.text('Hello Analytics Page!');
});

app.get('/', basicAuthMiddleware, (c) => {
  return c.html(<IndexPage />);
});

app.post(
  '/',
  basicAuthMiddleware,
  zValidator(
    'form',
    z.object({
      longUrl: z.string().url('Invalid URL format'),
      shortUrl: z
        .string()
        .optional()
        .refine((value) => {
          if (!value) return true;
          if (!/^[a-zA-Z0-9-]+$/.test(value)) return false;
          if (value.length < 3) return false;
          if (value.length > 64) return false;
          return true;
        }, 'Short URL must be alphanumeric & dash and between 3-64 characters long'),
    }),
    (result, c) => {
      if (!result.success) {
        const message = result.error.issues[0].message;
        return c.html(<IndexPage error={message} />);
      }
    }
  ),
  async (c) => {
    const { longUrl, shortUrl } = c.req.valid('form');
    let key: string;

    if (shortUrl) {
      const existing = await c.env.KV_STORE.get(`short:${shortUrl}`);
      if (existing) {
        return c.html(<IndexPage error='Short URL already exists' />);
      }
      key = shortUrl;
    } else {
      let generatedKey: string;
      while (true) {
        generatedKey = nanoid();
        const existing = await c.env.KV_STORE.get(`short:${generatedKey}`);
        if (!existing) {
          break;
        }
      }
      key = generatedKey;
    }

    await c.env.KV_STORE.put(`short:${key}`, longUrl);
    const domain = new URL(c.req.url).origin;
    const newUrl = `${domain}/${key}`;
    return c.html(<IndexPage success={newUrl} />);
  }
);

app.get('/:key', async (c) => {
  const key = c.req.param('key');
  const longUrl = await c.env.KV_STORE.get(`short:${key}`);

  if (!longUrl) {
    return c.notFound();
  }

  // TODO: add analytics

  return c.redirect(longUrl);
});

export default app;
