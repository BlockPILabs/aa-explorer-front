import { App } from 'vue'
import TitanTable from './src/Table.vue'
export default {
  install: (app: App) => {
    app.component('TitanTable', TitanTable)
  }
}
