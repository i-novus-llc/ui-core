import type { ElementType, ReactNode, CSSProperties, RefObject } from 'react'

export type TooltipPlacement =
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'right'
    | 'right-start'
    | 'right-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'left'
    | 'left-start'
    | 'left-end'

export type TooltipVariant = 'dark' | 'light' | 'success' | 'warning' | 'error' | 'info'

export type TooltipWrapper = ElementType | 'div' | 'span'

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export type TooltipChildren = Element | ElementType | ReactNode

export type TooltipEvents = 'hover' | 'click'

export type TooltipPositionStrategy = 'absolute' | 'fixed'

export type DataAttribute =
    | 'place'
    | 'content'
    | 'html'
    | 'variant'
    | 'offset'
    | 'wrapper'
    | 'events'
    | 'position-strategy'
    | 'delay-show'
    | 'delay-hide'
    | 'float'
    | 'hidden'

/**
 * @description floating-ui middleware
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Middleware = any

export interface TooltipPosition {
    x: number
    y: number
}

export type TooltipOffset = number | [number, number]

export interface ITooltipProps {
    activeAnchor: HTMLElement | null,
    afterHide?(): void,
    afterShow?(): void,
    /**
     * @deprecated Use the `data-tooltip-id` attribute, or the `anchorSelect` prop instead.
     * See https://react-tooltip.com/docs/getting-started
     */
    anchorId?: string,
    anchorSelect?: string,
    arrowColor?: CSSProperties['backgroundColor'],
    border?: CSSProperties['border'],
    className?: string,
    classNameArrow?: string,
    clickable?: boolean,
    closeOnEsc?: boolean,
    closeOnResize?: boolean,
    closeOnScroll?: boolean,
    content?: TooltipChildren,
    contentWrapperRef?: RefObject<HTMLDivElement>,
    delayHide?: number,
    delayShow?: number,
    /**
     * @deprecated Use `openOnClick` instead.
     */
    events?: TooltipEvents[],
    float?: boolean,
    hidden?: boolean,
    id?: string,
    isOpen?: boolean,
    middlewares?: Middleware[],
    noArrow?: boolean,
    offset?: TooltipOffset,
    opacity?: CSSProperties['opacity'],
    openOnClick?: boolean,
    place?: TooltipPlacement,
    position?: TooltipPosition,
    positionStrategy?: TooltipPositionStrategy,
    setActiveAnchor(anchor: HTMLElement | null): void,
    setIsOpen?(value: boolean): void,
    style?: CSSProperties,
    variant?: TooltipVariant,
    wrapper: TooltipWrapper
}

/**
 * @deprecated Use the `data-tooltip-id` attribute, or the `anchorSelect` prop instead.
 * See https://react-tooltip.com/docs/getting-started
 */
export type AnchorRef = RefObject<HTMLElement>

export interface TooltipContextData {
    activeAnchor: AnchorRef,
    anchorRefs: Set<AnchorRef>,
    attach(...refs: AnchorRef[]): void
    detach(...refs: AnchorRef[]): void
    setActiveAnchor(ref: AnchorRef): void
}

export interface TooltipControllerProps {
    afterHide?(): void,
    afterShow?(): void,
    /**
     * @deprecated Use the `data-tooltip-id` attribute, or the `anchorSelect` prop instead.
     * See https://react-tooltip.com/docs/getting-started
     */
    anchorId?: string,
    anchorSelect?: string,
    arrowColor?: CSSProperties['backgroundColor'],
    /**
     * @description see https://developer.mozilla.org/en-US/docs/Web/CSS/border.
     *
     * Adding a border with width > 3px, or with `em/cm/rem/...` instead of `px`
     * might break the tooltip arrow positioning.
     */
    border?: CSSProperties['border'],
    children?: TooltipChildren,
    className?: string,
    classNameArrow?: string,
    clickable?: boolean,
    closeOnEsc?: boolean,
    closeOnResize?: boolean,
    closeOnScroll?: boolean,
    content?: string,
    delayHide?: number,
    delayShow?: number,
    disableStyleInjection?: boolean | 'core',
    /**
     * @deprecated Use `openOnClick` instead.
     */
    events?: TooltipEvents[],
    float?: boolean,
    hidden?: boolean,
    /**
     * @deprecated Use `children` or `render` instead
     */
    html?: string,
    id?: string,
    isOpen?: boolean,
    middlewares?: Middleware[],
    noArrow?: boolean,
    offset?: TooltipOffset,
    opacity?: CSSProperties['opacity'],
    openOnClick?: boolean,
    place?: TooltipPlacement,
    position?: TooltipPosition,
    positionStrategy?: TooltipPositionStrategy,
    render?(render: { activeAnchor: HTMLElement | null, content: string | null; }): TooltipChildren,
    setIsOpen?(value: boolean): void,
    style?: CSSProperties,
    variant?: TooltipVariant,
    wrapper?: TooltipWrapper
}

export interface TooltipContextDataWrapper {
    getTooltipData(tooltipId?: string): TooltipContextData
}

export interface ITooltipContent {
    content: string
}

export interface ComputeTooltipPositions {
    border?: CSSProperties['border'],
    elementReference?: Element | HTMLElement | null,
    middlewares?: Middleware[],
    offset?: TooltipOffset,
    place?:
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'right'
    | 'right-start'
    | 'right-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'left'
    | 'left-start'
    | 'left-end',
    strategy?: 'absolute' | 'fixed'
    tooltipArrowReference?: Element | HTMLElement | null,
    tooltipReference?: Element | HTMLElement | null
}
