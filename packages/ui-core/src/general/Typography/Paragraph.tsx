import { forwardRef } from 'react'
import classNames from 'classnames'

import { ComponentBaseProps, useConfigProvider } from '../../core'

import { TypographyBody, TypographyBodyProps } from './Typography'
import { EllipsisConfig } from './Ellipsis'

export interface ParagraphProps extends TypographyBodyProps, ComponentBaseProps {
    ellipsis?: EllipsisConfig
}

export const Paragraph = forwardRef<HTMLDivElement, ParagraphProps>((props, ref) => {
    const { tag = 'p', prefix, className, ...restProps } = props

    const { getPrefix } = useConfigProvider()

    const prefixCls = getPrefix(prefix)

    return (
        <TypographyBody
            tag={tag}
            ref={ref}
            className={classNames(className, `${prefixCls}-typography-paragraph`)}
            {...restProps}
        />
    )
})
