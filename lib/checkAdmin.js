// Simple shared-password check for the admin API routes.
// Good enough for a solo operator; not meant for a multi-user team tool.
export function isAdmin(req) {
  const provided = req.headers['x-admin-password'];
  return Boolean(provided) && provided === process.env.ADMIN_PASSWORD;
}
