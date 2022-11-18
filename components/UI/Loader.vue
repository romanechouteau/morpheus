<template>
  <div class="loader">
    <img class="logo-loader rotating" src="../../assets/logo-loader.svg" alt="">
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

.logo-loader
    width: 6em
.rotating
  animation rotating 2.5s linear infinite

@keyframes rotating
  0%
    transform rotate(0deg)
  20%
    transform rotate(-35deg)
  100%
    transform: rotate(360deg)

</style>
