<template>
  <div>
    <Logo />
    <Webgl />
    <CapsulePackaging v-if="step === steps.CAPSULE_PACKAGING" />
    <Capsule v-if="step === steps.CAPSULE" />
    <Morpheus v-if="step === steps.MORPHEUS" />
    <Chip v-if="step === steps.CHIP" />
  </div>
</template>

<script>
import Logo from '~/components/UI/Logo.vue'
import Chip from '~/components/Steps/Chip.vue'
import Webgl from '~/components/Webgl/index.vue'
import Capsule from '~/components/Steps/Capsule.vue'
import Morpheus from '~/components/Steps/Morpheus.vue'
import CapsulePackaging from '~/components/Steps/CapsulePackaging.vue'

import { STEPS } from '~/store/index'

export default {
  components: {
    Logo,
    Chip,
    Webgl,
    Capsule,
    Morpheus,
    CapsulePackaging
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

<style lang="stylus">
@import '~/style/index.styl';
</style>
