import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { CheckInPage } from '@/pages/CheckInPage'
import { LobbyCheckInQrPage } from '@/pages/LobbyCheckInQrPage'
import { MyTutoringsPage } from '@/tutoring/home/MyTutoringsPage'
import { MyReservationsPage } from '@/pages/MyReservationsPage'
import { EquipmentRentalOrderPage } from '@/equipment/home/EquipmentRentalOrderPage'
import { EquipmentRentalPage } from '@/equipment/home/EquipmentRentalPage'
import { CubicleReservationFormPage } from '@/cubicles/home/CubicleReservationFormPage'
import { CubicleReservationPage } from '@/cubicles/home/CubicleReservationPage'
import { ProfessorTutoringCatalogPage } from '@/tutoring/home/ProfessorTutoringCatalogPage'
import { ProfessorTutoringPage } from '@/tutoring/home/ProfessorTutoringPage'
import { ProfessorTutoringProfilePage } from '@/tutoring/home/ProfessorTutoringProfilePage'
import { DashboardShell } from '@/dashboard/DashboardShell'
import { DashboardHomePage } from '@/dashboard/DashboardHomePage'
import { CubiclesPanelPage } from '@/cubicles/admin/CubiclesPanelPage'
import { EquipmentPanelPage } from '@/equipment/admin/catalogo/EquipmentPanelPage'
import { EquipmentRequestsPage } from '@/equipment/admin/solicitudes/EquipmentRequestsPage'
import { TutoringSubjectsPanelPage } from '@/tutoring/admin/materias/TutoringSubjectsPanelPage'
import { TutoringProfessorsPanelPage } from '@/tutoring/admin/docentes/TutoringProfessorsPanelPage'
import { TutoringTutorProfilePage } from '@/tutoring/admin/perfil-tutor/TutoringTutorProfilePage'
import { TutoringPromoteTutorsPage } from '@/tutoring/admin/promover-tutores/TutoringPromoteTutorsPage'

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
