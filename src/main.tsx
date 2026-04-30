import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'


import './index.css'
import './fonts.css'
import App from './App'
import { BrowserRouter, Route, Routes } from 'react-router-dom'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename=''>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='/:id' element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
