import { ReactMaskOpts } from 'react-imask/mixin'
import { IMask } from 'react-imask'
import dayjs from 'dayjs'

export const datePicker = (dateFormat: string): ReactMaskOpts => {
    return ({
        mask: Date,
        pattern: dateFormat
            .replaceAll('.', '.`')
            .replaceAll('/', '/`')
            .replaceAll(' ', ' `')
            .replaceAll(':', ':`')
            .replaceAll('—', '—`')
            .replaceAll('-', '-`'),
        blocks: {
            DD: {
                mask: IMask.MaskedRange,
                from: 1,
                to: 31,
            },
            MM: {
                mask: IMask.MaskedRange,
                from: 1,
                to: 12,
            },
            YYYY: {
                mask: IMask.MaskedRange,
                from: 1900,
                to: 9999,
            },
            HH: {
                mask: IMask.MaskedRange,
                from: 0,
                to: 23,
            },
            mm: {
                mask: IMask.MaskedRange,
                from: 0,
                to: 59,
            },
            ss: {
                mask: IMask.MaskedRange,
                from: 0,
                to: 59,
            },
        },
        format: (date: any) => dayjs(date).format(dateFormat),
        parse: str => dayjs(str, dateFormat).toDate(),
        lazy: true,
        placeholderChar: ' ',
        autofix: false,
    })
}

export const dateRangePicker = (dateFormat: string, separator = '—') => {
    return ({
        mask: `from ${separator}\` to`,
        blocks: {
            from: datePicker(dateFormat),
            to: datePicker(dateFormat),
        },
    })
}
