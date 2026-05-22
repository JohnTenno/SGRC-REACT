import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { CheckInPage } from '@/pages/CheckInPage'
import { LobbyCheckInQrPage } from '@/pages/LobbyCheckInQrPage'
import { MyReservationsPage } from '@/pages/MyReservationsPage'
import { EquipmentRentalOrderPage } from '@/pages/EquipmentRentalOrderPage'
import { EquipmentRentalPage } from '@/pages/EquipmentRentalPage'
import { CubicleReservationFormPage } from '@/forms/CubicleReservationFormPage'
import { CubicleReservationPage } from '@/pages/CubicleReservationPage'
import { ProfessorTutoringPage } from '@/pages/ProfessorTutoringPage'

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/my-reservations" element={<MyReservationsPage />} />
        <Route path="/check-in/:id" element={<CheckInPage />} />
        <Route path="/lobby/:cubicleId" element={<LobbyCheckInQrPage />} />
        <Route path="/cubicle-reservation" element={<CubicleReservationPage />} />
        <Route path="/cubicle-reservation/:id" element={<CubicleReservationFormPage />} />
        <Route path="/equipment-rental" element={<EquipmentRentalPage />} />
        <Route path="/equipment-rental/order" element={<EquipmentRentalOrderPage />} />
        <Route path="/professor-tutoring" element={<ProfessorTutoringPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  )
}

export default App
