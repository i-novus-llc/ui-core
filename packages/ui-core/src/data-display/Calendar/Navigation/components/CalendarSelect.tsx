import { MouseEvent, useCallback, useMemo, useRef, useState } from 'react'
import { v4 as generateId } from 'uuid'
import classNames from 'classnames'

import { Popover } from '../../../Popover'
import { Button } from '../../../../general/Button'
import { ExpandDownIcon } from '../../../../core'
import { CalendarSelectProps } from '../../types'
import { FocusTrap } from '../../../../core/components/focus-trap'

import { ID_PREFIX, SELECTED_OPTION_ID } from './constants'
import { CalendarSelectOptions } from './CalendarSelectOptions'

export const CalendarSelect = ({
    prefix,
    initialValue,
    onSelectOption,
    options,
    expandIconVisibility = true,
    className,
}: CalendarSelectProps) => {
    const buttonRef = useRef<HTMLButtonElement>(null)

    const [isOpened, setOpened] = useState(false)

    const selectOptionsContainerRef = useRef<HTMLDivElement>(null)
    const selectOptionsContainerId = useMemo(() => `${ID_PREFIX}${generateId()}`, [])

    const getContainer = useCallback(() => selectOptionsContainerRef.current as HTMLDivElement, [])

    const handleClickOption = useCallback((evt: MouseEvent<HTMLButtonElement>) => {
        // @ts-ignore
        const option = evt.target.name as string

        onSelectOption(option)
        setOpened(false)
    }, [onSelectOption])

    return (
        <>
            <Popover
                closeOnEsc
                returnFocusRef={buttonRef}
                className={classNames(className, 'calendar-select')}
                placement="bottom"
                open={isOpened}
                onOpenChange={setOpened}
                components={{
                    Content: (
                        <FocusTrap initialFocusableSelector={`#${SELECTED_OPTION_ID}`}>
                            <CalendarSelectOptions
                                prefix={prefix}
                                onClickOption={handleClickOption}
                                options={options}
                                initialValue={initialValue}
                            />
                        </FocusTrap>
                    ),
                }}
                getContainer={getContainer}
            >

                <Button
                    ref={buttonRef}
                    variant="link-cancel"
                    className={classNames('btn-xs', `${prefix}-calendar__select`, {
                        [`${prefix}-calendar__select_opened`]: isOpened,
                    })}
                >
                    {initialValue}
                    {expandIconVisibility && <ExpandDownIcon />}
                </Button>
            </Popover>
            {/**
             Опции рендерятся в этот контейнер, а не в body, чтобы решить 2 проблемы:
             - клик по опции должен стриггерить закрытие поповера с опциями
             - клик по опции не должен стриггерить закрытие поповера с календарем
 */}

            <div id={selectOptionsContainerId} ref={selectOptionsContainerRef} />
        </>
    )
}
