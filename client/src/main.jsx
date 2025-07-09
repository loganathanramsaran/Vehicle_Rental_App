import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')).render(
<div className=''>
    <BrowserRouter >
    <App />
    <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
  </BrowserRouter>

</div>
)
