import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import '@lottiefiles/lottie-player'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import './style.less'

createApp(App)
  .use(createPinia())
  .use(ElementPlus)
  .mount('#app')

