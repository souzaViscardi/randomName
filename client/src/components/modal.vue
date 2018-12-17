<template>
<div id="modal" :class="{'is-active': active}" class="modal">
  <div class="modal-background" @click="close"></div>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">{{title}}</p>
      <button class="delete" aria-label="close"  @click="close"></button>
    </header>
    <section class="modal-card-body">
      <!-- Content ... -->
        <p class="label">Select a {{area}}</p>
        <v-select :options="options" label="name" :onChange="getItem"/>
        <div v-if="type === 'edit'">
          <div v-if="area === 'product'">
            <my-input :labelTop="true" class="padd" @input="onChange" label="Name" :fillValue="name" />
            <div class="error" v-if="!$v.name.minLength">Name must have at least {{$v.name.$params.minLength.min}} letters.</div>
            <div class="error" v-if="!$v.name.maxLength">Name must have less than {{$v.name.$params.maxLength.max}} letters.</div>
            <txt-area :fillValue="description" :value="description" label="Description" :labelTop="true" class="padd" @input="onChange"/>
            <div class="error" v-if="!$v.description.minLength">Description must have at least {{$v.description.$params.minLength.min}} letters.</div>
            <div class="error" v-if="!$v.description.maxLength">Description must have less than {{$v.description.$params.maxLength.max}} letters.</div>
          </div>
        <div v-if="area === 'client'">
          <my-input :labelTop="true" class="padd" @input="onChange" label="Name" :fillValue="cname" />
          <div class="error" v-if="!$v.cname.minLength">Name must have at least {{$v.cname.$params.minLength.min}} letters.</div>
          <div class="error" v-if="!$v.cname.maxLength">Name must have less than {{$v.cname.$params.maxLength.max}} letters.</div>
          <my-input :fillValue="email" :labelTop="true" class="padd" @input="onChange" label="Email" />
          <div class="error" v-if="!$v.email.email">Data must be an email</div>
          <div class="error" v-if="!$v.email.maxLength">Email must have less than {{$v.email.$params.maxLength.max}} letters.</div>
          <my-input :fillValue="address" :labelTop="true" class="padd" @input="onChange" label="Address"/>
          <div class="error" v-if="!$v.address.minLength">Address must have at least {{$v.address.$params.minLength.min}} letters.</div>
          <div class="error" v-if="!$v.address.maxLength">Address must have less than {{$v.address.$params.maxLength.max}} letters.</div>
        </div>
        </div>
    </section>
    <footer class="modal-card-foot">
      <button :disabled="disable" :class="{'is-danger': type !== 'edit'}" class="button is-primary"  @click="saveChange">Save changes</button>
      <button class="button"  @click="close">Cancel</button>
    </footer>
  </div>
</div>
</template>

<script>
import myInput from './form-elements/input.vue'
import txtArea from './form-elements/txtArea.vue'
import { minLength, maxLength, email } from 'vuelidate/lib/validators'

export default {
  name: 'modal',
  props: {
    showModal: { type: Boolean, default: false },
    title: { type: String },
    type: { type: String },
    options: { type: Array },
    area: { type: String }
  },
  components: { myInput, txtArea },
  data () {
    return {
      show: false,
      disable: true,
      values: {},
      name: '',
      description: '',
      cname: '',
      email: '',
      address: ''
    }
  },
  validations: {
    name: {
      minLength: minLength(3),
      maxLength: maxLength(75)
    },
    description: {
      minLength: minLength(4),
      maxLength: maxLength(255)
    },
    cname: {
      minLength: minLength(3),
      maxLength: maxLength(150)
    },
    email: {
      email,
      maxLength: maxLength(100)
    },
    address: {
      minLength: minLength(10),
      maxLength: maxLength(255)
    }
  },
  computed: {
    active () {
      this.show = this.showModal
      return this.show
    }
  },
  methods: {
    close () {
      this.$emit('onClose')
    },
    getItem (value) {
      console.log(value)
      if (value) {
        this.selected = value
        if (this.area === 'product') {
          this.name = value.name
          this.description = value.description
        }
        this.cname = value.name
        this.address = value.address
        this.email = value.email
        this.disable = false
      } else {
        this.disable = true
        this.selected = null
      }
    },
    saveChange () {
      if (!this.selected) {
        this.disable = true
      } else {
        if (this.type === 'edit') {
          console.log(this.values, this.area)
          if (this.area === 'product') {
            this.values.name = this.name
            this.values.description = this.description
            this.$v.name.$touch()
            this.$v.description.$touch()
          }
          if (this.area === 'client') {
            this.values.name = this.cname
            this.values.address = this.address
            this.values.email = this.email
            this.$v.cname.$touch()
            this.$v.address.$touch()
            this.$v.email.$touch()
          }
          if (!this.$v.$invalid) {
            this.$emit('onSave', this.values, this.selected.id)
            this.$emit('onClose')
          }
        } else {
          this.$emit('onDelete', this.selected)
          this.$emit('onClose')
        }
      }
    },
    onChange (value, label) {
      this.values[label.toLowerCase()] = value
      console.log(value, label)
      if (label === 'Name') {
        this.name = this.values.name
        this.$v.name.$touch()
      }
      if (label === 'Description') {
        this.description = this.values.description
        this.$v.description.$touch()
      }
      if (label === 'Email' && this.area === 'client') {
        this.email = this.values.email
        this.$v.email.$touch()
      }
      if (label === 'Address' && this.area === 'client') {
        this.address = this.values.address
        this.$v.address.$touch()
      }
      if (label === 'Name' && this.area === 'client') {
        this.cname = this.values.name
        this.$v.cname.$touch()
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.modal-card-body {
  min-height: 12rem;
  .label {
    font-weight: 400px;
  }
  .padd {
    padding-top: 1rem;
  }
  .error {
    color: #ff3860;
  }
}
</style>
