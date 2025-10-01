export default defineNuxtRouteMiddleware(async (to) => {
  const { getCurrentUser } = await import("~/utils/getCurrentUser");
  const user = await getCurrentUser();

  if (!user) {
    return navigateTo(`/login`);
  }
});
