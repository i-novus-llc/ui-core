import { InputHTMLAttributes, HTMLAttributes, ReactNode } from 'react'

import { ComponentBaseProps } from '../../core'
import { AbstractInputProps } from '../Input'

export type CheckboxValueType = any

export interface CheckboxProps extends ComponentBaseProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type' | 'value' | 'id' | 'onBlur'>,
    Omit<AbstractInputProps<any>, 'autoComplete'> {
    checked?: boolean
    defaultChecked?: boolean // Выбран ли по дефолту
    disabled?: boolean
    hideError?: boolean,
    id: string,
    indeterminate?: boolean
}

export interface CheckboxGroupContextProps extends AbstractInputProps<any> {
    disabled?: boolean
    readOnly?: boolean
}

export interface CheckboxGroupProps extends ComponentBaseProps,
    Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultChecked' | 'onFocus' | 'onBlur'>,
    Omit<AbstractInputProps<any>, 'autoComplete'> {
    children?: ReactNode,
    defaultValue?: CheckboxValueType,
    direction?: 'horizontal' | 'vertical',
    disabled?: boolean,
    readOnly?: boolean
}
