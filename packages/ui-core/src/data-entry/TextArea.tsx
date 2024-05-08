import { ChangeEvent, MouseEvent, forwardRef, HTMLProps, useCallback } from 'react'
import RCTextarea from 'rc-textarea'
import classNames from 'classnames'

import { CloseIcon, ComponentBaseProps, useConfigProvider } from '../core'
import { Button } from '../general/Button'

import { AbstractInputProps } from './Input'

interface TextAreaProps extends Omit<HTMLProps<HTMLTextAreaElement>, 'onBlur' | 'onFocus' | 'onChange' | 'onResize' | 'value'>,
    ComponentBaseProps, AbstractInputProps<string, HTMLTextAreaElement> {
    autoSize?: boolean | { maxRows?: number, minRows?: number },
    error?: boolean
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>((props, ref) => {
    const {
        disabled,
        placeholder,
        onChange,
        className,
        error,
        value,
        style,
        prefix,
        autoSize = false,
        ...restProps
    } = props

    const { getPrefix } = useConfigProvider()

    const prefixCls = getPrefix(prefix)

    const onTextAreaValueChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>) => {
        const textAreaValue = event.target.value

        onChange?.(textAreaValue, event)
    }, [onChange])

    const clearValue = useCallback((event: MouseEvent<HTMLButtonElement>) => {
        // @ts-ignore
        onChange?.('', event)
    }, [onChange])

    return (
        <div
            style={style}
            className={classNames(`${prefixCls}-textArea-wrapper`, {
                [`${prefixCls}-textArea-wrapper_disabled`]: disabled,
                [`${prefixCls}-textArea-wrapper_error`]: error,
            }, className)}
        >
            <RCTextarea
                ref={ref as any}
                prefixCls={`${prefixCls}-textArea`}
                disabled={disabled}
                placeholder={placeholder}
                value={value || ''}
                defaultValue={value || ''}
                onChange={onTextAreaValueChange}
                autoSize={autoSize}
                {...restProps}
            />

            {value && (
                <Button
                    aria-label="Очистить"
                    disabled={disabled}
                    onClick={clearValue}
                    variant="link"
                    className={classNames('btn-xs', `${prefixCls}-textArea__clear-button`)}
                    icon={<CloseIcon />}
                />
            )}
        </div>
    )
})

TextArea.displayName = 'TextArea'
