import { App } from 'vue'
import TitanForm from './src/Form.vue'
TitanForm.install = (app: App) => {
  app.component('TitanForm', TitanForm)
}

export default TitanForm
