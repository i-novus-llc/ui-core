import { forwardRef } from 'react'
import classNames from 'classnames'

import { ComponentBaseProps, useConfigProvider } from '../../core'

import { TypographyBody, TypographyBodyProps } from './Typography'

export interface LinkProps extends TypographyBodyProps, ComponentBaseProps {
    target?: '_blank' | '_self' | '_parent' | '_top',
    to: string
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => {
    const { tag = 'a', className, prefix, to, target, ...restProps } = props

    const { getPrefix } = useConfigProvider()

    const prefixCls = getPrefix(prefix)

    return (
        <TypographyBody
            tag={tag}
            ref={ref}
            // @ts-expect-error: Путает свойство href с ref
            href={to}
            target={target}
            className={classNames(className, `${prefixCls}-typography-link`)}
            {...target === '_blank' && { rel: 'noopener noreferrer' }}
            {...restProps}
        />
    )
})
