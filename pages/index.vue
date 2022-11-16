<template>
  <div>
    <Webgl />
    <CapsulePackaging v-if="step === steps.CAPSULE_PACKAGING" />
    <Capsule v-if="step === steps.CAPSULE" />
  </div>
</template>

<script>
import Webgl from '~/components/Webgl/index.vue'
import Capsule from '~/components/Steps/Capsule.vue'
import CapsulePackaging from '~/components/Steps/CapsulePackaging.vue'

import { STEPS } from '~/store/index'

export default {
  components: {
    Webgl,
    Capsule,
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

<style lang="styl">
@import '~/style/index.styl';
</style>
