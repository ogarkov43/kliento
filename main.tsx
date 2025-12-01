import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Инициализация для Telegram WebApp
if (typeof window !== 'undefined') {
  // Инициализация Telegram WebApp
  try {
    import('@twa-dev/sdk').then((module) => {
      const WebApp = module.default || (module as any).WebApp
      if (WebApp) {
        WebApp.ready()
        WebApp.expand()
      }
    }).catch(() => {
      console.log('WebApp не доступен (разработка вне Telegram)')
    })
  } catch (error) {
    console.log('Ошибка инициализации WebApp:', error)
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

