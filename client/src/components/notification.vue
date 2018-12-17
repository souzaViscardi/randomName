
<template>
<transition name="fade">
 <article id="message" class="message" :class="css">
  <div class="message-header">
    <p>{{title}}</p>
    <button @click="hide" class="delete" aria-label="delete"></button>
  </div>
  <div class="message-body">
    {{body}}
  </div>
  </article>
</transition>

</template>

<script>
export default {
  name: 'message',
  props: {
    title: { type: String },
    body: { type: String },
    css: { type: String }
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js PWA'
    }
  },
  methods: {
    hide () {
      this.$emit('onClose')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
#message {
  position: absolute;
  z-index: 2;
  width: 1244px;
  .fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}


}
</style>
