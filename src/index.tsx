import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { poweredBy } from 'hono/powered-by';
import IndexPage from '~/ui/pages/_index';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { hashIpAddress, nanoid, parseUserAgent } from '~/utils';
import { basicAuthMiddleware, drizzleMiddleware } from '~/middleware';
import { HonoApp, UrlRow } from '~/types';
import { clicks } from '~/schema';
import AnalyticsPage from '~/ui/pages/analytics';
import { count } from 'drizzle-orm';

const app = new Hono<HonoApp>();

app.use(poweredBy());
app.use(logger());
app.use(drizzleMiddleware);

app.get('/analytics', basicAuthMiddleware, async (c) => {
  const list = await c.env.KV_STORE.list({ prefix: 'url:' });
  const data: UrlRow[] = [];

  for (const key of list.keys) {
    const parsedKey = key.name.split(':')[1];
    const originalUrl = await c.env.KV_STORE.get(key.name);
    const count = await c.env.KV_STORE.get(`count:${parsedKey}`);
    if (!originalUrl) continue;

    data.push({
      shortUrl: parsedKey,
      originalUrl,
      clicksCount: Number(count ?? 0),
    });
  }

  data.sort((a, b) => b.clicksCount - a.clicksCount);

  const totalClicksQuery = await c.var.db
    .select({ count: count() })
    .from(clicks);

  const totalClicks = totalClicksQuery[0].count;

  const totalCountryQuery = await c.var.db
    .selectDistinct({ country: clicks.country })
    .from(clicks)
    .groupBy(clicks.country);

  return c.html(
    <AnalyticsPage
      totalClicks={totalClicks}
      totalShortenedUrls={list.keys.length}
      totalCountry={totalCountryQuery.length}
      data={data}
    />
  );
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
      const existing = await c.env.KV_STORE.get(`url:${shortUrl}`);
      if (existing) {
        return c.html(<IndexPage error='Short URL already exists' />);
      }
      key = shortUrl;
    } else {
      let generatedKey: string;
      while (true) {
        generatedKey = nanoid();
        const existing = await c.env.KV_STORE.get(`url:${generatedKey}`);
        if (!existing) {
          break;
        }
      }
      key = generatedKey;
    }

    await c.env.KV_STORE.put(`url:${key}`, longUrl);
    const domain = new URL(c.req.url).origin;
    const newUrl = `${domain}/${key}`;
    return c.html(<IndexPage success={newUrl} />);
  }
);

app.get('/:key', async (c) => {
  const key = c.req.param('key');
  const longUrl = await c.env.KV_STORE.get(`url:${key}`);

  if (!longUrl) {
    return c.notFound();
  }

  const currentCount = await c.env.KV_STORE.get(`count:${key}`);
  await c.env.KV_STORE.put(
    `count:${key}`,
    String(Number(currentCount || 0) + 1)
  );

  const { browser, isMobile, os } = parseUserAgent(
    c.req.header('user-agent') || ''
  );

  const ipAddress = c.req.header('CF-Connecting-IP');
  const hashedIp = await hashIpAddress(ipAddress);

  await c.var.db.insert(clicks).values({
    shortUrl: key,
    referer: c.req.header('referer'),
    userAgent: c.req.header('user-agent'),
    country: (c.req.raw.cf?.country as string) ?? 'Unknown',
    region: (c.req.raw.cf?.region as string) ?? 'Unknown',
    hashedIp,
    browser,
    isMobile,
    os,
  });

  return c.redirect(longUrl);
});

export default app;
