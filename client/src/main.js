// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueSelect from 'vue-select'
import datePicker from 'vuejs-datepicker'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faShoppingCart, faPlusCircle, faMinusCircle, faChartLine } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { Bar } from 'vue-chartjs'
import Vuelidate from 'vuelidate'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

Vue.component('chart', {
  extends: Bar,
  props: {
    dataLabel: { type: Array },
    data: { type: Array },
    title: { type: String }
  },
  mounted () {
    this.renderChart({
      labels: this.dataLabel,
      datasets: [
        {
          label: this.title,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          data: this.data,
          borderWidth: 1
        }
      ],
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    }, {responsive: true, maintainAspectRatio: false})
  }
})
require('./assets/sass/main.scss')
Vue.config.productionTip = false
Vue.component('v-select', VueSelect)
Vue.component('loader', PulseLoader)
Vue.component('datepicker', datePicker)
Vue.use(Vuelidate)

library.add(faShoppingCart, faPlusCircle, faMinusCircle, faChartLine)
Vue.component('fa-icon', FontAwesomeIcon)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
