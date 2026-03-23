import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './stores'
import Antd from 'ant-design-vue'
import i18n from './i18n'
import permission from '@/directives/permission'
import 'ant-design-vue/dist/reset.css'
import './styles/global.less'

const app = createApp(App)

app.use(store)
app.use(router)
app.use(Antd)
app.use(i18n)
app.use(permission)

app.mount('#app')
