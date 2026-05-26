
export function filterEquipmentCatalog({
  searchQuery = '',
  stockFilter = 'all',
  items = [],
}) {
  const query = searchQuery.trim().toLowerCase()

  return items.filter((item) => {
    if (query && !item.type.toLowerCase().includes(query)) {
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
}) {
  return searchQuery.trim().length > 0 || stockFilter !== 'all'
}
