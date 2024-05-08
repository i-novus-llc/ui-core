import { TOption } from './types'

export const defaultOptions: Array<TOption<unknown>> = []
export const noOptions: Array<TOption<unknown>> = [{ id: 'no-options', label: 'Нет вариантов', value: '', disabled: true }]
export const noOption: TOption<unknown> = { id: 'no-option', label: 'Нет вариантов', value: '', disabled: true }
