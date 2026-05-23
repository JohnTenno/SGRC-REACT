/**
 * @typedef {object} TutoringProfessor
 * @property {number} id
 * @property {string} fullName
 * @property {string} bio
 * @property {string} scheduleSummary
 * @property {string} tutoringLocation
 * @property {number[]} availableWeekdays
 * @property {string[]} tutoringHourSlots
 * @property {number[]} subjectIds
 */

/** @type {TutoringProfessor[]} */
export const MOCK_TUTORING_PROFESSORS = [
  {
    id: 1,
    fullName: 'Dr. Carlos García',
    bio: 'Docente de matemáticas con enfoque en cálculo y álgebra lineal.',
    scheduleSummary: 'Lun y mié · 10:00–13:00',
    tutoringLocation: 'Cubículo 204, edificio de Administración',
    availableWeekdays: [1, 3],
    tutoringHourSlots: ['10:00', '11:00', '12:00'],
    subjectIds: [1, 6],
  },
  {
    id: 2,
    fullName: 'Dra. Ana López',
    bio: 'Especialista en límites, derivadas y aplicaciones del cálculo diferencial.',
    scheduleSummary: 'Mar y jue · 09:00–12:00',
    tutoringLocation: 'Cubículo 118, edificio de Administración',
    availableWeekdays: [2, 4],
    tutoringHourSlots: ['09:00', '10:00', '11:00'],
    subjectIds: [1],
  },
  {
    id: 3,
    fullName: 'Dr. Miguel Martínez',
    bio: 'Ingeniero en software; tutorías de POO y buenas prácticas en Java.',
    scheduleSummary: 'Lun a vie · 14:00–17:00',
    tutoringLocation: 'Cubículo 312, edificio de Administración',
    availableWeekdays: [1, 2, 3, 4, 5],
    tutoringHourSlots: ['14:00', '15:00', '16:00'],
    subjectIds: [2],
  },
  {
    id: 4,
    fullName: 'Ing. Laura Hernández',
    bio: 'Apoyo en programación orientada a objetos y estadística aplicada.',
    scheduleSummary: 'Mié y vie · 11:00–14:00',
    tutoringLocation: 'Cubículo 215, edificio de Administración',
    availableWeekdays: [3, 5],
    tutoringHourSlots: ['11:00', '12:00', '13:00'],
    subjectIds: [2, 5],
  },
  {
    id: 5,
    fullName: 'Dr. Roberto Ramírez',
    bio: 'Física experimental y resolución de problemas de cinemática y dinámica.',
    scheduleSummary: 'Mar · 15:00–18:00',
    tutoringLocation: 'Cubículo 107, edificio de Administración',
    availableWeekdays: [2],
    tutoringHourSlots: ['15:00', '16:00', '17:00'],
    subjectIds: [3],
  },
  {
    id: 6,
    fullName: 'Dra. Patricia Torres',
    bio: 'Química y física introductorias; sesiones de repaso para primer semestre.',
    scheduleSummary: 'Jue · 10:00–13:00',
    tutoringLocation: 'Cubículo 226, edificio de Administración',
    availableWeekdays: [4],
    tutoringHourSlots: ['10:00', '11:00', '12:00'],
    subjectIds: [3, 4],
  },
  {
    id: 7,
    fullName: 'Dr. Fernando Vargas',
    bio: 'Estequiometría, reacciones y equilibrio químico.',
    scheduleSummary: 'Lun y jue · 16:00–19:00',
    tutoringLocation: 'Cubículo 141, edificio de Administración',
    availableWeekdays: [1, 4],
    tutoringHourSlots: ['16:00', '17:00', '18:00'],
    subjectIds: [4],
  },
  {
    id: 8,
    fullName: 'Dra. Claudia Sánchez',
    bio: 'Probabilidad, distribuciones y análisis descriptivo de datos.',
    scheduleSummary: 'Vie · 09:00–12:00',
    tutoringLocation: 'Cubículo 198, edificio de Administración',
    availableWeekdays: [5],
    tutoringHourSlots: ['09:00', '10:00', '11:00'],
    subjectIds: [5],
  },
  {
    id: 9,
    fullName: 'Dr. Jorge Morales',
    bio: 'Matrices, espacios vectoriales y estadística para ingeniería.',
    scheduleSummary: 'Mar y vie · 13:00–16:00',
    tutoringLocation: 'Cubículo 253, edificio de Administración',
    availableWeekdays: [2, 5],
    tutoringHourSlots: ['13:00', '14:00', '15:00'],
    subjectIds: [5, 6],
  },
  {
    id: 10,
    fullName: 'Dra. Elena Jiménez',
    bio: 'Sistemas de ecuaciones lineales y transformaciones matriciales.',
    scheduleSummary: 'Mié · 08:00–11:00',
    tutoringLocation: 'Cubículo 172, edificio de Administración',
    availableWeekdays: [3],
    tutoringHourSlots: ['08:00', '09:00', '10:00'],
    subjectIds: [6],
  },
]

export function professorTeachesSubject(professorId, subjectId) {
  const professor = getTutoringProfessorById(professorId)
  return professor?.subjectIds.includes(subjectId) ?? false
}

export function getTutoringProfessorById(id) {
  return MOCK_TUTORING_PROFESSORS.find((professor) => professor.id === id) ?? null
}
