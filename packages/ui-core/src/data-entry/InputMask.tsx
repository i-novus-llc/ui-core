import { forwardRef, FocusEvent, useState, useRef, useCallback, useEffect } from 'react'
import { IMask, useIMask } from 'react-imask'
import { ReactMaskOpts, UnmaskValue } from 'react-imask/mixin'

import { useComposeRef } from '../core/hooks/useComposeRef'

import { Input, InputProps } from './Input'

export interface InputMaskProps extends Omit<InputProps, 'onChange'> {
    maskConfig: ReactMaskOpts & { from?: number, to?: number }
    onChange?(value: string, event?: InputEvent): void,
    onComplete?(value: string, event?: InputEvent): void
}

type MaskRef = ReturnType<typeof useIMask>['maskRef']
type TMask = NonNullable<MaskRef['current']>

export const InputMask = forwardRef<HTMLInputElement, InputMaskProps>((props, ref) => {
    const {
        value,
        maskConfig,
        onChange,
        onComplete,
        onBlur,
        ...restProps
    } = props

    const lastCompletedValueRef = useRef<string | null>(null)
    const [isCompleted, setIsCompleted] = useState(false)

    const handlerAccept = useCallback((value: UnmaskValue<ReactMaskOpts>, mask: TMask, event?: InputEvent) => {
        onChange?.(value, event)

        if (!value) {
            onComplete?.(value, event)
        }
    }, [onChange, onComplete])

    const handleComplete = useCallback((value: UnmaskValue<ReactMaskOpts>, mask: TMask, event?: InputEvent) => {
        lastCompletedValueRef.current = value

        onComplete?.(value, event)
        setIsCompleted(true)
    }, [onComplete])

    const {
        ref: internalRef,
        value: maskedValue,
        setValue,
        maskRef,
    } = useIMask(maskConfig, {
        onAccept: handlerAccept,
        onComplete: handleComplete,
    })

    const onReset = useCallback(() => {
        setValue('')

        lastCompletedValueRef.current = null
    }, [setValue])

    const handleBlur = useCallback((event: FocusEvent<HTMLInputElement>) => {
        if (maskRef.current?.masked.value && !maskRef.current?.masked.isComplete) {
            setValue(lastCompletedValueRef.current || '')
        }

        onBlur?.(event)
    }, [maskRef, onBlur, setValue])

    useEffect(() => {
        if ((typeof value === 'string' || value === null)) {
            setValue(value || '')
            setIsCompleted(false)
        }
    }, [setValue, value, isCompleted])

    // Убран useEffect так как не понятно в чем была причина добавления этого кода. Если вдруг чего поломается. Можно попробовать вернуть
    // useEffect(() => {
    //     if (internalRef.current) {
    //         // @ts-ignore
    //         internalRef.current.value = maskedValue
    //     }
    // }, [internalRef, maskedValue])

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

InputMask.displayName = 'InputMask'
