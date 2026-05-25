const PICKUP = 'Biblioteca — mostrador de material solicitado'

export const MOCK_EQUIPMENT_REQUESTS = [
  {
    id: 1001,
    status: 'PENDING_PICKUP',
    createdAt: '2026-05-22T10:15:00.000Z',
    pickupLocation: PICKUP,
    studentName: 'María García López',
    items: [
      {
        id: 1,
        type: 'Laptop',
        category: 'computo',
        quantity: 1,
        availableStock: 4,
      },
    ],
  },
  {
    id: 1002,
    status: 'PENDING_PICKUP',
    createdAt: '2026-05-21T16:40:00.000Z',
    pickupLocation: PICKUP,
    studentName: 'Carlos Hernández Ruiz',
    items: [
      {
        id: 2,
        type: 'Proyector',
        category: 'audiovisual',
        quantity: 1,
        availableStock: 2,
      },
      {
        id: 3,
        type: 'Marcadores',
        category: 'material',
        quantity: 2,
        availableStock: 12,
      },
    ],
  },
  {
    id: 1003,
    status: 'PENDING_PICKUP',
    createdAt: '2026-05-20T09:05:00.000Z',
    pickupLocation: PICKUP,
    studentName: 'Ana Paula Mendoza',
    items: [
      {
        id: 6,
        type: 'Calculadora científica',
        category: 'computo',
        quantity: 2,
        availableStock: 6,
      },
    ],
  },
  {
    id: 1004,
    status: 'AWAITING_RETURN',
    createdAt: '2026-05-19T13:20:00.000Z',
    pickedUpAt: '2026-05-19T14:00:00.000Z',
    pickupLocation: PICKUP,
    studentName: 'Jorge Luis Torres',
    items: [
      {
        id: 4,
        type: 'Borrador para pizarrón',
        category: 'material',
        quantity: 3,
        availableStock: 15,
      },
    ],
  },
  {
    id: 1005,
    status: 'PENDING_PICKUP',
    createdAt: '2026-05-18T11:50:00.000Z',
    pickupLocation: PICKUP,
    studentName: 'Sofía Ramírez Vega',
    items: [
      {
        id: 1,
        type: 'Laptop',
        category: 'computo',
        quantity: 2,
        availableStock: 4,
      },
      {
        id: 2,
        type: 'Proyector',
        category: 'audiovisual',
        quantity: 1,
        availableStock: 2,
      },
    ],
  },
]
