import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SorteoPublicPage from './pages/participantes/SorteoPublicPage'
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css'
import FormLogin from './pages/auth/FormLogin'
import FormRegister from './pages/auth/FormRegister'
import HomeUsuario from './pages/usuarios/HomeUsuario'
import ListaSorteos from './pages/usuarios/ListaSorteos'
import DetalleSorteo from './pages/sorteos/DetalleSorteos'
import BolilloPage from './pages/participantes/BolilloPage';
import AccesoTokensPage from './pages/tokens/AccesoTokensPage';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeUsuario />} />

        <Route path="/login" element={<FormLogin />} />
        <Route path="/register" element={<FormRegister />} />
        <Route path="/sorteos" element={<ListaSorteos />} />
        <Route path="/sorteos/:accessToken" element={<DetalleSorteo />} />

        {
          // Rutas publicas :p
        }
        <Route path="/sorteo/:accessToken" element={<SorteoPublicPage />} />
        <Route path="/sorteo/:accessToken/identificar" element={<SorteoPublicPage />} />
        <Route path="/bolillo/:accessLinkToken" element={<BolilloPage />} />
        <Route path="/dirigir" element={<AccesoTokensPage />} />

      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
