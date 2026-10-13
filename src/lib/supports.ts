let webgl: boolean | undefined

export function supportsWebGL() {
  if (webgl === undefined) {
    try {
      const canvas = document.createElement('canvas')
      webgl = !!(canvas.getContext('webgl2') || canvas.getContext('webgl'))
    } catch {
      webgl = false
    }
  }
  return webgl
}
