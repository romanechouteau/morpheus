<template>
  <div class="end">
    <img class="logo" src="../../assets/logo-white.svg" alt="logo">
  </div>
</template>
<script>
export default {
}
</script>
<style lang="stylus" scoped>
.end
  position absolute
  z-index 3
  top 0
  left 0
  width 100%
  height 100%
  overflow hidden
  display flex
  justify-content center
  align-items center
  background black
  user-select none
  opacity: 0
  pointer-events: none

img
  width 10em

</style>
