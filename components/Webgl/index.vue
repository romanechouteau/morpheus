<template>
  <div role="none" class="webgl">
    <canvas id="canvas-3D" ref="webglCanvas" />
    <Loader v-if="!isLoaded" />
  </div>
</template>

<script>
import Vue from 'vue'

import Webgl from '~/webgl/index'

import Loader from '~/components/UI/Loader.vue'

export default Vue.extend({
  components: {
    Loader
  },
  data () {
    return {
      webgl: undefined
    }
  },
  computed: {
    isLoaded () {
      return this.webgl && this.webgl.isLoaded
    },
    step () {
      return this.$store.state.step
    }
  },
  watch: {
    step (val) {
      if (this.webgl) { this.webgl.handleStep(val) }
    }
  },
  mounted () {
    this.webgl = new Webgl({
      canvas: this.$refs.webglCanvas,
      store: this.$store
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
</style>
