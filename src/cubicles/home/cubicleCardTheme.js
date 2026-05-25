import imgCubiculos from '@/assets/images/img-1.webp'

export const CUBICLE_CARD_IMAGE = {
  src: imgCubiculos,
  alt: 'Espacios de estudio y cubículos en biblioteca',
}

export const cubicleCardClasses = {
  shell:
    'flex w-full flex-col overflow-hidden rounded-lg border-2 bg-white shadow-md transition',
  shellDefault:
    'border-uach-purple-900/15 hover:border-uach-purple-700/40 hover:shadow-lg',
  shellActive: 'border-uach-gold-500 shadow-lg ring-4 ring-uach-gold-400/35',
  imageWrap: 'relative h-32 w-full shrink-0 overflow-hidden bg-uach-purple-950',
  image: 'absolute inset-0 h-full w-full object-cover object-center',
  body: 'flex min-h-0 flex-1 flex-col p-4',
  title: 'font-alverata line-clamp-2 text-base font-semibold text-uach-purple-900',
  capacity: 'font-praxis mt-2 shrink-0 text-sm font-medium text-uach-purple-900',
  capacityValue: 'font-semibold',
  fieldLabel:
    'font-praxis text-xs font-semibold uppercase tracking-wide text-uach-purple-900/60',
}
