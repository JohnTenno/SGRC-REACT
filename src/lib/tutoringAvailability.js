export function getAvailableTutoringSlots(professor, isoDate) {
  if (!professor?.tutoringHourSlots?.length) return []

  const date = new Date(`${isoDate}T12:00:00`)
  if (!professor.availableWeekdays.includes(date.getDay())) {
    return []
  }

  const booked = getBookedTutoringSlots(professor.id, isoDate, professor.tutoringHourSlots)
  return professor.tutoringHourSlots.filter((slot) => !booked.has(slot))
}

function getBookedTutoringSlots(professorId, isoDate, slots) {
  const key = `${professorId}-${isoDate}`
  let hash = 0
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash * 31 + key.charCodeAt(i)) | 0
  }

  const booked = new Set()
  const bookedCount = slots.length <= 1 ? 0 : hash % Math.min(2, slots.length - 1)

  for (let i = 0; i < bookedCount; i += 1) {
    const index = Math.abs((hash + i * 11) % slots.length)
    booked.add(slots[index])
  }

  return booked
}
