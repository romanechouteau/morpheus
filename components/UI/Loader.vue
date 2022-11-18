<template>
  <div class="loader">
    <img class="logo-loader pulse" src="../../assets/loader.svg" alt="">
  </div>
</template>
<style lang="stylus" scoped>
.loader
  position absolute;
  z-index 3
  top 0;
  left 0;
  width 100%;
  height 100%;
  overflow hidden;
  display flex
  justify-content center
  align-items center
  background white
  user-select: none

.logo-loader
    width: 6em
    user-select: none
.pulse
  animation pulse 1.5s linear infinite

@keyframes pulse
  0%
    transform scale(0)
    opacity 1
  100%
    transform scale(.5)
    opacity 0

</style>
