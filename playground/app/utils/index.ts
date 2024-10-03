export function tryStartViewTransition(callback: () => any) {
    document.startViewTransition?.(callback) ?? callback();
}