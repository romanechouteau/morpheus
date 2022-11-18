<template>
  <div ref="gradient" class="gradient" :class="{ hover }" @mouseenter="hoverStart" @mouseleave="hoverStop" />
</template>

<script>
export default {
  data () {
    return {
      hover: false
    }
  },
  methods: {
    hoverStart () {
      this.hover = true
    },
    hoverStop (el) {
      if (el.toElement && el.toElement.classList && el.toElement.classList.contains('button')) { return null }
      this.hover = false
    }
  }
}
</script>

<style lang="stylus" scoped>
.gradient
  position absolute;
  z-index 1
  top 0;
  right 0;
  width 30vw;
  height 100vh;
  opacity 0;
  background-image linear-gradient(-270deg, rgba(0,0,0,0),rgba(0,0,0,0.1))
  transition opacity 0.5s ease
  &.hover
    opacity 1;
  </style>
