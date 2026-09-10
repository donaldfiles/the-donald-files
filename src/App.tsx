import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { Reports } from './pages/Reports'
import { ReportArticle } from './pages/ReportArticle'
import { TheRecord } from './pages/TheRecord'
import { About } from './pages/About'
import { Subscribe } from './pages/Subscribe'
import { Admin } from './pages/Admin'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="reports" element={<Reports />} />
          <Route path="reports/:slug" element={<ReportArticle />} />
          <Route path="the-record" element={<TheRecord />} />
          <Route path="about" element={<About />} />
          <Route path="subscribe" element={<Subscribe />} />
          <Route path="admin" element={<Admin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
