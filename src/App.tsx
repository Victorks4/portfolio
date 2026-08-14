import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { LenisProvider } from './contexts/LenisProvider'
import { SiteLayout } from './components/layout/SiteLayout'
import { HomePage } from './routes/HomePage'
import { ProjectDetailPage } from './routes/ProjectDetailPage'

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <LenisProvider>
          <Routes>
            <Route element={<SiteLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/projetos/:slug" element={<ProjectDetailPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </LenisProvider>
      </BrowserRouter>
    </HelmetProvider>
  )
}
