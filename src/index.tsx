import { root } from '@lynx-js/react'
import { NewScreen } from './App4.jsx'

root.render(<NewScreen />)

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
}
