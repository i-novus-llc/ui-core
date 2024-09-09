import {
    forwardRef,
    KeyboardEvent,
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
import { useComposeRef } from '../../core/hooks/useComposeRef'

import { MultipleSelectorProps, TOption } from './types'
import { InputSuffixIcon as ChevronButton } from './components/InputSuffixIcon'
import { ClearButton } from './components/ClearButton'
import { Tags } from './components'

const REACT_TOOLTIP_PLACEMENT_CLASS_PREFIX = 'react-tooltip__place-'
const INITIAL_POPOVER_PLACEMENT = 'bottom'

// eslint-disable-next-line sonarjs/cognitive-complexity
export const MultipleSelector = forwardRef<HTMLInputElement, MultipleSelectorProps<unknown>>((props, ref) => {
    const {
        className,
        prefixCls,
        dropdownInnerComponentProps: {
            onOptionClick: onExternalOptionClick,
            ...restDropdownOptions
        },
        dropdownInnerComponent: DropdownInnerComponent,
        tagListProps: {
            selectedOptions,
            onCloseTag: onExternalCloseTag,
            handleClearAllSelectedOptions,
        },
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
        onChange,
        onKeyDown,
        ...inputProps
    } = props

    const [isDropdownOpened, setDropdownOpened] = useState(false)
    const [observedPopoverPlacement, setObservedPopoverPlacement] = useState<PopoverProps['placement']>(INITIAL_POPOVER_PLACEMENT)

    const forwardedRef = useForwardedRef(ref)
    const returnFocusElementRef = useRef<HTMLButtonElement>(null)
    const dropdownComponentRef = useRef<HTMLDivElement>(null)
    const popoverRef = useRef<HTMLDivElement>(null)

    const focusEventRef = useRef<any>()

    const inputRef = useRef<HTMLInputElement>(null)

    const composedRef = useComposeRef(forwardedRef, inputRef)

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

    const inputContainerClasses = useMemo(() => classNames(
        `${dropdownPrefix}__input`,
        {
            [`${dropdownPrefix}__input_disabled`]: disabled,
            [`${dropdownPrefix}__input_error`]: error,
            [`${dropdownPrefix}__input_readonly`]: readOnly,
        },
    ), [disabled, dropdownPrefix, error, readOnly])

    const saveEvent = useCallback((event: MouseEvent<HTMLElement>) => {
        focusEventRef.current = event
    }, [])

    const handleClearMultiselect = useCallback((event: MouseEvent<HTMLButtonElement>) => {
        handleClearAllSelectedOptions?.(event)
    }, [handleClearAllSelectedOptions])

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

        if (!element) {
            return undefined
        }

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

    const onCloseTag = (id: string, evt: MouseEvent<HTMLElement>) => {
        evt.stopPropagation()

        onExternalCloseTag?.(id, evt)
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        onKeyDown?.(event)

        if (event.key === 'Backspace' &&
            selectedOptions.length &&
            !(event.target as HTMLInputElement).value) {
            const tagToDelete = selectedOptions?.at(-1)

            if (tagToDelete) {
                onCloseTag(tagToDelete.id, event as unknown as MouseEvent<HTMLElement>)
            }
        }
    }

    const onOptionClick = (newValue: Array<TOption<unknown>>, event: MouseEvent<HTMLElement>) => {
        onExternalOptionClick(newValue, event)

        if (!disableInput) {
            // @ts-ignore
            onChange('', event)
            inputRef?.current?.focus()
        }
    }

    const handleClickInside = useCallback((event: any) => {
        event.preventDefault()

        if (dropdownComponentRef?.current?.contains(event?.target) && !disableInput) {
            inputRef?.current?.focus()
        }
    }, [disableInput])

    useEffect(() => {
        document.addEventListener('mouseup', handleClickInside)

        return () => document.removeEventListener('mouseup', handleClickInside)
    }, [handleClickInside])

    return (
        <div
            className={dropdownClasses}
            ref={dropdownComponentRef}
            style={style}
        >
            <Popover
                closeOnEsc
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
                                {...restDropdownOptions}
                                onOptionClick={onOptionClick}
                                close={close}
                                prefix={dropdownPrefix}
                                value={value}
                            />
                        </FocusTrap>
                    ),
                }}
            >
                <div className={inputContainerClasses}>
                    <div className={`${dropdownPrefix}__input-items`}>
                        <Tags
                            selectedOptions={selectedOptions}
                            disabled={disabled}
                            prefix={prefixCls}
                            {...((!disabled || readOnly) && { onCloseTag })}
                        />
                        { disableInput || disabled
                            ? null
                            : (
                                <div className={`${dropdownPrefix}__input-wrapper`} data-value={value}>
                                    <Input
                                        {...inputProps}
                                        onChange={onChange}
                                        onKeyDown={handleKeyDown}
                                        onInput={handleInput}
                                        value={value}
                                        ref={composedRef}
                                        prefix={prefixCls}
                                        disabled={disabled || readOnly}
                                        readOnly={readOnly}
                                        error={error}
                                        onClick={saveEvent}
                                        type={type}
                                        tabIndex={0}
                                    />
                                </div>
                            )
                        }
                    </div>
                    <div className={`${dropdownPrefix}__input-controls`}>
                        <ClearButton
                            className={`${prefixCls}-dropdown__clear-icon`}
                            clearIcon={clearIcon}
                            disabled={disabled || readOnly}
                            visible={Boolean(selectedOptions.length) || Boolean(value)}
                            onClick={handleClearMultiselect}
                            ref={returnFocusElementRef}
                        />

                        <ChevronButton
                            className={`${prefixCls}-dropdown__suffix-icon-button`}
                            disabled={disabled || readOnly}
                            error={error}
                            loading={loading}
                            onClick={saveEvent}
                            ref={returnFocusElementRef}
                        />
                    </div>
                </div>
            </Popover>
        </div>
    )
})

MultipleSelector.displayName = 'DropdownMultipleInput'
