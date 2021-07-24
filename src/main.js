import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//css
import './assets/css/tailwind.css'
//Axios
import VueAxios from 'vue-axios'
import Axios from 'axios'
//Other component
import VCalendar from 'v-calendar'

Vue.use(VueAxios, Axios);
Vue.use(VCalendar, {});

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
