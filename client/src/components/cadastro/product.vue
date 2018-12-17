<template>
  <div id="novo-cliente">
    <msg @onClose="hideMsg" v-show="showMsg" :title="title" :body="body" :css="css" />
    <header>
      <h1 class="title">Product</h1>
    </header>
    <div>
        <div class="formulario">
          <my-input class="padd" @input="onChange" label="Name"/>
          <div class="error" v-if="!$v.name.required">Field is required</div>
          <div class="error" v-if="!$v.name.minLength">Name must have at least {{$v.name.$params.minLength.min}} letters.</div>
          <div class="error" v-if="!$v.name.maxLength">Name must have less than {{$v.name.$params.maxLength.max}} letters.</div>
          <txt-area class="padd" @input="onChange" label="Description"/>
          <div class="error" v-if="!$v.description.required">Field is required</div>
          <div class="error" v-if="!$v.description.minLength">Description must have at least {{$v.description.$params.minLength.min}} letters.</div>
          <div class="error" v-if="!$v.description.maxLength">Description must have less than {{$v.description.$params.maxLength.max}} letters.</div>
          <div class="button-container">
            <router-link to="/" class="button is-danger is-outlined"> Cancel </router-link>
            <button class="button is-link" @click="onSend"> Create </button>
            <button class="button is-danger" @click="showModal('Delete product', 'delete')"> Delete </button>
            <button class="button is-link" @click="showModal('Edit product', 'edit')"> Edit </button>
          </div>
          <loading v-show="isLoading" />
        </div>
        <modal area="product" @onSave="editProduct" @onDelete="removeProduct" :type="modalType" :showModal="active" @onClose="hideModal" :title="modalTitle" :options="products"/>
    </div>
  </div>
</template>

<script>
import myInput from '../form-elements/input.vue'
import txtArea from '../form-elements/txtArea.vue'
import msg from '../notification.vue'
import modal from '../modal.vue'
import loading from '../loader.vue'
import productService from '@/services/products.js'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'

export default {
  name: 'hello',
  components: { myInput, txtArea, modal, msg, loading },
  data () {
    return {
      values: {
      },
      value: '',
      isLoading: false,
      active: false,
      modalType: '',
      modalTitle: '',
      products: [],
      name: '',
      description: '',
      showMsg: false,
      css: '',
      body: '',
      title: ''
    }
  },
  validations: {
    name: {
      required,
      minLength: minLength(3),
      maxLength: maxLength(75)
    },
    description: {
      required,
      minLength: minLength(4),
      maxLength: maxLength(255)
    }
  },
  mounted () {
    this.getProducts()
  },
  methods: {
    async onSend () {
      if (!this.$v.$invalid) {
        this.isLoading = true
        const res = await productService.create(this.values)
        this.isLoading = false
        if (res.status >= 200 && res.status <= 399) {
          this.showMsg = true
          this.title = 'Success'
          this.body = 'Product has been added with success'
          this.css = 'is-primary'
        } else if (!res || res.status >= 400) {
          this.showMsg = true
          this.title = 'Danger'
          this.body = 'Could not added a product because an error with conection'
          this.css = 'is-danger'
        }
        this.getProducts()
        setInterval(() => {
          this.showMsg = false
        }, 3000)
      } else {
        this.$v.name.$touch()
        this.$v.description.$touch()
      }
    },
    onChange (value, label) {
      console.log(value, label)
      this.values[label.toLowerCase()] = value
      if (label === 'Name') {
        this.name = this.values.name
        this.$v.name.$touch()
      }
      if (label === 'Description') {
        this.description = this.values.description
        this.$v.description.$touch()
      }
    },
    showModal (title, type) {
      this.modalTitle = title
      this.modalType = type
      this.active = true
      this.getProducts()
    },
    hideModal () {
      this.active = false
      this.getProducts()
    },
    async getProducts () {
      this.products = await productService.get()
      console.log(this.products)
    },
    async removeProduct (selected) {
      this.isLoading = true
      const res = await productService.remove(selected.id)
      this.isLoading = false
      if (res.status >= 200 && res.status <= 399) {
        this.showMsg = true
        this.title = 'Success'
        this.body = 'Product has been removed with success'
        this.css = 'is-primary'
      } else if (!res || res.status >= 400) {
        this.showMsg = true
        this.title = 'Danger'
        this.body = 'Could not remove the product because an error with conection'
        this.css = 'is-danger'
      }
      setInterval(() => {
        this.showMsg = false
      }, 3000)
    },
    async editProduct (values, id) {
      this.isLoading = true
      const res = await productService.edit(values, id)
      this.isLoading = false
      console.log(res)
      if (res.status >= 200 && res.status <= 399) {
        this.showMsg = true
        this.title = 'Success'
        this.body = 'Product has been edited with success'
        this.css = 'is-primary'
      } else if (!res || res.status >= 400) {
        this.showMsg = true
        this.title = 'Danger'
        this.body = 'Could not eddit the product because an error with conection'
        this.css = 'is-danger'
      }
      setInterval(() => {
        this.showMsg = false
      }, 3000)
    },
    hideMsg () {
      this.showMsg = false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
li {
  display: inline-block;
  margin: 0 10px;
}
#novo-cliente {
  .formulario {
    margin-top: .5rem;
    display: flex;
    flex-direction: column;
    width: 50%;
    .padd {
      padding-top: 1rem;
    }
    .button-container {
      margin-top: .5rem;
      display: flex;
      align-self: flex-end;
      width: 40%;
      justify-content: flex-end;
    }
    .button {
      display: flex;
      margin-left: .5rem;
    }
    .error {
      margin-left: 6rem;
      color: #ff3860;
    }
  }
}

</style>
