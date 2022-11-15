<template>
  <div role="none" class="webgl">
    <canvas id="canvas-3D" ref="webglCanvas" />
    <div v-if="!isLoaded" class="loader" />
  </div>
</template>

<script>
import Vue from 'vue'

import Webgl from '~/webgl/index'

export default Vue.extend({
  data () {
    return {
      webgl: undefined
    }
  },
  computed: {
    isLoaded () {
      return this.webgl && this.webgl.isLoaded
    }
  },
  mounted () {
    this.webgl = new Webgl({
      canvas: this.$refs.webglCanvas
    })
    this.webgl.render()

    window.addEventListener('resize', this.resize)
    window.addEventListener('focus', this.focus)
    window.addEventListener('blur', this.blur)
  },
  methods: {
    resize () {
      if (this.webgl) { this.webgl.resize(window.innerWidth, window.innerHeight) }
    },
    focus () {
      if (this.webgl) { this.webgl.hasFocus = true }
    },
    blur () {
      if (this.webgl) { this.webgl.hasFocus = false }
    }
  }
})
</script>

<style lang="stylus">
.webgl
  position absolute;
  top 0;
  left 0;
  width 100%;
  height 100%;
  overflow hidden;

  canvas
    position absolute;
    top 0;
    left 0;
    width 100%;
    height 100%;

.loader
  position absolute;
  top 0;
  left 0;
  width 100%;
  height 100%;
  overflow hidden;
  background-color red;
</style>
