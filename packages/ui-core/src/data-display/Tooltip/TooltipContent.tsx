/* eslint-disable react/no-danger */
import type { ITooltipContent } from './types'

export const TooltipContent = ({ content }: ITooltipContent) => {
    return <span dangerouslySetInnerHTML={{ __html: content }} />
}
