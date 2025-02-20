import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { nanoid } from '~/utils';

export const clicks = sqliteTable('clicks', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => nanoid(32)),
  shortUrl: text('short_url').notNull(),
  clickedAt: text('clicked_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),

  // Analytics
  referer: text('referer'),
  userAgent: text('user_agent'),
  country: text('country'),
  region: text('region'),
  hashedIp: text('hashed_ip'),
  browser: text('browser'),
  os: text('os'),
  isMobile: integer('is_mobile', { mode: 'boolean' }),
});
