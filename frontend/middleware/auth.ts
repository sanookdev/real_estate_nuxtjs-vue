export default defineNuxtRouteMiddleware((to, from) => {
    const authStore = useAuthStore();

    if (!authStore.token) {
        return navigateTo('/login');
    }
});
