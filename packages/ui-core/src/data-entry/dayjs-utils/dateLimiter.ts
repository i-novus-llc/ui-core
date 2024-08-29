import dayjs, { Dayjs } from 'dayjs'

export type DateLimit = 'month' | 'date' | 'time'

/**
 * Функция обрезает лишнюю часть даты.
 * Н.р. если limiter="date", то время будет занулено
 * @param {Date | Dayjs | null | undefined} value - Значение в котором необходимо оставить только значимую часть
 * @param {string} limit - что в дате является значимым month, date, time. Все, что идет дальше - будет зануляться
 * @return {Dayjs | null}
 */
export const dateLimiter = (value: Date | Dayjs | null | undefined, limit: DateLimit): Dayjs | null => {
    if (!value) {
        return null
    }

    const date = dayjs(value)

    if (!date.isValid()) {
        return null
    }

    if (limit === 'date') {
        return date.startOf('day')
    }
    if (limit === 'month') {
        return date.startOf('month')
    }

    return date
}
