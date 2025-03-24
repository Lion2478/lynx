import { defineConfig } from '@rspack/cli'
import react from '@lynx-js/react-rsbuild-plugin'

export default defineConfig({
  plugins: [
    react()
  ],
  dev: {
    port: 3000
  },
  html: {
    template: './index.html'
  }
})
