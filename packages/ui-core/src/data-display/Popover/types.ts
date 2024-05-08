import { MutableRefObject, ReactElement, ReactNode, RefObject } from 'react'

import { ITooltipProps, TooltipEvents, TooltipPlacement } from '../Tooltip/types'
import { ComponentBaseProps } from '../../core'

export type PopoverTrigger = TooltipEvents
export type PopoverPlacement = TooltipPlacement

export interface PopoverProps extends ComponentBaseProps, Pick<ITooltipProps, 'anchorId' | 'afterShow' | 'afterHide' | 'offset' | 'closeOnEsc' | 'closeOnScroll' | 'closeOnResize'> {
    childrenWrapperClassName?: string,
    components: {
        Content: ReactNode,
        Footer?: ReactNode,
        Header?: ReactElement
    },
    containerId?: string,
    getContainer?(): Element,
    onCaptureSetFocusAfterTabKeyDown?(elem: HTMLElement): void,
    onClose?(): void,
    onOpenChange?(open: boolean): void,
    open?: boolean,
    placement?: PopoverPlacement,
    readOnly?: boolean,
    returnFocusRef?: MutableRefObject<HTMLElement> | RefObject<HTMLElement>,
    size?: 'sm' | 'lg',
    trigger?: PopoverTrigger
}
