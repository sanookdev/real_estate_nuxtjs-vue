import alertify from 'alertifyjs';

export default defineNuxtPlugin((nuxtApp) => {
    if (process.client) {
        // Configure AlertifyJS
        alertify.defaults.notifier.position = 'top-right';
        alertify.defaults.transition = 'zoom';
        alertify.defaults.theme.ok = 'ui positive button';
        alertify.defaults.theme.cancel = 'ui black button';

        return {
            provide: {
                alertify
            }
        };
    }
});
