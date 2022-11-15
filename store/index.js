const STEPS = {
  CAPSULE_PACKAGING: 0,
  CAPSULE: 1,
  PLUG_CAPSULE: 2,
  MORPHEUS: 3,
  CHIP_PACKAGING: 4,
  CHIP: 5,
  CHIP_DEPLOY: 6
}

export const state = () => ({
  step: STEPS.CAPSULE_PACKAGING
})

export const getters = {
  getStep (state) {
    return state.step
  }
}

export const mutations = {
  increment (state) {
    state.step++
  }
}
