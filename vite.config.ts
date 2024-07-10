import vue from '@vitejs/plugin-vue'

import { UserConfig, ConfigEnv, loadEnv, defineConfig } from 'vite'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'

import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

import visualizer from 'rollup-plugin-visualizer'

import UnoCSS from 'unocss/vite'
import path from 'path'

import viteCompression from 'vite-plugin-compression'
import vueJsx from '@vitejs/plugin-vue-jsx'

const pathSrc = path.resolve(__dirname, 'src')

export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, process.cwd())
  return {
    base: env.VITE_APP_BASE_PATH,
    resolve: {
      alias: {
        '@': pathSrc
      }
    },
    css: {
      preprocessorOptions: {
        //define global scss variable
        scss: {
          javascriptEnabled: true,
          additionalData: `
            @use "@/styles/variables.scss" as *;
          `
        }
      }
    },
    // server: {
    //   host: '0.0.0.0',
    //   port: Number(env.VITE_APP_PORT),
    //   open: false,
    //   proxy: {
    //
    //     [env.VITE_APP_BASE_API]: {
    //       target: env.VITE_APP_TARGET_URL,
    //       changeOrigin: true,
    //       rewrite: (path) =>
    //         path.replace(
    //           new RegExp('^' + env.VITE_APP_BASE_API),
    //           env.VITE_APP_TARGET_BASE_API
    //         ) // repalce /dev-api for target host
    //     }
    //   }
    // },
    plugins: [
      vue(),
      vueJsx(),
      UnoCSS({}),
      AutoImport({
        imports: ['vue', '@vueuse/core'],
        resolvers: [
          ElementPlusResolver(),
          IconsResolver({
            prefix: 'Icon'
          })
        ],
        dts: 'src/types/auto-imports.d.ts'
      }),

      Components({
        resolvers: [
          ElementPlusResolver({
            importStyle: 'sass'
          }),
          IconsResolver({
            enabledCollections: ['ep']
          })
        ],
        dts: 'src/types/components.d.ts'
      }),

      Icons({
        autoInstall: true
      }),

      createSvgIconsPlugin({
        iconDirs: [path.resolve(pathSrc, 'assets/icons')],
        symbolId: 'icon-[dir]-[name]'
      }),

      viteCompression({
        verbose: true,
        disable: true,
        deleteOriginFile: true,
        threshold: 10240,
        algorithm: 'gzip',
        ext: '.gz'
      }),

      visualizer({
        filename: './stats.html',
        open: false,
        gzipSize: true,
        brotliSize: true
      })
    ],

    optimizeDeps: {
      include: [
        'vue',
        'vue-router',
        'pinia',
        'axios',
        'element-plus/es/components/form/style/css',
        'element-plus/es/components/form-item/style/css',
        'element-plus/es/components/button/style/css',
        'element-plus/es/components/input/style/css',
        'element-plus/es/components/input-number/style/css',
        'element-plus/es/components/switch/style/css',
        'element-plus/es/components/upload/style/css',
        'element-plus/es/components/menu/style/css',
        'element-plus/es/components/col/style/css',
        'element-plus/es/components/icon/style/css',
        'element-plus/es/components/row/style/css',
        'element-plus/es/components/tag/style/css',
        'element-plus/es/components/dialog/style/css',
        'element-plus/es/components/loading/style/css',
        'element-plus/es/components/radio/style/css',
        'element-plus/es/components/radio-group/style/css',
        'element-plus/es/components/popover/style/css',
        'element-plus/es/components/scrollbar/style/css',
        'element-plus/es/components/tooltip/style/css',
        'element-plus/es/components/dropdown/style/css',
        'element-plus/es/components/dropdown-menu/style/css',
        'element-plus/es/components/dropdown-item/style/css',
        'element-plus/es/components/sub-menu/style/css',
        'element-plus/es/components/menu-item/style/css',
        'element-plus/es/components/divider/style/css',
        'element-plus/es/components/card/style/css',
        'element-plus/es/components/link/style/css',
        'element-plus/es/components/breadcrumb/style/css',
        'element-plus/es/components/breadcrumb-item/style/css',
        'element-plus/es/components/table/style/css',
        'element-plus/es/components/tree-select/style/css',
        'element-plus/es/components/table-column/style/css',
        'element-plus/es/components/select/style/css',
        'element-plus/es/components/option/style/css',
        'element-plus/es/components/pagination/style/css',
        'element-plus/es/components/tree/style/css',
        'element-plus/es/components/alert/style/css',
        'element-plus/es/components/radio-button/style/css',
        'element-plus/es/components/checkbox-group/style/css',
        'element-plus/es/components/checkbox/style/css',
        'element-plus/es/components/tabs/style/css',
        'element-plus/es/components/tab-pane/style/css',
        'element-plus/es/components/rate/style/css',
        'element-plus/es/components/date-picker/style/css',
        'element-plus/es/components/notification/style/css',
        '@vueuse/core',

        'path-to-regexp'
      ]
    }
  }
})
