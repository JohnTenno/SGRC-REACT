/**
 * @typedef {object} TutoringRequest
 * @property {number} id
 * @property {string} professorEmployeeNumber
 * @property {string} subject
 * @property {string} reservationDate
 * @property {string} startTime
 * @property {string} endTime
 * @property {string} topic
 * @property {string} status
 * @property {string} [createdAt]
 * @property {string} [statusUpdatedAt]
 * @property {string} [rejectionReason]
 */

export const TUTORING_REQUEST_STATUS = {
  PENDING_PROFESSOR: 'PENDING_PROFESSOR',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  COMPLETED: 'COMPLETED',
}

/** @type {TutoringRequest[]} */
const initialRequests = [
  {
    id: 1,
    professorEmployeeNumber: '100001',
    subject: 'Cálculo diferencial',
    reservationDate: '2026-05-28',
    startTime: '10:00:00',
    endTime: '11:00:00',
    topic: 'Repaso de límites y continuidad antes del examen parcial.',
    status: TUTORING_REQUEST_STATUS.PENDING_PROFESSOR,
    createdAt: '2026-05-22T14:30:00.000Z',
  },
  {
    id: 2,
    professorEmployeeNumber: '100002',
    subject: 'Cálculo diferencial',
    reservationDate: '2026-05-30',
    startTime: '09:00:00',
    endTime: '10:00:00',
    topic: 'Derivadas implícitas y regla de la cadena.',
    status: TUTORING_REQUEST_STATUS.ACCEPTED,
    createdAt: '2026-05-20T11:00:00.000Z',
    statusUpdatedAt: '2026-05-21T16:45:00.000Z',
  },
  {
    id: 3,
    professorEmployeeNumber: '100003',
    subject: 'Programación orientada a objetos',
    reservationDate: '2026-05-27',
    startTime: '14:00:00',
    endTime: '16:00:00',
    topic: 'Herencia, polimorfismo y diseño de clases en Java.',
    status: TUTORING_REQUEST_STATUS.REJECTED,
    createdAt: '2026-05-19T09:15:00.000Z',
    statusUpdatedAt: '2026-05-20T08:20:00.000Z',
    rejectionReason: 'Ya tengo otra asesoría confirmada en ese horario.',
  },
  {
    id: 4,
    professorEmployeeNumber: '100001',
    subject: 'Cálculo diferencial',
    reservationDate: '2026-05-15',
    startTime: '11:00:00',
    endTime: '12:00:00',
    topic: 'Integrales indefinidas y sustitución simple.',
    status: TUTORING_REQUEST_STATUS.COMPLETED,
    createdAt: '2026-05-10T10:00:00.000Z',
    statusUpdatedAt: '2026-05-11T09:00:00.000Z',
  },
]

/** @type {TutoringRequest[]} */
let requestStore = [...initialRequests]

let nextRequestId =
  requestStore.reduce((max, request) => Math.max(max, request.id), 0) + 1

export function createMockTutoringRequest(payload) {
  const request = {
    id: nextRequestId,
    professorEmployeeNumber: String(
      payload.professorEmployeeNumber ?? payload.professorId ?? '',
    ).trim(),
    subject: String(payload.subject).trim(),
    reservationDate: payload.reservationDate,
    startTime: payload.startTime,
    endTime: payload.endTime,
    topic: String(payload.topic).trim(),
    status: TUTORING_REQUEST_STATUS.PENDING_PROFESSOR,
    createdAt: new Date().toISOString(),
  }

  nextRequestId += 1
  requestStore = [request, ...requestStore]
  return request
}

export function getMockTutoringRequests() {
  return [...requestStore]
}

export function getMockTutoringRequestsByProfessorEmployeeNumber(employeeNumber) {
  const normalized = String(employeeNumber ?? '').trim()
  return requestStore.filter(
    (request) =>
      request.professorEmployeeNumber === normalized ||
      String(request.professorId) === normalized,
  )
}

export function getMockTutoringRequestById(id) {
  return requestStore.find((request) => request.id === id) ?? null
}

export function resetMockTutoringRequests() {
  requestStore = [...initialRequests]
  nextRequestId =
    requestStore.reduce((max, request) => Math.max(max, request.id), 0) + 1
}
