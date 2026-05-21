import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { CheckInPage } from '@/pages/CheckInPage'
import { LobbyCheckInQrPage } from '@/pages/LobbyCheckInQrPage'
import { MisReservasPages } from '@/pages/MisReservasPages'
import { RentaEquipoOrdenPage } from '@/pages/RentaEquipoOrdenPage'
import { RentaEquipoPage } from '@/pages/RentaEquipoPage'
import { ReservaCubiculoFormPage } from '@/forms/ReservaCubiculoFormPage'
import { ReservaCubiculoPage } from '@/pages/ReservaCubiculoPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/mis-reservas" element={<MisReservasPages />} />
        <Route path="/check-in/:id" element={<CheckInPage />} />
        <Route path="/entrada/:cubicleId" element={<LobbyCheckInQrPage />} />
        <Route path="/reserva-de-cubiculo" element={<ReservaCubiculoPage />} />
        <Route path="/reserva-de-cubiculo/:id" element={<ReservaCubiculoFormPage />} />
        <Route path="/renta-de-equipo" element={<RentaEquipoPage />} />
        <Route path="/renta-de-equipo/orden" element={<RentaEquipoOrdenPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
