<template>
  <div>
    <Logo />
    <Webgl />
    <Gradient />
    <Capsule v-if="step === steps.CAPSULE" />
    <Morpheus v-if="step === steps.MORPHEUS" />
    <Chip v-if="step === steps.CHIP" />
    <Transition appear>
      <End ref="end" />
    </Transition>
  </div>
</template>

<script>
import gsap from 'gsap'
import Logo from '~/components/UI/Logo.vue'
import End from '~/components/UI/End.vue'
import Gradient from '~/components/UI/Gradient.vue'
import Chip from '~/components/Steps/Chip.vue'
import Webgl from '~/components/Webgl/index.vue'
import Capsule from '~/components/Steps/Capsule.vue'
import Morpheus from '~/components/Steps/Morpheus.vue'

import { STEPS } from '~/store/index'

export default {
  components: {
    Logo,
    End,
    Gradient,
    Chip,
    Webgl,
    Capsule,
    Morpheus
  },
  data () {
    return {
      showEnd: false
    }
  },
  computed: {
    step () {
      return this.$store.state.step
    },
    steps () {
      return STEPS
    }
  },
  watch: {
    step (val) {
      setTimeout(() => {
        this.showEndComponent(val)
      }, 5000)
    }
  },
  methods: {
    showEndComponent (step) {
      if (step === this.steps.CHIP_DEPLOY) {
        this.showEnd = true

        gsap.to(this.$refs.end.$el, {
          opacity: 1,
          duration: 2
        })
      }
    }
  }
}
</script>

<style lang="stylus">
@import '~/style/index.styl';

.v-enter-active, .v-leave-active
    transition opacity 2s ease

.v-enter-from, .v-leave-to
    opacity 0
</style>
