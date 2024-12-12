import { forwardRef, FocusEvent, useRef, useEffect, MouseEvent, memo } from 'react'
import { IMask, useIMask } from 'react-imask'
import { ReactMaskOpts, UnmaskValue } from 'react-imask/mixin'

import { useComposeRef, useMemoFunction } from '../core'

import { Input, InputProps } from './Input'

export interface InputMaskProps extends Omit<InputProps, 'onChange'> {
    maskConfig: ReactMaskOpts & { from?: number, to?: number }
    onChange?(value: string, event?: InputEvent): void,
    onComplete?(value: string, event?: InputEvent): void
}

type MaskRef = ReturnType<typeof useIMask>['maskRef']
type TMask = NonNullable<MaskRef['current']>

const InputMaskForwarded = forwardRef<HTMLInputElement, InputMaskProps>((props, ref) => {
    const {
        value: outValue,
        maskConfig,
        onChange,
        onComplete,
        onBlur,
        onReset: onResetExternal,
        ...restProps
    } = props

    const lastCompletedValueRef = useRef<string>(outValue || '')

    const handlerAccept = useMemoFunction((value: UnmaskValue<ReactMaskOpts>, mask: TMask, event?: InputEvent) => {
        onChange?.(value, event)

        if (!value) {
            lastCompletedValueRef.current = ''
            onComplete?.(value, event)
        }
    })

    const handleComplete = useMemoFunction((value: UnmaskValue<ReactMaskOpts>, mask: TMask, event?: InputEvent) => {
        lastCompletedValueRef.current = value
        onComplete?.(value, event)
    })

    const {
        ref: internalRef,
        value: maskedValue,
        setValue,
    } = useIMask(maskConfig, {
        onAccept: handlerAccept,
        onComplete: handleComplete,
    })

    const onReset = useMemoFunction((event: MouseEvent<HTMLButtonElement>) => {
        lastCompletedValueRef.current = ''
        setValue('')

        onResetExternal?.(event)
    })

    const handleBlur = useMemoFunction((event: FocusEvent<HTMLInputElement>) => {
        setValue(lastCompletedValueRef.current)

        onBlur?.(event, setValue)
    })

    useEffect(() => {
        if (outValue && typeof outValue === 'string') {
            lastCompletedValueRef.current = outValue
            setValue(outValue)
        } else {
            lastCompletedValueRef.current = ''
            setValue('')
        }
    }, [setValue, outValue])

    return (
        <Input
            {...restProps}
            ref={useComposeRef(internalRef, ref)}
            onReset={onReset}
            onBlur={handleBlur}
            value={maskedValue}
        />
    )
})

export const Mask = IMask

export const InputMask = memo(InputMaskForwarded)

InputMask.displayName = 'InputMask'
