import { MouseEvent } from 'react'
import classNames from 'classnames'

import { Tag } from '../../../data-display/Tag'
import { TagListProps } from '../types'
import { defaultOptions } from '../constants'

export const TagList = ({
    prefix,
    className,
    selectedOptions = defaultOptions,
    onCloseTag,
    disabled,
}: TagListProps<unknown>) => {
    return (
        <ul className={classNames(`${prefix}-tags`, className)}>
            {selectedOptions.map((option) => {
                const tagProps = {
                    label: option.label,
                    ...(onCloseTag && { onClose: (evt: MouseEvent<HTMLElement>) => onCloseTag(option.id, evt) }),
                    disabled,
                }

                return (
                    <li key={option.id}>
                        <Tag {...tagProps} />
                    </li>
                )
            })}
        </ul>
    )
}

TagList.displayName = 'TagList'
