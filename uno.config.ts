import { defineConfig, presetAttributify, presetUno } from 'unocss'

export default defineConfig({
  shortcuts: [
    ['flex-common', 'flex items-center justify-between'],
    ['flex-center', 'flex items-center justify-center'],
    [
      'position-center',
      'absolute left-1/2 top-1/2 text-white -translate-x-1/2 -translate-y-1/2'
    ]
  ],

  presets: [presetUno(), presetAttributify()]
})
