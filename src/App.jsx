import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ErrorBoundary } from '@/app/components/common/ErrorBoundary'
import { HomePage } from '@/app/components/dashboard/HomePage'
import { LoginPage } from '@/app/components/auth/LoginPage'
import { CheckInPage } from '@/app/components/cubicles/CheckInPage'
import { LobbyCheckInQrPage } from '@/app/components/cubicles/LobbyCheckInQrPage'
import { MyReservationsPage } from '@/app/components/cubicles/MyReservationsPage'
import { EquipmentRentalOrderPage } from '@/app/components/equipment/EquipmentRentalOrderPage'
import { EquipmentRentalPage } from '@/app/components/equipment/EquipmentRentalPage'
import { MyEquipmentRequestsPage } from '@/app/components/equipment/MyEquipmentRequestsPage'
import { CubicleReservationFormPage } from '@/app/components/cubicles/CubicleReservationFormPage'
import { CubicleReservationPage } from '@/app/components/cubicles/CubicleReservationPage'
import { DashboardShell } from '@/app/components/dashboard/DashboardShell'
import { DashboardHomePage } from '@/app/components/dashboard/DashboardHomePage'
import { CubiclesPanelPage } from '@/app/components/cubicles/admin/CubiclesPanelPage'
import { EquipmentPanelPage } from '@/app/components/equipment/admin/EquipmentPanelPage'
import { EquipmentRequestsPage } from '@/app/components/equipment/admin/EquipmentRequestsPage'

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<DashboardShell />}>
          <Route index element={<DashboardHomePage />} />
          <Route path="cubiculos-panel" element={<CubiclesPanelPage />} />
          <Route path="equipo-panel" element={<EquipmentPanelPage />} />
          <Route path="equipo-solicitudes" element={<EquipmentRequestsPage />} />
        </Route>
        <Route path="/home" element={<HomePage />} />
        <Route path="/my-reservations" element={<MyReservationsPage />} />
        <Route path="/my-equipment-requests" element={<MyEquipmentRequestsPage />} />
        <Route path="/check-in/:id" element={<CheckInPage />} />
        <Route path="/lobby/:cubicleId" element={<LobbyCheckInQrPage />} />
        <Route path="/cubicle-reservation" element={<CubicleReservationPage />} />
        <Route path="/cubicle-reservation/:id" element={<CubicleReservationFormPage />} />
        <Route path="/equipment-rental" element={<EquipmentRentalPage />} />
        <Route path="/equipment-rental/order/:requestId" element={<EquipmentRentalOrderPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  )
}

export default App
