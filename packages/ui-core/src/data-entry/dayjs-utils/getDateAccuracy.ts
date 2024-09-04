export type DateAccuracy = 'month' | 'day' | 'minute' | 'full'

const SECONDS_TOKEN = 's'

/**
 * Вычисляет требуемую точность дат по переданным маскам даты и времени
 * @param dateFormat маска даты
 * @param timeFormat маска времени
 */
export function getDateAccuracy(dateFormat: string, timeFormat?: string | undefined): DateAccuracy {
    if (dateFormat === 'MM.YYYY') {
        return 'month'
    }

    if (timeFormat) {
        if (timeFormat.includes(SECONDS_TOKEN)) {
            return 'full'
        }

        return 'minute'
    }

    return 'day'
}
