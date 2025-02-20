import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { poweredBy } from 'hono/powered-by';
import IndexPage from '~/ui/pages/_index';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import {
  convertIso2ToIso3,
  hashIpAddress,
  nanoid,
  parseUserAgent,
} from '~/utils';
import { basicAuthMiddleware, drizzleMiddleware } from '~/middleware';
import { HonoApp, UrlRow } from '~/types';
import { clicks } from '~/schema';
import AnalyticsPage from '~/ui/pages/analytics';
import { and, count, desc, eq, sql } from 'drizzle-orm';
import AnalyticsDetailPage from '~/ui/pages/analytics.$key';

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

  return c.render(
    <AnalyticsPage
      totalClicks={totalClicks}
      totalShortenedUrls={list.keys.length}
      totalCountry={totalCountryQuery.length}
      data={data}
    />
  );
});

app.get('/analytics/:key', basicAuthMiddleware, async (c) => {
  const key = c.req.param('key');
  const originalUrl = await c.env.KV_STORE.get(`url:${key}`);

  if (!originalUrl) return c.notFound();

  const clicksStats = await c.var.db
    .select({ count: count(), clickedAt: clicks.clickedAt })
    .from(clicks)
    .where(
      and(
        eq(clicks.shortUrl, key),
        sql`${clicks.clickedAt} >= date('now', '-30 days')`
      )
    )
    .groupBy(sql`strftime('%Y-%m-%d', ${clicks.clickedAt})`)
    .orderBy(sql`strftime('%Y-%m-%d', ${clicks.clickedAt}) asc`);

  const clicksMap: Map<string, number> = new Map();
  for (const clickStat of clicksStats) {
    const dateOnly = clickStat.clickedAt.split(' ')[0];
    clicksMap.set(dateOnly, clickStat.count);
  }

  const last30DaysClicks: string[] = [];
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateString = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    last30DaysClicks.push(dateString);
  }

  const filledClicksStats: { label: string; count: number }[] = [];
  for (const dateString of last30DaysClicks) {
    const count = clicksMap.get(dateString) || 0;
    filledClicksStats.push({ label: dateString, count });
  }

  filledClicksStats.reverse();

  const browserStats = await c.var.db
    .select({ count: count(), browser: clicks.browser })
    .from(clicks)
    .where(
      and(
        eq(clicks.shortUrl, key),
        sql`${clicks.clickedAt} >= date('now', '-30 days')`
      )
    )
    .groupBy(clicks.browser);

  const osStats = await c.var.db
    .select({ count: count(), os: clicks.os })
    .from(clicks)
    .where(
      and(
        eq(clicks.shortUrl, key),
        sql`${clicks.clickedAt} >= date('now', '-30 days')`
      )
    )
    .groupBy(clicks.os);

  const mappedOsStats = osStats.map((d) => ({
    count: d.count,
    label: d.os ?? 'Unknown',
  }));

  const deviceStats = await c.var.db
    .select({ count: count(), isMobile: clicks.isMobile })
    .from(clicks)
    .where(
      and(
        eq(clicks.shortUrl, key),
        sql`${clicks.clickedAt} >= date('now', '-30 days')`
      )
    )
    .groupBy(clicks.isMobile);

  const mappedDeviceStats = deviceStats.map((d) => ({
    count: d.count,
    label: d.isMobile ? 'Mobile' : 'Desktop',
  }));

  const refererStats = await c.var.db
    .select({ count: count(), referer: clicks.referer })
    .from(clicks)
    .where(
      and(
        eq(clicks.shortUrl, key),
        sql`${clicks.clickedAt} >= date('now', '-30 days')`
      )
    )
    .groupBy(clicks.referer);

  const mappedRefererStats = refererStats.map((d) => ({
    count: d.count,
    label: d.referer ?? 'Direct',
  }));

  const countryStats = await c.var.db
    .select({ count: count(), country: clicks.country })
    .from(clicks)
    .where(
      and(
        eq(clicks.shortUrl, key),
        sql`${clicks.clickedAt} >= date('now', '-30 days')`
      )
    )
    .groupBy(clicks.country);

  const mappedCountryStats: Record<
    string,
    { fillKey: string; clicks: number }
  > = {};

  const total = countryStats.reduce((acc, cur) => acc + cur.count, 0);

  for (const stat of countryStats) {
    if (stat.country) {
      let fillKey: string;
      if (stat.count >= 0.75 * total) {
        fillKey = 'high';
      } else if (stat.count > 0.25 * total) {
        fillKey = 'medium';
      } else if (stat.count > 0) {
        fillKey = 'low';
      } else {
        fillKey = '';
      }

      mappedCountryStats[convertIso2ToIso3(stat.country)] = {
        fillKey,
        clicks: stat.count,
      };
    }
  }

  return c.render(
    <AnalyticsDetailPage
      clicksStats={filledClicksStats}
      osStats={mappedOsStats}
      deviceStats={mappedDeviceStats}
      refererStats={mappedRefererStats}
      countryStats={mappedCountryStats}
    />
  );
});

app.get('/', basicAuthMiddleware, (c) => {
  return c.render(<IndexPage />);
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
        return c.render(<IndexPage error={message} />);
      }
    }
  ),
  async (c) => {
    const { longUrl, shortUrl } = c.req.valid('form');
    let key: string;

    if (shortUrl) {
      const existing = await c.env.KV_STORE.get(`url:${shortUrl}`);
      if (existing) {
        return c.render(<IndexPage error='Short URL already exists' />);
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
    return c.render(<IndexPage success={newUrl} />);
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
