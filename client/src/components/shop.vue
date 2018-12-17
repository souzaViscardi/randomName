<template>
  <div id="shop">
    <msg @onClose="hideMsg" v-show="showMsg" :title="title" :body="body" :css="css" />
    <header>
      <h1 class="title"> Sales area </h1>
    </header>
    <div class="shop-container">
      <p class="label">Select a client</p>
      <div class="select-container">
        <v-select :options="clients" label="name" :onChange="getClient"/>
      </div>
      <p v-show="client" class="label">MyCart: {{cartLength}}</p>
      <table v-show="client" class="table">
        <thead>
          <tr>
            <th class="product">Select product</th>
            <th class="quanty-container">Quanty</th>
            <th>Unity price</th>
            <th>Add to cart</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in items" :key="index">
            <th>
              <v-select v-model="myCart.products[index].product" :options="products" label="name" :onChange="getProduct()"/>
            </th>
            <th>
              <input v-model="myCart.products[index].quantity" @change="getQuantity(index)" class="quanty input" type="text">
              <div class="error" v-if="!$v.quantity.$each[index].quanty.required">Field is required</div>
              <div class="error" v-if="!$v.quantity.$each[index].quanty.integer">Must be an integer</div>
              <div class="error" v-if="!$v.quantity.$each[index].quanty.minValue && $v.quantity.$each[index].quanty.integer">Should bigger than 0</div>
              <div class="error" v-if="!$v.quantity.$each[index].quanty.maxValue && $v.quantity.$each[index].quanty.integer">Max value is 65536 </div>
            </th>
            <th>
              <div class="price-container">
                <input v-model="myCart.products[index]['unit_price']" @change="getPrice(index)" class="quanty input" type="text">
                <div class="error" v-if="!$v.prices.$each[index].price.required">Field is required</div>
                <div class="error" v-if="!$v.prices.$each[index].price.decimal">Must be a decimal</div>
                <div class="error" v-if="!$v.prices.$each[index].price.minValue && $v.prices.$each[index].price.decimal">Should bigger than 0</div>
                <div class="error" v-if="!$v.prices.$each[index].price.maxLength && $v.prices.$each[index].price.decimal">Max digits is 13</div>
              </div>
            </th>
            <th class="cart">
              <fa-icon icon="shopping-cart" class="icon"/>
              <fa-icon @click="addToCart(index)" icon="plus-circle" class="add-icon action-icon"/>
              <fa-icon @click="removeItem(index)" icon="minus-circle" class="remove-icon action-icon"/>
            </th>
          </tr>
        </tbody>
      </table>
      <div v-show="client" class="button-container">
          <router-link to="/" class="button is-danger is-outlined"> Cancel </router-link>
          <button class="button is-link" @click="createList"> Create </button>
      </div>
    </div>
    <loading v-show="isLoading" />
  </div>
</template>

<script>
import clientsService from '@/services/clients.js'
import productService from '@/services/products.js'
import salesService from '@/services/sales.js'
import msg from './notification.vue'
import loading from './loader.vue'
import { required, maxLength, integer, decimal, minValue, maxValue } from 'vuelidate/lib/validators'

export default {
  name: 'shop',
  components: { msg, loading },
  data () {
    return {
      clients: [],
      products: [],
      disable: true,
      isLoading: false,
      myCart: {
        client_id: '',
        products: [{
          product: {},
          id: '',
          quantity: '',
          'unit_price': ''
        }]
      },
      items: [1],
      client: '',
      showMsg: false,
      css: '',
      body: '',
      title: '',
      quantity: [{
        quanty: ''
      }],
      prices: [{
        price: ''
      }]
    }
  },
  validations: {
    quantity: {
      $each: {
        quanty: {
          required,
          integer,
          minValue: minValue(1),
          maxValue: maxValue(65536)
        }
      }
    },
    prices: {
      $each: {
        price: {
          required,
          decimal,
          minValue: minValue(1),
          maxLength: maxLength(13)
        }
      }
    }
  },
  mounted () {
    this.getData()
  },
  computed: {
    cartLength () {
      return this.myCart.products.length - 1
    }
  },
  methods: {
    async getData () {
      this.clients = await clientsService.get()
      this.products = await productService.get()
    },
    onChange (value, label) {
      this.values[label.toLowerCase()] = value
    },
    getClient (value) {
      console.log(value)
      if (value) {
        this.selected = value
        this.disable = false
        this.client = value.id
        this.myCart.products = [{
          product: {},
          id: '',
          quantity: '',
          'unit_price': ''
        }]
      } else {
        this.disable = true
        this.selected = null
      }
    },
    getProduct (value) {
      if (value) {
        this.selected = value
        this.disable = false
      } else {
        this.disable = true
        this.selected = null
      }
    },
    addToCart (index) {
      if (index === this.myCart.products.length - 1) {
        if (!this.$v.$invalid) {
          this.myCart.products[index].id = this.myCart.products[index].product.id
          if (this.myCart.products[index].id && this.myCart.products[index].quantity && this.myCart.products[index]['unit_price']) {
            const newItem = {
              id: '',
              quantity: '',
              'unit_price': ''
            }
            this.quantity.push({ quanty: '' })
            this.prices.push({ price: '' })
            this.myCart.products.push(newItem)
            this.items.push(1)
            console.log('item added', index, this.myCart)
          }
        } else {
          console.log('ta invalido')
          this.$v.quantity.$touch()
          this.$v.prices.$touch()
        }
      }
    },
    removeItem (index) {
      if (this.myCart.products.length >= 2) {
        this.myCart.products.splice(index, 1)
        this.items.splice(index, 1)
        console.log('item removed', index, this.myCart)
      }
    },
    async createList () {
      this.isLoading = true
      this.myCart[`client_id`] = this.client
      if (this.myCart.products.length < 1) {
        const blankItems = this.myCart.products.length - 1
        this.myCart.products.splice(blankItems, 1)
        this.items.splice(this.items.length - 1, 1)
      }
      if (!this.$v.$invalid) {
        const res = await salesService.sales(this.myCart)
        this.isLoading = false
        console.log(res)
        if (res.status >= 200 && res.status <= 399) {
          this.showMsg = true
          this.title = 'Success'
          this.body = 'Sales list has been added with success'
          this.css = 'is-primary'
        } else if (!res || res.status >= 400) {
          this.showMsg = true
          this.title = 'Danger'
          this.body = 'Could not added a sales list because an error with conection'
          this.css = 'is-danger'
        }
        setInterval(() => {
          this.showMsg = false
        }, 3000)
      } else {
        this.$v.quantity.$touch()
        this.$v.prices.$touch()
      }
    },
    getQuantity (index) {
      this.myCart.products[index].id = this.myCart.products[index].product.id
      this.quantity[index].quanty = this.myCart.products[index].quantity
      console.log(this.quantity)
      this.$v.quantity.$touch()
    },
    getPrice (index) {
      this.prices[index].price = this.myCart.products[index]['unit_price']
      console.log(this.prices)
      this.$v.prices.$touch()
    },
    hideMsg () {
      this.showMsg = false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
#shop {
  display: flex;
  flex-direction: column;
  .label {
    margin-top: 1.5rem;
  }
  .shop-container {
    display: flex;
    flex-direction: column;
    width: 60%;
    .select-container {
      width: 70%;
    }
    margin-top: 2rem;
    .table {
      margin-top: 1rem;
    }
    .quanty {
      width: 80%;
    }
    .price-container{
      width: 55%;
    }
    .error {
      color: #ff3860;
    }
    .quanty-container {
      width: 15%;
    }
    .product {
      width: 35%;
    }
    .icon {
      width: 2rem;
      height: 2rem;
    }
    .action-icon {
      margin-bottom: 10%;
      cursor: pointer;
    }
    .remove-icon {
      color: #ff3860;
    }
    .add-icon {
      margin-left: 0.5rem;
      color: #00b89c;
    }
    .button-container {
      margin-top: .5rem;
      display: flex;
      align-self: flex-end;
      width: 40%;
      justify-content: flex-end;
      .button {
        display: flex;
        margin-left: .5rem;
      }
    }
  }
}
</style>
