import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import { setupStore } from '@/store'

import '@/permission'

import 'virtual:svg-icons-register'
import '@/assets/font-barlow/font-barlow.css'

import '@/styles/index.scss'
import 'uno.css'

import MyCard from '@/components/MyCard/index.vue'
import NumberShow from '@/components/NumberShow/index.vue'
import CopyIt from '@/components/CopyIt/index.vue'
import TitanTable from '@/components/TitanTable/index.ts'
const app = createApp(App)

setupStore(app)

app.component('MyCard', MyCard)
app.component('NumberShow', NumberShow)
app.component('CopyIt', CopyIt)
app.use(TitanTable)

app.use(router).mount('#app')
