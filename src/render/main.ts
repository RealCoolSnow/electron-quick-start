import './styles/main.css'
import { createApp } from 'vue'
import router from './router'
import { Toast, Dialog, Loading } from 'vant'
import App from './App.vue'
import { createI18nWithLocale } from './locale'
import store from './store'
import 'vant/lib/index.css'

const i18n = createI18nWithLocale(store.getters.language)

const app = createApp(App as any)
app.use(store)
app.use(i18n)
app.use(router)

// vant
const vantComponents = [Toast, Dialog, Loading]
for (const item of vantComponents) app.use(item)

app.mount('#app').$nextTick(window.ClosePreloadLoading)
