// App.vue

<template>
  <div>
    <nav class="navbar is-primary">
      <div class="container">
        <div id="navMenu" class="navbar-menu">
          <div class="navbar-start">         
              <router-link to="/" class="navbar-item">Home</router-link>
              <router-link to="/create" class="navbar-item">Create Post</router-link>
              <router-link to="/edit/21" class="navbar-item">Edit Post</router-link>
              <router-link to="/posts" class="navbar-item">Posts</router-link>
          </div>
        </div>
      </div>
    </nav>
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>

export default {
  name: 'app'
}
</script>

<style lang="scss">
  @import "~bulma/css/bulma.css";
</style>
