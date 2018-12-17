<template>
  <div id="home">
    <header class="header title">
      <fa-icon  icon="chart-line"/>
      Dashboard
    </header>
    <p class="label"> Period </p>
    <hr>
    <div class="date-container">
      <p class="label"> Start date </p>
      <datepicker :language="ptBR" format="dd-MM-yyyy" input-class="input"  placeholder="start at.." v-model="startDate" />
    </div>
     <div v-show="startDate" class="date-container">
      <p class="label"> End date </p>
      <datepicker :open-date="new Date()" :language="ptBR" format="dd-MM-yyyy" input-class="input" placeholder="end at.." @input="getData()" v-model="endPeriod"/>
    </div>
      <loading v-show="isLoading" />
    <hr v-show="totalVendas">
    <div v-show="totalVendas" class="box">
      <p class="text-min"> Total sales in the period </p>
      <p class="label moeda">R$ {{moeda}} </p>
    </div>
    <div v-if="showChart" class="charts-container">
      <p class="label"> Client sales </p>
      <hr>
      <chart title="Total R$ sales" :dataLabel="labelData" :data="salesClient" />
      <p class="label product"> Product sales </p>
      <hr>
      <chart title="Total R$ sales" :dataLabel="labelDataProduct" :data="salesProduct" />
    </div>
  </div>
</template>

<script>
import salesService from '@/services/sales.js'
import {ptBR} from 'vuejs-datepicker/dist/locale'
import loading from './loader.vue'

export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js PWA',
      startDate: '',
      endPeriod: '',
      ptBR: ptBR,
      totalVendas: 0,
      moeda: '',
      showTotal: false,
      labelData: [],
      labelDataProduct: [],
      salesClient: [],
      labelTitle: 'Total R$ sales per client',
      showChart: false,
      salesProduct: [],
      isLoading: false

    }
  },
  components: { loading },
  methods: {
    async getData () {
      const end = new Date(this.endPeriod).toISOString().split('T')[0]
      const begin = new Date(this.startDate).toISOString().split('T')[0]
      this.isLoading = true
      const res = await salesService.getSales({ begin, end })
      this.isLoading = false
      this.showChart = true
      this.labelData = res.clients.map(element => {
        return element.name
      })
      this.salesClient = res.clients.map(element => {
        return element.total
      })
      this.salesProduct = res.products.map(element => {
        return element.total
      })
      this.labelDataProduct = res.products.map(element => {
        return element.name
      })
      console.log(this.labelData)
      console.log(res)
      res.products.forEach(element => {
        console.log(parseFloat(element.total))
        this.totalVendas += parseFloat(element.total)
      })
      this.showTotal = true
      /* eslint-disable-next-line */
      this.moeda = this.totalVendas.toFixed(2).toString().replace('.', ',').replace(/(\d)(?=(\d{3})+\,)/g, '$1.')
      console.log('oi', end, begin, this.moeda)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
#home {
  display: flex;
  flex-direction: column;
  .header {
    margin-bottom: 1.5rem;
    align-self: center;
  }
  .date-container {
    margin-top: 1rem;
    width: 10%;
  }
  .box {
    width: 25%;
    align-self: center;
  }
  .text-min {
    font-size: 1rem;
    text-align: center;
  }
  .moeda {
    padding-top: .3rem;
    text-align: center;
    font-size: 1.5rem;
  }
  .charts-container {
    margin-top: 2rem;
  }
  .label.product {
    margin-top: 3rem;
  }
}
</style>
