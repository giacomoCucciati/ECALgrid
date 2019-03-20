<template>
  <div>
    I'm the Home Component.
    <button id="testButton" class="button is-primary" v-on:click="greet">Buttoooooon</button>
  </div>
</template>
<script>
export default {
  methods: {
    greet () {
      let uri = 'http://localhost:4000/posts/pippo';
      this.axios.get(uri).then(function (response) {
        // handle success
        console.log(response);
      }).catch(function (error) {
        // handle error
        console.log(error);
      }).then(function () {
        // always executed
      });
    }
  }
}
</script>