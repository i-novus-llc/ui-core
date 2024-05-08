import { InputHTMLAttributes, HTMLAttributes, ReactNode, ChangeEvent } from 'react'

import { ComponentBaseProps } from '../../core'
import { AbstractInputProps } from '../Input'

export interface RadioProps extends ComponentBaseProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'onFocus' | 'onBlur' | 'type' | 'value' | 'id' | 'defaultValue' | 'defaultChecked'>,
    Omit<AbstractInputProps<string>, 'id' | 'autoComplete'> {
    checked?: boolean
    disabled?: boolean
    id: string,
    readOnly?: boolean
}

export interface RadioGroupContextProps extends Omit<AbstractInputProps, 'onChange'> {
    defaultValue?: string
    disabled?: boolean
    onChange(optionId: string, event: ChangeEvent<HTMLInputElement>): void,
    readOnly?: boolean
}

export interface RadioGroupProps extends ComponentBaseProps, Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'onFocus' | 'onBlur' | 'type' | 'value' | 'id' | 'defaultChecked'>,
    Omit<AbstractInputProps<string>, 'name'> {
    children?: ReactNode,
    defaultValue?: string,
    direction?: 'horizontal' | 'vertical',
    disabled?: boolean,
    name: string
    readOnly?: boolean
}
