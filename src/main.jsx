import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ToastPOS from './ToastPOS.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastPOS />
  </StrictMode>,
)
