import { useEffect, useMemo, useState } from 'react'
import { IconEye } from '@/app/components/common/icons'
import { EquipmentRequestDetailDialog } from '@/app/components/equipment/admin/EquipmentRequestDetailDialog'
import { EquipmentRequestsToolbar } from '@/app/components/equipment/admin/EquipmentRequestsToolbar'
import {
  fetchEquipmentRentalRequestsAdmin,
  formatEquipmentRequestDate,
} from '@/app/services/equipment/requests.service'
import {
  EMPTY_DATE_TIME_FILTERS,
  filterEquipmentRequests,
  hasActiveEquipmentRequestFilters,
} from '@/app/components/equipment/admin/equipmentRequestsFilters'
import { EQUIPMENT_REQUEST_STATUS_BADGE_CLASS } from '@/app/components/equipment/equipmentRequestStatus'

const PAGE_SIZE = 10

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
  const [page, setPage] = useState(0)

  useEffect(() => {
    let ignore = false
    setPage(0)
    async function load() {
      setLoadError(null)
      setIsLoading(true)
      try {
        const list = await fetchEquipmentRentalRequestsAdmin({ statuses: statusFilters })
        if (!ignore) setRequests(list)
      } catch (err) {
        if (!ignore) setLoadError(err.message ?? 'No se pudieron cargar las solicitudes.')
      } finally {
        if (!ignore) setIsLoading(false)
      }
    }
    load()
    return () => {
      ignore = true
    }
  }, [statusFilters])

  const filteredRequests = useMemo(
    () =>
      filterEquipmentRequests(requests, {
        searchQuery,
        statusFilters: [],
        dateFrom,
        dateTo,
        timeFrom,
        timeTo,
      }),
    [requests, searchQuery, dateFrom, dateTo, timeFrom, timeTo],
  )

  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / PAGE_SIZE))
  const pagedRequests = filteredRequests.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  useEffect(() => {
    setPage(0)
  }, [searchQuery, dateFrom, dateTo, timeFrom, timeTo])

  const hasActiveFilters = hasActiveEquipmentRequestFilters({
    searchQuery,
    statusFilters,
    dateFrom,
    dateTo,
    timeFrom,
    timeTo,
  })

  function handleRequestUpdated(updated) {
    setRequests((list) =>
      list.map((item) => (item.id === updated.id ? updated : item)),
    )
    setSelectedRequest((current) =>
      current?.id === updated.id ? updated : current,
    )
  }

  function clearFilters() {
    setSearchQuery('')
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

        {!isLoading && !loadError ? (
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
          <>
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
                  {pagedRequests.map((request) => (
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

            <div className="flex items-center justify-between border-t border-uach-purple-900/10 px-4 py-3">
              <span className="font-praxis text-sm text-uach-purple-900/70">
                Página <strong>{page + 1}</strong> de <strong>{totalPages}</strong>
              </span>
              <div className="flex gap-2">
                <button
                  className="font-praxis rounded-md border border-uach-purple-900/20 px-4 py-1.5 text-sm text-uach-purple-900 transition-colors hover:bg-uach-purple-900/5 disabled:opacity-50 disabled:hover:bg-transparent"
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Anterior
                </button>
                <button
                  className="font-praxis rounded-md border border-uach-purple-900/20 px-4 py-1.5 text-sm text-uach-purple-900 transition-colors hover:bg-uach-purple-900/5 disabled:opacity-50 disabled:hover:bg-transparent"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Siguiente
                </button>
              </div>
            </div>
          </>
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
