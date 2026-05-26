import { useCallback, useEffect, useMemo, useState } from 'react'
import { IconEye } from '@/components/icons'
import { EquipmentRequestDetailDialog } from '@/equipment/admin/solicitudes/EquipmentRequestDetailDialog'
import { EquipmentRequestsToolbar } from '@/equipment/admin/solicitudes/EquipmentRequestsToolbar'
import {
  fetchEquipmentRentalRequestsAdmin,
  formatEquipmentRequestDate,
} from '@/equipment/admin/solicitudes/equipmentRequestsApi'
import {
  EMPTY_DATE_TIME_FILTERS,
  filterEquipmentRequests,
  hasActiveEquipmentRequestFilters,
} from '@/equipment/admin/solicitudes/equipmentRequestsFilters'
import { EQUIPMENT_REQUEST_STATUS_BADGE_CLASS } from '@/equipment/home/equipmentRequestStatus'

export function EquipmentRequestsPage() {
  const [requests, setRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilters, setStatusFilters] = useState([])
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [timeFrom, setTimeFrom] = useState('')
  const [timeTo, setTimeTo] = useState('')

  const filteredRequests = useMemo(
    () =>
      filterEquipmentRequests(requests, {
        searchQuery,
        statusFilters,
        dateFrom,
        dateTo,
        timeFrom,
        timeTo,
      }),
    [requests, searchQuery, statusFilters, dateFrom, dateTo, timeFrom, timeTo],
  )

  const hasActiveFilters = hasActiveEquipmentRequestFilters({
    statusFilters,
    dateFrom,
    dateTo,
    timeFrom,
    timeTo,
  })

  const loadRequests = useCallback(async () => {
    setLoadError(null)
    try {
      const list = await fetchEquipmentRentalRequestsAdmin()
      setRequests(list)
    } catch (err) {
      setLoadError(err.message ?? 'No se pudieron cargar las solicitudes.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadRequests()
  }, [loadRequests])

  function handleRequestUpdated(updated) {
    setRequests((list) =>
      list.map((item) => (item.id === updated.id ? updated : item)),
    )
    setSelectedRequest((current) =>
      current?.id === updated.id ? updated : current,
    )
  }

  function clearFilters() {
    setStatusFilters([])
    setDateFrom(EMPTY_DATE_TIME_FILTERS.dateFrom)
    setDateTo(EMPTY_DATE_TIME_FILTERS.dateTo)
    setTimeFrom(EMPTY_DATE_TIME_FILTERS.timeFrom)
    setTimeTo(EMPTY_DATE_TIME_FILTERS.timeTo)
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4">
        <div>
          <h1 className="font-alverata text-2xl font-semibold text-uach-purple-900 sm:text-3xl">
            Solicitudes de equipo
          </h1>
          <p className="font-praxis mt-2 max-w-2xl text-sm text-uach-purple-900/70 sm:text-base">
            Revisa las solicitudes de renta registradas por los estudiantes.
          </p>
        </div>

        {!isLoading && !loadError && requests.length > 0 ? (
          <EquipmentRequestsToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilters={statusFilters}
            onStatusFiltersChange={setStatusFilters}
            dateFrom={dateFrom}
            dateTo={dateTo}
            onDateFromChange={setDateFrom}
            onDateToChange={setDateTo}
            timeFrom={timeFrom}
            timeTo={timeTo}
            onTimeFromChange={setTimeFrom}
            onTimeToChange={setTimeTo}
            resultCount={filteredRequests.length}
            totalCount={requests.length}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFilters}
          />
        ) : null}
      </header>

      <section
        className="overflow-hidden rounded-xl border border-uach-purple-900/15 bg-white shadow-sm"
        aria-label="Tabla de solicitudes de equipo"
      >
        {isLoading ? (
          <p className="font-praxis px-4 py-12 text-center text-sm text-uach-purple-900/60">
            Cargando solicitudes…
          </p>
        ) : loadError ? (
          <p className="font-praxis px-4 py-12 text-center text-sm text-red-600">{loadError}</p>
        ) : requests.length === 0 ? (
          <p className="font-praxis px-4 py-12 text-center text-sm text-uach-purple-900/60">
            No hay solicitudes registradas. Aparecerán aquí cuando un estudiante solicite equipo.
          </p>
        ) : filteredRequests.length === 0 ? (
          <p className="font-praxis px-4 py-12 text-center text-sm text-uach-purple-900/60">
            No hay solicitudes que coincidan con tu búsqueda o filtros.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="font-praxis w-full min-w-[44rem] border-collapse text-left text-sm text-uach-purple-900">
              <thead>
                <tr className="border-b border-uach-purple-900/10 bg-uach-purple-50/80">
                  <th className="px-4 py-3 font-semibold">Folio</th>
                  <th className="px-4 py-3 font-semibold">Fecha</th>
                  <th className="px-4 py-3 font-semibold">Solicitante</th>
                  <th className="px-4 py-3 font-semibold">Estatus</th>
                  <th className="px-4 py-3 font-semibold">Equipo</th>
                  <th className="px-4 py-3 font-semibold text-center">Unidades</th>
                  <th className="px-4 py-3 font-semibold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="border-b border-uach-purple-900/8 transition last:border-b-0 hover:bg-uach-purple-50/40"
                  >
                    <td className="px-4 py-3 font-semibold tabular-nums">#{request.id}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-uach-purple-900/80">
                      {formatEquipmentRequestDate(request.createdAt)}
                    </td>
                    <td className="px-4 py-3">{request.studentName}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                          EQUIPMENT_REQUEST_STATUS_BADGE_CLASS[request.status] ??
                          'border-uach-purple-900/15 bg-uach-purple-50 text-uach-purple-900'
                        }`}
                      >
                        {request.statusLabel}
                      </span>
                    </td>
                    <td className="max-w-xs px-4 py-3 text-uach-purple-900/85">
                      {request.itemsSummary}
                    </td>
                    <td className="px-4 py-3 text-center font-semibold tabular-nums">
                      {request.totalUnits}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedRequest(request)}
                        className="inline-flex size-10 items-center justify-center rounded-lg border border-uach-purple-900/15 text-uach-purple-900 transition hover:border-uach-purple-700/30 hover:bg-uach-purple-50"
                        aria-label={`Ver orden #${request.id}`}
                      >
                        <IconEye className="size-5" aria-hidden />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selectedRequest ? (
        <EquipmentRequestDetailDialog
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onUpdated={handleRequestUpdated}
        />
      ) : null}
    </div>
  )
}
