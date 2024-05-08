import { NavigationProps } from '../types'

import { YearViewNavigation } from './YearViewNavigation'
import { MonthViewNavigation } from './MonthViewNavigation'

export const Navigation = ({ view, ...navigationProps }: NavigationProps) => {
    if (view === 'year') {
        return <YearViewNavigation {...navigationProps} />
    }

    return <MonthViewNavigation {...navigationProps} />
}
