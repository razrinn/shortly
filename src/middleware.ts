import { drizzle } from 'drizzle-orm/d1';
import { basicAuth } from 'hono/basic-auth';
import { createMiddleware } from 'hono/factory';
import { HonoApp } from '~/types';

export const drizzleMiddleware = createMiddleware<HonoApp>(async (c, next) => {
  const db = drizzle(c.env.DB);

  c.set('db', db);

  await next();
});

export const basicAuthMiddleware = () =>
  basicAuth({
    async verifyUser(username, password, c) {
      if (username !== c.env.ADMIN_USERNAME) return false;
      return (
        username === c.env.ADMIN_USERNAME && password === c.env.ADMIN_PASSWORD
      );
    },
  });
