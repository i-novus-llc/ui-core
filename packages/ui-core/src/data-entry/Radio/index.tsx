import { CompoundComponent } from '../../core'

import { Radio as RadioBody } from './Radio'
import { RadioButton } from './RadioButton'
import { RadioGroup } from './RadioGroup'
import { RadioProps } from './index.types'

export type { RadioProps } from './index.types'

export const Radio = RadioBody as CompoundComponent<RadioProps, {
    Button: typeof RadioButton,
    Group: typeof RadioGroup
}>

Radio.Group = RadioGroup
Radio.Button = RadioButton
