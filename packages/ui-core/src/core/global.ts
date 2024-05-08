import { CSSProperties, ForwardRefExoticComponent, PropsWithChildren, RefAttributes } from 'react'

export interface ComponentBaseProps extends PropsWithChildren {
    className?: string
    disabled?: boolean,
    prefix?: string,
    style?: CSSProperties
    visible?: boolean
}

export type CompoundComponent<
    Props,
    Compound = never,
    ElementType = HTMLElement,
> = ForwardRefExoticComponent<Props & RefAttributes<ElementType>> & Compound
