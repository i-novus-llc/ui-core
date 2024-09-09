import { FC, MouseEvent } from 'react'

import { TagListProps } from '../types'
import { defaultOptions } from '../constants'
import { Tooltip } from '../../../data-display/Tooltip'
import { Tag } from '../../../data-display/Tag'

export const Tags: FC<TagListProps<unknown>> = ({
    prefix,
    selectedOptions = defaultOptions,
    onCloseTag,
    disabled,
}) => {
    return (
        <>
            {selectedOptions.map((option) => {
                const tagProps = {
                    label: option.label,
                    ...(onCloseTag && { onClose: (evt: MouseEvent<HTMLElement>) => onCloseTag(option.id, evt) }),
                    disabled,
                }

                return (
                    <Tooltip
                        key={option.id}
                        content={option.label}
                        noArrow
                        variant="dark"
                        placement="bottom"
                        className={`${prefix}-tooltip_tag`}
                    >
                        <Tag
                            {...tagProps}
                        />
                    </Tooltip>
                )
            })}
        </>
    )
}
