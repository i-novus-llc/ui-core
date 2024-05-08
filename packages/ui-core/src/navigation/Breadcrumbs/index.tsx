import { CompoundComponent } from '../../core'

import { Breadcrumbs as BreadcrumbsBody, BreadcrumbsProps } from './Breadcrumbs'
import { Crumb } from './Crumb'

export const Breadcrumbs = BreadcrumbsBody as CompoundComponent<BreadcrumbsProps, {
    Item: typeof Crumb
}>

Breadcrumbs.Item = Crumb
