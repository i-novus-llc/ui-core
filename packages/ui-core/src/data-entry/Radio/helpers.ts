export const createUniqueId = (prefix = '') => `${prefix}${Math.round(Math.random() * 10e6)}`
