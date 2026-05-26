import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ErrorBoundary } from '@/app/components/common/ErrorBoundary'
import { HomePage } from '@/app/components/dashboard/HomePage'
import { LoginPage } from '@/app/components/auth/LoginPage'
import { CheckInPage } from '@/app/components/cubicles/CheckInPage'
import { LobbyCheckInQrPage } from '@/app/components/cubicles/LobbyCheckInQrPage'
import { MyTutoringsPage } from '@/app/components/tutoring/MyTutoringsPage'
import { MyReservationsPage } from '@/app/components/cubicles/MyReservationsPage'
import { EquipmentRentalOrderPage } from '@/app/components/equipment/EquipmentRentalOrderPage'
import { EquipmentRentalPage } from '@/app/components/equipment/EquipmentRentalPage'
import { CubicleReservationFormPage } from '@/app/components/cubicles/CubicleReservationFormPage'
import { CubicleReservationPage } from '@/app/components/cubicles/CubicleReservationPage'
import { ProfessorTutoringCatalogPage } from '@/app/components/tutoring/ProfessorTutoringCatalogPage'
import { ProfessorTutoringPage } from '@/app/components/tutoring/ProfessorTutoringPage'
import { ProfessorTutoringProfilePage } from '@/app/components/tutoring/ProfessorTutoringProfilePage'
import { DashboardShell } from '@/app/components/dashboard/DashboardShell'
import { DashboardHomePage } from '@/app/components/dashboard/DashboardHomePage'
import { CubiclesPanelPage } from '@/app/components/cubicles/admin/CubiclesPanelPage'
import { EquipmentPanelPage } from '@/app/components/equipment/admin/EquipmentPanelPage'
import { EquipmentRequestsPage } from '@/app/components/equipment/admin/EquipmentRequestsPage'
import { TutoringSubjectsPanelPage } from '@/app/components/tutoring/admin/TutoringSubjectsPanelPage'
import { TutoringProfessorsPanelPage } from '@/app/components/tutoring/admin/TutoringProfessorsPanelPage'
import { TutoringTutorProfilePage } from '@/app/components/tutoring/admin/TutoringTutorProfilePage'
import { TutoringPromoteTutorsPage } from '@/app/components/tutoring/admin/TutoringPromoteTutorsPage'

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
          <Route path="tutorias-materias" element={<TutoringSubjectsPanelPage />} />
          <Route path="tutorias-docentes" element={<TutoringProfessorsPanelPage />} />
          <Route path="tutorias-perfil-docente" element={<TutoringTutorProfilePage />} />
          <Route path="tutorias-promover-tutores" element={<TutoringPromoteTutorsPage />} />
        </Route>
        <Route path="/home" element={<HomePage />} />
        <Route path="/my-reservations" element={<MyReservationsPage />} />
        <Route path="/my-tutorings" element={<MyTutoringsPage />} />
        <Route path="/check-in/:id" element={<CheckInPage />} />
        <Route path="/lobby/:cubicleId" element={<LobbyCheckInQrPage />} />
        <Route path="/cubicle-reservation" element={<CubicleReservationPage />} />
        <Route path="/cubicle-reservation/:id" element={<CubicleReservationFormPage />} />
        <Route path="/equipment-rental" element={<EquipmentRentalPage />} />
        <Route path="/equipment-rental/order" element={<EquipmentRentalOrderPage />} />
        <Route path="/professor-tutoring" element={<ProfessorTutoringPage />} />
        <Route path="/professor-tutoring/:subjectId" element={<ProfessorTutoringCatalogPage />} />
        <Route
          path="/professor-tutoring/:subjectId/:professorId"
          element={<ProfessorTutoringProfilePage />}
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  )
}

export default App
