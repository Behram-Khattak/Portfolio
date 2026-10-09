export default defineEventHandler((event) => {
  const admin = event.context.admin!;
  return { email: admin.email, totpEnabled: admin.totpEnabled };
});
