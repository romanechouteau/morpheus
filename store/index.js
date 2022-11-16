export const STEPS = {
  CAPSULE_PACKAGING: 0,
  CAPSULE: 1,
  PLUG_CAPSULE: 2,
  MORPHEUS: 3,
  CHIP: 4,
  CHIP_MOVE: 5,
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
  incrementStep (state) {
    state.step++
  }
}
