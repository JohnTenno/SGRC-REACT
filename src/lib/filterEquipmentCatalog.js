import { MOCK_EQUIPMENT } from '@/data/mockEquipment'

/**
 * @param {object} options
 * @param {string} [options.searchQuery]
 * @param {'all' | 'in_stock' | 'out_of_stock'} [options.stockFilter]
 * @param {'all' | string} [options.categoryFilter]
 * @param {typeof MOCK_EQUIPMENT} [options.items]
 */
export function filterEquipmentCatalog({
  searchQuery = '',
  stockFilter = 'all',
  categoryFilter = 'all',
  items = MOCK_EQUIPMENT,
}) {
  const query = searchQuery.trim().toLowerCase()

  return items.filter((item) => {
    if (query && !item.type.toLowerCase().includes(query)) {
      return false
    }

    if (categoryFilter !== 'all' && item.category !== categoryFilter) {
      return false
    }

    if (stockFilter === 'in_stock' && item.availableStock <= 0) {
      return false
    }

    if (stockFilter === 'out_of_stock' && item.availableStock > 0) {
      return false
    }

    return true
  })
}

export function hasActiveEquipmentFilters({
  searchQuery = '',
  stockFilter = 'all',
  categoryFilter = 'all',
}) {
  return (
    searchQuery.trim().length > 0 ||
    stockFilter !== 'all' ||
    categoryFilter !== 'all'
  )
}
