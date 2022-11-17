<template>
  <div class="gradient" />
</template>

<style lang="stylus" scoped>
.gradient
    position absolute;
    z-index 1
    top 0;
    right 0;
    width 30vh;
    height 100vh;
    background-image linear-gradient(to right, rgba(0,0,0,0),rgba(0,0,0,0))
    transition background-image 0.5s ease
    &:hover
        background-image linear-gradient(-270deg, rgba(0,0,0,0),rgba(0,0,0,0.1))

  </style>
