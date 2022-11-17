<template>
  <div>
    <Webgl />
    <Capsule v-if="step === steps.CAPSULE" />
    <Morpheus v-if="step === steps.MORPHEUS" />
    <Chip v-if="step === steps.CHIP" />
  </div>
</template>

<script>
import Chip from '~/components/Steps/Chip.vue'
import Webgl from '~/components/Webgl/index.vue'
import Capsule from '~/components/Steps/Capsule.vue'
import Morpheus from '~/components/Steps/Morpheus.vue'

import { STEPS } from '~/store/index'

export default {
  components: {
    Chip,
    Webgl,
    Capsule,
    Morpheus
  },
  computed: {
    step () {
      return this.$store.state.step
    },
    steps () {
      return STEPS
    }
  }
}
</script>

<style lang="styl">
@import '~/style/index.styl';
</style>
