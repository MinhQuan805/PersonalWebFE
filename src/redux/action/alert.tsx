type AlertType = 'success' | 'error' | 'warning' | 'info' | 'hide';

export const displayAlert = (message: string, type: AlertType) => ({
    type,
    message,
});
