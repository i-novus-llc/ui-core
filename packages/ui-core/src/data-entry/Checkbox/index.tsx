import { CompoundComponent } from '../../core'

import { CheckboxGroup } from './CheckboxGroup'
import { CheckboxProps } from './index.types'
import { CheckboxBody } from './Checkbox'

export type { CheckboxProps } from './index.types'

export const Checkbox = CheckboxBody as CompoundComponent<CheckboxProps, {
    Group: typeof CheckboxGroup
}>

Checkbox.Group = CheckboxGroup
