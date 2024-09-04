import dayjs, { Dayjs } from 'dayjs'

import { type DateAccuracy } from './getDateAccuracy'

/**
 * Функция округляет дату до необходимой точности (отрезает лишнюю часть)
 * Н.р. если dateAccuracy="day", то останется только дата, а время будет обнулено
 * @param {Date | Dayjs | null | undefined} value - Дата
 * @param {string} dateAccuracy - точность: month - округление до месяца (число будет равно 1, а время обнулено), day - округление до дня, minute - до минут, full - без округления
 * @return {Dayjs | null}
 */
export const cutDateByAccuracy = (value: Date | Dayjs | null | undefined, dateAccuracy: DateAccuracy): Dayjs | null => {
    if (!value) {
        return null
    }

    const date = dayjs(value)

    if (!date.isValid()) {
        return null
    }

    switch (dateAccuracy) {
        case 'month':
            return date.startOf('month')

        case 'day':
            return date.startOf('day')

        case 'minute':
            return date.startOf('minute')

        case 'full':
            return date

        default:
            return date
    }
}
