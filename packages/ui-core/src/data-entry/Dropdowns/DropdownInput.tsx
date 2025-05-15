import {
    forwardRef,
    MouseEvent,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react'
import classNames from 'classnames'

import { Popover } from '../../data-display/Popover'
import { Input } from '../Input'
import { PopoverProps } from '../../data-display/Popover/types'
import { FocusTrap, useForwardedRef } from '../../core'

import { DropdownInputProps } from './types'
import { InputSuffixIcon } from './components/InputSuffixIcon'

const REACT_TOOLTIP_PLACEMENT_CLASS_PREFIX = 'react-tooltip__place-'
const INITIAL_POPOVER_PLACEMENT = 'bottom'

// TODO: Вероятно стоит вынести часть логики в хуки. Сейчас все в кучу свалено
export const DropdownInput = forwardRef<HTMLInputElement, DropdownInputProps<unknown>>((props, ref) => {
    const {
        className,
        prefixCls,
        dropdownInnerComponentProps,
        dropdownInnerComponent: DropdownInnerComponent,
        onBlur,
        onFocus,
        onOpen,
        onClose,
        style,
        readOnly = false,
        disabled = false,
        loading = false,
        error = false,
        clearIcon = true,
        type,
        value,
        disableInput = false,
        getContainer,
        onChange,
        onKeyDown,
        ...inputProps
    } = props

    const [isDropdownOpened, setDropdownOpened] = useState(false)
    const [observedPopoverPlacement, setObservedPopoverPlacement] = useState<PopoverProps['placement']>(INITIAL_POPOVER_PLACEMENT)

    const InputRef = useForwardedRef(ref)
    const returnFocusElementRef = useRef<HTMLButtonElement>(null)
    const dropdownComponentRef = useRef<HTMLDivElement>(null)
    const popoverRef = useRef<HTMLDivElement>(null)

    const focusEventRef = useRef<any>()

    const dropdownPrefix = `${prefixCls}-dropdown`

    const dropdownClasses = useMemo(() => classNames(
        className,
        dropdownPrefix,
        `${dropdownPrefix}_place_${observedPopoverPlacement}`,
        {
            [`${dropdownPrefix}_opened`]: isDropdownOpened,
        },
    ), [className, dropdownPrefix, isDropdownOpened, observedPopoverPlacement])

    const popoverClasses = useMemo(() => classNames(
        `${dropdownPrefix}-popover`,
        `${dropdownPrefix}-popover_place_${observedPopoverPlacement}`,
        {
            [`${dropdownPrefix}-popover_opened`]: isDropdownOpened,
        },
    ), [dropdownPrefix, isDropdownOpened, observedPopoverPlacement])

    const saveEvent = useCallback((event: MouseEvent<HTMLElement>) => {
        focusEventRef.current = event
    }, [])

    const handleReset = useCallback(() => {
        onChange('')
    }, [onChange])

    const close = useCallback(() => {
        setDropdownOpened(false)
    }, [])

    const onOpenDropdown = useCallback(() => {
        onFocus?.(focusEventRef.current)
        onOpen?.(focusEventRef.current)
    }, [onFocus, onOpen])

    const onCloseDropdown = useCallback(() => {
        onClose?.()
        onBlur?.(focusEventRef.current)
    }, [onBlur, onClose])

    const handleInput = useCallback(() => {
        setDropdownOpened(true)
    }, [])

    useEffect(() => {
        const element = popoverRef.current

        if (!element) { return undefined }

        const onPopoverReplace = (mutationRecords: MutationRecord[]) => {
            const record = mutationRecords[0]
            const classes = Array.from((record?.target as HTMLElement).classList)
            const popoverPlacement = classes
                .find(className => className.startsWith(REACT_TOOLTIP_PLACEMENT_CLASS_PREFIX))?.replace(REACT_TOOLTIP_PLACEMENT_CLASS_PREFIX, '') as (PopoverProps['placement'] | undefined)

            if (popoverPlacement) {
                setObservedPopoverPlacement(popoverPlacement)
            }
        }
        const popoverObserver = new MutationObserver(onPopoverReplace)

        popoverObserver.observe(element, {
            attributes: true,
            attributeFilter: ['class'],
        })

        return () => {
            popoverObserver.disconnect()
        }
        /** Необходимо вызвать хук,как только меняется реф, что создать подписку на MutationObserver */
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [popoverRef.current])

    return (
        <div
            className={dropdownClasses}
            ref={dropdownComponentRef}
            style={style}
        >
            <Popover
                closeOnEsc
                getContainer={getContainer}
                returnFocusRef={returnFocusElementRef}
                ref={popoverRef}
                afterShow={onOpenDropdown}
                afterHide={onCloseDropdown}
                style={{
                    width: dropdownComponentRef.current?.offsetWidth,
                    minWidth: dropdownComponentRef.current?.offsetWidth,
                    maxWidth: dropdownComponentRef.current?.offsetWidth,
                }}
                disabled={disabled}
                readOnly={readOnly}
                prefix={prefixCls}
                open={isDropdownOpened}
                onOpenChange={setDropdownOpened}
                placement={INITIAL_POPOVER_PLACEMENT}
                className={popoverClasses}
                offset={2}
                components={{
                    Content: (
                        <FocusTrap>
                            <DropdownInnerComponent
                                {...dropdownInnerComponentProps}
                                close={close}
                                prefix={dropdownPrefix}
                                value={value}
                            />
                        </FocusTrap>
                    ),
                }}
            >
                <div className={`${dropdownPrefix}__input`}>
                    <Input
                        {...inputProps}
                        onReset={handleReset}
                        onChange={disableInput ? undefined : onChange}
                        onKeyDown={disableInput ? undefined : onKeyDown}
                        onInput={disableInput ? undefined : handleInput}
                        value={value}
                        ref={InputRef}
                        prefix={prefixCls}
                        disabled={disabled || readOnly}
                        readOnly={readOnly}
                        error={error}
                        onClick={saveEvent}
                        type={type}
                        suffixIcon={(
                            <InputSuffixIcon
                                ref={returnFocusElementRef}
                                disabled={disabled || readOnly}
                                error={error}
                                loading={loading}
                                className={`${prefixCls}-dropdown__suffix-icon-button`}
                                onClick={saveEvent}
                            />
                        )}
                        tabIndex={disableInput ? -1 : 0}
                        clearIcon={clearIcon}
                    />
                </div>
            </Popover>
        </div>
    )
})

DropdownInput.displayName = 'DropdownInput'
