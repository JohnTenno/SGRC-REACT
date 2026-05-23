/**
 * @typedef {object} TutoringSubject
 * @property {number} id
 * @property {string} name
 * @property {string} description
 */

/** @type {TutoringSubject[]} */
export const MOCK_TUTORING_SUBJECTS = [
  {
    id: 1,
    name: 'Cálculo diferencial',
    description: 'Límites, derivadas y aplicaciones básicas del cálculo en una variable.',
  },
  {
    id: 2,
    name: 'Programación orientada a objetos',
    description: 'Clases, herencia, polimorfismo y diseño de soluciones en Java.',
  },
  {
    id: 3,
    name: 'Física I',
    description: 'Cinemática, dinámica y principios de conservación para ciencias e ingeniería.',
  },
  {
    id: 4,
    name: 'Química general',
    description: 'Estequiometría, enlaces, reacciones y equilibrio en nivel introductorio.',
  },
  {
    id: 5,
    name: 'Estadística',
    description: 'Probabilidad, distribuciones y análisis descriptivo de datos.',
  },
  {
    id: 6,
    name: 'Álgebra lineal',
    description: 'Matrices, sistemas de ecuaciones, espacios vectoriales y transformaciones.',
  },
]

export function getTutoringSubjectById(id) {
  return MOCK_TUTORING_SUBJECTS.find((subject) => subject.id === id) ?? null
}
