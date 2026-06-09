import { defineMiddleware } from 'astro:middleware';

const COOKIE_NAME = 'site-auth';
const COOKIE_SECRET = 'v4-authenticated';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // Always allow: password page, API routes, static assets
  if (
    pathname === '/enter' ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_astro/') ||
    pathname.startsWith('/favicon')
  ) {
    return next();
  }

  // Check auth cookie
  const cookie = context.cookies.get(COOKIE_NAME);
  if (cookie?.value === COOKIE_SECRET) {
    return next();
  }

  // Not authenticated → redirect to password page, preserve destination
  const dest = encodeURIComponent(pathname);
  return context.redirect(`/enter?next=${dest}`);
});
