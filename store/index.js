export const STEPS = {
  CAPSULE: 0,
  PLUG_CAPSULE: 1,
  MORPHEUS: 2,
  CHIP: 3,
  CHIP_MOVE: 4,
  CHIP_DEPLOY: 5
}

export const state = () => ({
  step: STEPS.CAPSULE
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
