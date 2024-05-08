export const IS_DEV = (() => {
    try {
        // vite`s dev env read method
        // @ts-ignore
        if (import.meta.env.DEV) {
            return true
        }
    } catch {
        /* empty */
    }

    try {
        // webpack`s dev env read method
        // @ts-ignore
        if (process.env.NODE_ENV.toLowerCase().startsWith('dev')) {
            return true
        }
    } catch {
        /* empty */
    }

    return false
})()
