import 'styled-components'

import type { AppTheme } from './theme'

declare module 'styled-components' {
  // styled-components expects declaration merging for the app theme shape.
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends AppTheme {}
}
