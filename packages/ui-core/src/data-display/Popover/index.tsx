import { CompoundComponent } from '../../core'

import { Body } from './Body'
import { Header } from './Header'
import { Content } from './Content'
import { Footer } from './Footer'
import { PopoverProps } from './types'

export const Popover = Body as CompoundComponent<PopoverProps, {
    Content: typeof Content,
    Footer: typeof Footer,
    Header: typeof Header
}>

Popover.Header = Header
Popover.Content = Content
Popover.Footer = Footer

Popover.displayName = 'Popover'
