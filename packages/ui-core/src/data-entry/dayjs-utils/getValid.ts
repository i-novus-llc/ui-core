import dayjs, { Dayjs } from 'dayjs'

/**
 * Функция возвращает валидный dayjs объект или null если была передана невалидная дата
 * @param {Date | Dayjs | string | null | undefined} value - Значение которое необходимо преобразовать в dayjs объект
 * @param {string} format - формат парсинга строкового значения даты
 * @return {Dayjs | null}
 */
export const getValidDayjs = (value: Date | Dayjs | string | null | undefined, format?: string): Dayjs | null => {
    if (!value) {
        return null
    }

    const date = typeof value === 'string' ? dayjs(value, format, true) : dayjs(value)

    if (date.isValid()) {
        return date
    }

    return null
}
