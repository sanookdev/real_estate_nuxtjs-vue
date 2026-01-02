/**
 * Composable to get API URL from runtime config
 * Usage: const apiUrl = useApiUrl()
 */
export const useApiUrl = () => {
    const config = useRuntimeConfig()
    return config.public.apiUrl
}
