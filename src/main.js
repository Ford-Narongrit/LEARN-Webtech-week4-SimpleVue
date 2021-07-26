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
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

Vue.use(VueAxios, Axios);
Vue.use(VCalendar, {});
Vue.use(VueSweetalert2);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
