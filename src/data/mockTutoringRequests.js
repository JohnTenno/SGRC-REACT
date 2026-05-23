/**
 * @typedef {object} TutoringRequest
 * @property {number} id
 * @property {number} professorId
 * @property {string} subject
 * @property {string} reservationDate
 * @property {string} startTime
 * @property {string} endTime
 * @property {string} topic
 * @property {string} [status]
 * @property {string} [createdAt]
 */

export const TUTORING_REQUEST_STATUS = {
  PENDING_PROFESSOR: 'PENDING_PROFESSOR',
}

/** @type {TutoringRequest[]} */
const initialRequests = [
  {
    id: 1,
    professorId: 1,
    subject: 'Cálculo diferencial',
    reservationDate: '2026-05-26',
    startTime: '10:00:00',
    endTime: '11:00:00',
    topic: 'Repaso de límites y continuidad antes del examen parcial.',
    status: TUTORING_REQUEST_STATUS.PENDING_PROFESSOR,
    createdAt: '2026-05-20T14:30:00.000Z',
  },
  {
    id: 2,
    professorId: 3,
    subject: 'Programación orientada a objetos',
    reservationDate: '2026-05-27',
    startTime: '14:00:00',
    endTime: '16:00:00',
    topic: 'Herencia, polimorfismo y diseño de clases en Java.',
    status: TUTORING_REQUEST_STATUS.PENDING_PROFESSOR,
    createdAt: '2026-05-21T09:15:00.000Z',
  },
]

/** @type {TutoringRequest[]} */
let requestStore = [...initialRequests]

let nextRequestId =
  requestStore.reduce((max, request) => Math.max(max, request.id), 0) + 1

export function createMockTutoringRequest(payload) {
  const request = {
    id: nextRequestId,
    professorId: Number(payload.professorId),
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

export function getMockTutoringRequestsByProfessorId(professorId) {
  return requestStore.filter((request) => request.professorId === professorId)
}

export function getMockTutoringRequestById(id) {
  return requestStore.find((request) => request.id === id) ?? null
}

export function resetMockTutoringRequests() {
  requestStore = [...initialRequests]
  nextRequestId =
    requestStore.reduce((max, request) => Math.max(max, request.id), 0) + 1
}
