import { MeshMatcapMaterial } from 'three'
import { loadTexture } from '../../tools/Loader'

class Materials {
  constructor () {
    this.textures = []
  }

  async loadTexture (name, url) {
    this.textures[name] = await loadTexture(url)
  }

  load () {
    return Promise.all([
      this.loadTexture('white', require('~/assets/textures/white_shiny.png')),
      this.loadTexture('white_matte', require('~/assets/textures/white_matte.png')),
      this.loadTexture('black_shiny', require('~/assets/textures/black_shiny.png')),
      this.loadTexture('black_matte', require('~/assets/textures/black_matte.png')),
      this.loadTexture('chrome', require('~/assets/textures/chrome.png'))
    ])
  }

  init () {
    this.whiteMaterial = new MeshMatcapMaterial({
      matcap: this.textures.white
    })
    this.whiteMatteMaterial = new MeshMatcapMaterial({
      matcap: this.textures.white_matte
    })
    this.blackMatteMaterial = new MeshMatcapMaterial({
      matcap: this.textures.black_matte,
      color: 0x050505
    })
    this.blackShinyMaterial = new MeshMatcapMaterial({
      matcap: this.textures.black_shiny,
      color: 0x111111
    })
    this.chromeMaterial = new MeshMatcapMaterial({
      matcap: this.textures.chrome,
      color: 0x555555
    })
  }

  setMaterials (base) {
    for (let i = 0; i < base.children.length; i++) {
      const group = base.children[i]

      if (group.name.includes('white')) {
        this.setMaterial(group, this.whiteMaterial)
        continue
      }

      if (group.name.includes('whte_matte')) {
        this.setMaterial(group, this.whiteMatteMaterial)
        continue
      }

      if (group.name.includes('black_matte')) {
        this.setMaterial(group, this.blackMatteMaterial)
        continue
      }

      if (group.name.includes('black_shiny')) {
        this.setMaterial(group, this.blackShinyMaterial)
        continue
      }

      if (group.name.includes('chrome')) {
        this.setMaterial(group, this.chromeMaterial)
        continue
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
