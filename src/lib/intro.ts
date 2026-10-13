// Resolves once the intro loader starts lifting, so the hero animation can begin.
let resolveIntro: () => void = () => {}

export const introDone = new Promise<void>((resolve) => {
  resolveIntro = resolve
})

export const finishIntro = () => resolveIntro()
