<template>
  <div id="novo-cliente">
    <msg @onClose="hideMsg" v-show="showMsg" :title="title" :body="body" :css="css" />
    <header>
      <h1 class="title">Client</h1>
    </header>
    <div>
        <div class="formulario">
          <my-input class="padd" @input="onChange" label="Name"/>
          <div class="error" v-if="!$v.name.required">Field is required</div>
          <div class="error" v-if="!$v.name.minLength">Name must have at least {{$v.name.$params.minLength.min}} letters.</div>
          <div class="error" v-if="!$v.name.maxLength">Name must have less than {{$v.name.$params.maxLength.max}} letters.</div>
          <my-input class="padd" @input="onChange" label="Email"/>
          <div class="error" v-if="!$v.email.required">Field is required</div>
          <div class="error" v-if="!$v.email.email">Data must be an email</div>
          <div class="error" v-if="!$v.email.maxLength">Email must have less than {{$v.email.$params.maxLength.max}} letters.</div>
          <my-input class="padd" @input="onChange" label="Address"/>
          <div class="error" v-if="!$v.address.required">Field is required</div>
          <div class="error" v-if="!$v.address.minLength">Address must have at least {{$v.address.$params.minLength.min}} letters.</div>
          <div class="error" v-if="!$v.address.maxLength">Address must have less than {{$v.address.$params.maxLength.max}} letters.</div>
          <div class="button-container">
            <router-link to="/" class="button is-danger is-outlined"> Cancel </router-link>
            <button class="button is-link" @click="onSend"> Create </button>
            <button class="button is-danger" @click="showModal('Delete client', 'delete')"> Delete </button>
            <button class="button is-link" @click="showModal('Edit client', 'edit')"> Edit </button>
          </div>
          <loading v-show="isLoading" />
        </div>
    </div>
    <modal area="client" @onSave="edit" @onDelete="remove" :type="modalType" :showModal="active" @onClose="hideModal" :title="modalTitle" :options="clients"/>
  </div>
</template>

<script>
import myInput from '../form-elements/input.vue'
import modal from '../modal.vue'
import msg from '../notification.vue'
import loading from '../loader.vue'
import clientsService from '@/services/clients.js'
import { required, minLength, maxLength, email } from 'vuelidate/lib/validators'

export default {
  name: 'hello',
  components: { myInput, modal, msg, loading },
  data () {
    return {
      values: {
      },
      isLoading: false,
      value: '',
      clients: [],
      modalType: '',
      modalTitle: '',
      active: false,
      name: '',
      email: '',
      address: '',
      css: '',
      body: '',
      title: '',
      showMsg: false
    }
  },
  validations: {
    name: {
      required,
      minLength: minLength(3),
      maxLength: maxLength(150)
    },
    email: {
      email,
      required,
      maxLength: maxLength(100)
    },
    address: {
      required,
      minLength: minLength(10),
      maxLength: maxLength(255)
    }
  },
  mounted () {
    this.getClients()
  },
  methods: {
    async onSend () {
      if (!this.$v.$invalid) {
        this.isLoading = true
        const res = await clientsService.create(this.values)
        this.isLoading = false
        if (res.status >= 200 && res.status <= 399) {
          this.showMsg = true
          this.title = 'Success'
          this.body = 'Client has been added with success'
          this.css = 'is-primary'
        } else if (!res || res.status >= 400) {
          this.showMsg = true
          this.title = 'Danger'
          this.body = 'Could not added a client because an error with conection'
          this.css = 'is-danger'
        }
        setInterval(() => {
          this.showMsg = false
        }, 3000)
        this.getClients()
      } else {
        this.$v.name.$touch()
        this.$v.email.$touch()
        this.$v.address.$touch()
      }
    },
    onChange (value, label) {
      this.values[label.toLowerCase()] = value
      if (label === 'Name') {
        this.name = this.values.name
        this.$v.name.$touch()
      }
      if (label === 'Email') {
        this.email = this.values.email
        this.$v.email.$touch()
      }
      if (label === 'Address') {
        this.address = this.values.address
        this.$v.address.$touch()
      }
    },
    showModal (title, type) {
      this.modalTitle = title
      this.modalType = type
      this.active = true
      this.getClients()
    },
    hideModal () {
      this.getClients()
      this.active = false
    },
    async getClients () {
      this.clients = await clientsService.get()
    },
    async remove (selected) {
      this.isLoading = true
      const res = await clientsService.remove(selected.id)
      this.isLoading = false
      if (res.status >= 200 && res.status <= 399) {
        this.showMsg = true
        this.title = 'Success'
        this.body = 'Client has been removed with success'
        this.css = 'is-primary'
      } else if (!res || res.status >= 400) {
        this.showMsg = true
        this.title = 'Danger'
        this.body = 'Could not remove the client because an error with conection'
        this.css = 'is-danger'
      }
      setInterval(() => {
        this.showMsg = false
      }, 3000)
    },
    async edit (values, id) {
      this.isLoading = true
      values['_method'] = 'PATCH'
      const res = await clientsService.edit(values, id)
      this.isLoading = false
      if (res.status >= 200 && res.status <= 399) {
        this.showMsg = true
        this.title = 'Success'
        this.body = 'Client has been edited with success'
        this.css = 'is-primary'
      } else if (!res || res.status >= 400) {
        this.showMsg = true
        this.title = 'Danger'
        this.body = 'Could not eddit the client because an error with conection'
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
  .formulario{
    margin-top: .5rem;
    display: flex;
    flex-direction: column;
    width: 50%;
    .padd{
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
