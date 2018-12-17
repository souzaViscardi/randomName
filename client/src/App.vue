<template>
  <div id="app">
    <nav-bar/>
    <main>
       <div class="container">
          <router-view></router-view>
       </div>
    </main>
  </div>
</template>

<script>
import navBar from './components/navBar.vue'
export default {
  name: 'app',
  components: { navBar }
}
</script>

<style>
@import '../../node_modules/bulma/bulma.sass';
body {
  margin: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

header{
  display: block;
  position: relative;
  font-size: 20px;
  line-height: 1;
  letter-spacing: .02em;
  font-weight: 400;
  box-sizing: border-box;
  padding-top: 16px;
}
.container {
  padding: 3rem;
}
</style>
