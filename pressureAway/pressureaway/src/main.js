import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ganttastic from '@infectoone/vue-ganttastic'

createApp(App).use(router).use(ganttastic).mount('#app')
