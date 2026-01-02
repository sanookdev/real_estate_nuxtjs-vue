/**
 * Composable to check if demo mode is enabled
 * Demo mode uses mock data instead of API calls
 * 
 * Usage:
 * const { isDemoMode } = useDemoMode()
 * if (isDemoMode) { /* use mock data */ }
 */
export const useDemoMode = () => {
    const config = useRuntimeConfig()
    const isDemoMode = config.public.demoMode === 'true' || config.public.demoMode === true

    return {
        isDemoMode
    }
}
