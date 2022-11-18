<template>
  <Transition appear>
    <img class="button" src="../../assets/button.svg" @click="handleClick">
  </Transition>
</template>

<script>
export default {
  methods: {
    handleClick () {
      this.$emit('click')
    }
  }
}
</script>

<style lang="stylus" scoped>
.button
  position absolute
  z-index 2
  right 2.5em
  border-radius 25%
  cursor pointer
  transition right .3s ease
  &:hover
    right 2em

.v-enter-active,
.v-leave-active
  transition opacity 2s ease

.v-enter-from,
.v-leave-to
  opacity 0
</style>
