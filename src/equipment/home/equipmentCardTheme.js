import defaultEquipmentImage from '@/assets/images/img-2.webp'

export const EQUIPMENT_CARD_IMAGE = {
  src: defaultEquipmentImage,
  alt: 'Equipo universitario',
}

export const equipmentCardClasses = {
  shell:
    'flex w-full flex-col overflow-hidden rounded-lg border-2 bg-white shadow-md transition',
  shellDefault:
    'border-uach-purple-900/15 hover:border-uach-purple-700/40 hover:shadow-lg',
  shellActive: 'border-uach-gold-500 shadow-lg ring-4 ring-uach-gold-400/35',
  imageWrap: 'relative h-32 w-full shrink-0 overflow-hidden bg-uach-purple-950',
  image: 'absolute inset-0 h-full w-full object-cover object-center',
  body: 'flex min-h-0 flex-1 flex-col p-4',
  title: 'font-alverata line-clamp-2 text-base font-semibold text-uach-purple-900',
  stock: 'font-praxis mt-2 shrink-0 text-sm font-medium text-uach-purple-900',
  stockValue: 'font-semibold',
  category: 'font-praxis mt-1 text-xs font-medium text-uach-purple-900/65',
}
