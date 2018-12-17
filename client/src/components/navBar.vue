<template>
<div>
  <nav class="navbar is-link" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div id="navbarBasicExample" class="navbar-menu">
      <div class="navbar-start container">
        <router-link to="/" class="navbar-item">
          Dashboard
        </router-link>

       <router-link to="/shop" class="navbar-item">
          Sales
        </router-link>

        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link">
            Register
          </a>

          <div class="navbar-dropdown">
            <router-link to="/new/client" class="navbar-item">
              Client
            </router-link>
          <router-link to="/new/product" class="navbar-item">
              Product
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </nav>
</div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
 .navbar-start.container{
   padding: 0px;
 }
</style>
