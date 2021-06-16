<template>
<!-- лейаут авторизации -->
  <div class="wrap-app blue-grey lighten-5">
    <router-view />
  </div>
</template>

<script>

export default {
  computed: {
    error() {
      return this.$store.getters.error
    }
  },
  watch: {
  }
}
</script>
