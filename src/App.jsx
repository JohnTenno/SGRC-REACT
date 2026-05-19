import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { MisReservasPages } from '@/pages/MisReservasPages'
import { ReservaCubiculoFormPage } from '@/pages/ReservaCubiculoFormPage'
import { ReservaCubiculoPage } from '@/pages/ReservaCubiculoPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/mis-reservas" element={<MisReservasPages />} />
        <Route path="/reserva-de-cubiculo" element={<ReservaCubiculoPage />} />
        <Route path="/reserva-de-cubiculo/:id" element={<ReservaCubiculoFormPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
