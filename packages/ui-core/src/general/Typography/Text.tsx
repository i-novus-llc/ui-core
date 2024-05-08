import { forwardRef } from 'react'
import classNames from 'classnames'

import { ComponentBaseProps, useConfigProvider } from '../../core'

import { TypographyBody, TypographyBodyProps } from './Typography'

export interface TextProps extends TypographyBodyProps, ComponentBaseProps {}

export const Text = forwardRef<HTMLSpanElement, TextProps>((props, ref) => {
    const { tag = 'span', prefix, className, ...restProps } = props

    const { getPrefix } = useConfigProvider()

    const prefixCls = getPrefix(prefix)

    return (
        <TypographyBody
            tag={tag}
            ref={ref}
            className={classNames(className, `${prefixCls}-typography-text`)}
            {...restProps}
        />
    )
})
