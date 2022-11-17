import { MeshPhongMaterial } from 'three'

class Materials {
  constructor () {
    this.whiteMaterial = new MeshPhongMaterial({
      color: 0xFFFFFF
    })
    this.blackMaterial = new MeshPhongMaterial({
      color: 0x333333
    })
  }

  setMaterials (base) {
    for (let i = 0; i < base.children.length; i++) {
      const group = base.children[i]

      if (group.name.includes('white')) {
        this.setMaterial(group, this.whiteMaterial)
        return
      }

      if (group.name.includes('black')) {
        this.setMaterial(group, this.blackMaterial)
        return
      }
    }
  }

  setMaterial (element, material) {
    if (element.type === 'Mesh') {
      element.material = material
    }
    if (element.children && element.children.length > 0) {
      element.children.forEach((object) => {
        this.setMaterial(object, material)
      })
    }
  }
}

const materials = new Materials()
export default materials
