<template>
  <div class="step chip">
    <Button @click="onClick" />
  </div>
</template>

<script>
import Button from '~/components/UI/Button.vue'

export default {
  components: {
    Button
  },
  methods: {
    onClick () {
      this.$store.commit('incrementStep')
    }
  }
}
</script>
