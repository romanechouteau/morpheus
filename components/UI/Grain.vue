<template>
  <div>
    <div class="grain grain-animation-one" />
    <div class="grain grain-animation-two" />
  </div>
</template>
<script>
export default {
  data () {
    return {
      number: null
    }
  }
}
</script>
<style lang="stylus" scoped>
.grain
  position absolute;
  z-index 1
  top 0;
  left 0;
  width 100%;
  height 100%;
  overflow hidden;
  user-select: none
.grain-animation-one
  background-image url(../../assets/grain_1.svg)
  animation grain-one .1s linear infinite

.grain-animation-two
  background-image url(../../assets/grain_2.svg)
  animation grain-two .1s linear infinite

@keyframes grain-one
  0%
    opacity 0
  49%
    opacity 0
  50%
    opacity 0.3
  99%
    opacity 0.3
  100%
    opacity 0

@keyframes grain-two
  0%
    opacity 0.3
  49%
    opacity 0.3
  50%
    opacity 0
  99%
    opacity 0
  100%
    opacity 0.3
</style>
