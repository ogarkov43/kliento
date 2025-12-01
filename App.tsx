import { useEffect, useState } from 'react'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'
import { OrdersProvider } from './contexts/OrdersContext'
import Header from './components/Header'
import SearchClients from './pages/SearchClients'
import Orders from './pages/Orders'
import Appeals from './pages/Appeals'
import Favorites from './pages/Favorites'
import Completed from './pages/Completed'
import Rating from './pages/Rating'
import AIHelp from './pages/AIHelp'
import TabBar from './components/TabBar'
import './App.css'

const AppContent = () => {
  const { theme } = useTheme()
  const [isGraphVisible, setIsGraphVisible] = useState(false)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [earnings, setEarnings] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<'calendar' | 'chart'>('calendar')
  const [currentDate, setCurrentDate] = useState(new Date(2025, 10, 1)) // Ноябрь 2025
  const [currentPage, setCurrentPage] = useState<'home' | 'search' | 'orders' | 'appeals' | 'favorites' | 'completed' | 'rating' | 'aihelp'>('home')
  const [activeTab, setActiveTab] = useState('profile')
  const [previousPage, setPreviousPage] = useState<'home' | 'search' | 'orders' | 'appeals' | 'favorites' | 'completed' | 'rating' | 'aihelp'>('home')

  useEffect(() => {
    try {
      // Динамический импорт для избежания ошибок вне Telegram
      import('@twa-dev/sdk').then((module) => {
        const WebApp = module.default || (module as any).WebApp
        if (WebApp) {
          WebApp.ready()
          WebApp.expand()
          const bgColor = theme === 'dark' ? '#000000' : '#FFFFFF'
          WebApp.setHeaderColor(bgColor)
          WebApp.setBackgroundColor(bgColor)
        }
      }).catch(() => {
        console.log('WebApp не доступен (разработка вне Telegram)')
      })
    } catch (error) {
      console.log('Ошибка инициализации WebApp:', error)
    }
    
    // Анимация появления графика
    setTimeout(() => {
      setIsGraphVisible(true)
    }, 300)
  }, [theme])

  // Цвета для темной и светлой темы
  const bgColor = theme === 'dark' ? '#000000' : '#FFFFFF'
  const textColor = theme === 'dark' ? '#FFFFFF' : '#000000'
  
  // Генерируем рандомные заработки для каждого дня с клиентом
  const getEarningsForDay = (day: number): number => {
    // Используем день как seed для стабильности
    return Math.floor((day * 1234) % 50000) + 10000 // От 10000 до 60000
  }
  
  // Получаем данные о заработке для текущего месяца
  const getEarningsDataForMonth = () => {
    // Для примера используем те же дни, что и клиенты
    const clientDates = [3, 7, 12, 18, 24, 28]
    return clientDates.map(day => ({
      day,
      amount: getEarningsForDay(day)
    }))
  }
  
  const handleDayClick = (day: number, clientDates: number[]) => {
    if (clientDates.includes(day)) {
      if (selectedDay === day) {
        // Если клик по уже выбранному дню - скрываем
        setSelectedDay(null)
        setEarnings(null)
      } else {
        // Выбираем новый день и показываем заработок
        const earningsData = getEarningsDataForMonth()
        const dayData = earningsData.find(d => d.day === day)
        if (dayData) {
          setSelectedDay(day)
          setEarnings(dayData.amount)
        }
      }
    }
  }
  
  // Компонент шкалы активности заработка
  const EarningsChart = ({ theme, textColor }: { theme: string, textColor: string }) => {
    const [isVisible, setIsVisible] = useState(false)
    
    useEffect(() => {
      // Запускаем анимацию после монтирования
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 100)
      return () => clearTimeout(timer)
    }, [])
    
    // Данные заработка по дням для текущего месяца
    const earningsData = getEarningsDataForMonth()
    
    const maxEarnings = Math.max(...earningsData.map(d => d.amount))
    
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        paddingTop: '8px'
      }}>
        {earningsData.map((item, index) => {
          const heightPercent = (item.amount / maxEarnings) * 100
          
          return (
            <div
              key={item.day}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                opacity: 0,
                animation: 'fadeIn 0.4s ease forwards',
                animationDelay: `${index * 0.1}s`
              }}
            >
              {/* Дата */}
              <div style={{
                width: '40px',
                fontSize: '13px',
                color: theme === 'dark' ? 'rgba(235, 235, 245, 0.6)' : 'rgba(60, 60, 67, 0.6)',
                fontWeight: 500,
                transition: 'color 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                lineHeight: '1.2'
              }}>
                <span>{String(item.day).padStart(2, '0')}</span>
                <span>ноя</span>
              </div>
              
              {/* Шкала */}
              <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <div style={{
                  flex: 1,
                  height: '8px',
                  backgroundColor: theme === 'dark' ? '#2C2C2E' : '#E5E5EA',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  position: 'relative',
                  transition: 'background-color 0.3s ease'
                }}>
                  <div
                    style={{
                      width: isVisible ? `${heightPercent}%` : '0%',
                      height: '100%',
                      backgroundColor: theme === 'dark' ? '#34C759' : '#30D158',
                      borderRadius: '4px',
                      transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s ease'
                    }}
                  />
                </div>
                
                {/* Сумма */}
                <div style={{
                  width: '70px',
                  fontSize: '13px',
                  color: textColor,
                  fontWeight: 600,
                  textAlign: 'right',
                  transition: 'color 0.3s ease'
                }}>
                  {item.amount.toLocaleString('ru-RU').replace(/\s/g, '.')}₽
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }
  
  // Функции для работы с датами
  const getMonthName = (date: Date): string => {
    const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 
                    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
    return months[date.getMonth()]
  }
  
  // Автоматически выбираем первый день с заработком при загрузке и смене месяца
  useEffect(() => {
    const earningsData = getEarningsDataForMonth()
    if (earningsData.length > 0) {
      const currentSelectedDay = selectedDay
      // Если выбранный день не существует в новом месяце, выбираем первый
      if (currentSelectedDay === null || !earningsData.some(d => d.day === currentSelectedDay)) {
        const firstDay = earningsData[0].day
        setSelectedDay(firstDay)
        setEarnings(earningsData[0].amount)
      } else {
        // Обновляем заработок для выбранного дня
        const dayData = earningsData.find(d => d.day === currentSelectedDay)
        if (dayData) {
          setEarnings(dayData.amount)
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDate])
  
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }
  
  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }
  
  // Компонент графика активности клиентов
  const ClientActivityChart = ({ theme }: { theme: string, textColor: string }) => {
    // Данные о найденных клиентах (для примера используем те же дни)
    const clientDates = [3, 7, 12, 18, 24, 28] // Дни, когда были найдены клиенты
    
    // Получаем количество дней в текущем месяце
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
    // Получаем день недели первого дня месяца (0 = воскресенье, 1 = понедельник)
    const firstDayOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
    // Преобразуем в формат где понедельник = 0
    const firstDayAdjusted = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1
    
    // Создаем массив дней месяца
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
    
    // Создаем массив для отображения (добавляем пустые ячейки для начала недели)
    const calendarDays = [...Array(firstDayAdjusted).fill(null), ...days]
    
    return (
      <div>
        {/* Дни недели */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '4px',
          marginBottom: '8px'
        }}>
          {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day, index) => (
            <div
              key={index}
              style={{
                textAlign: 'center',
                fontSize: '12px',
                color: theme === 'dark' ? 'rgba(235, 235, 245, 0.4)' : 'rgba(60, 60, 67, 0.4)',
                fontWeight: 500,
                transition: 'color 0.3s ease'
              }}
            >
              {day}
            </div>
          ))}
        </div>
        
        {/* Календарная сетка */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '4px'
        }}>
          {calendarDays.map((day, index) => {
            const hasClient = day !== null && clientDates.includes(day)
            
            return (
              <div
                key={index}
                onClick={() => day !== null && handleDayClick(day, clientDates)}
                style={{
                  aspectRatio: '1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '8px',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  animation: hasClient ? 'pulse 0.6s ease' : 'none',
                  animationDelay: `${index * 0.02}s`,
                  cursor: hasClient ? 'pointer' : 'default',
                  transform: selectedDay === day ? 'scale(1.05)' : 'scale(1)'
                }}
              >
                {day !== null ? (
                  <>
                    {/* Фон для дня с клиентом */}
                    {hasClient && (
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          backgroundColor: theme === 'dark' ? '#34C759' : '#30D158',
                          borderRadius: '8px',
                          opacity: 0.2,
                          transition: 'all 0.3s ease'
                        }}
                      />
                    )}
                    {/* Номер дня */}
                    <span
                      style={{
                        fontSize: '13px',
                        fontWeight: hasClient ? 600 : 400,
                        color: hasClient 
                          ? (theme === 'dark' ? '#34C759' : '#30D158')
                          : (theme === 'dark' ? 'rgba(235, 235, 245, 0.6)' : 'rgba(60, 60, 67, 0.6)'),
                        position: 'relative',
                        zIndex: 1,
                        transition: 'color 0.3s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '2px'
                      }}
                    >
                      {day}
                      {/* Индикатор клиента */}
                      {hasClient && (
                        <div
                          style={{
                            width: '4px',
                            height: '4px',
                            borderRadius: '50%',
                            backgroundColor: theme === 'dark' ? '#34C759' : '#30D158',
                            marginTop: '2px'
                          }}
                        />
                      )}
                    </span>
                  </>
                ) : (
                  <div />
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Функция для определения activeTab на основе currentPage
  const getActiveTabFromPage = (page: typeof currentPage): string => {
    if (page === 'search') return 'clients'
    if (page === 'orders' || page === 'appeals' || page === 'favorites' || page === 'completed') return 'bonus'
    if (page === 'aihelp') return 'rating'
    return 'profile'
  }

  // Обработчик переключения вкладок
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    if (tab === 'clients') {
      setCurrentPage('search')
    } else if (tab === 'bonus') {
      setCurrentPage('orders')
    } else if (tab === 'rating') {
      // Сохраняем текущую страницу перед переходом на AI Help
      setPreviousPage(currentPage)
      setCurrentPage('aihelp')
    } else {
      setCurrentPage('home')
    }
  }

  // Обработчик перехода к категории заказов
  const handleNavigateToCategory = (category: string) => {
    if (category === 'appeals') {
      setCurrentPage('appeals')
      setActiveTab('bonus')
    } else if (category === 'favorites') {
      setCurrentPage('favorites')
      setActiveTab('bonus')
    } else if (category === 'completed') {
      setCurrentPage('completed')
      setActiveTab('bonus')
    } else if (category === 'rating') {
      setCurrentPage('rating')
      setActiveTab('bonus')
    }
  }

  // Если открыта страница поиска, показываем её
  if (currentPage === 'search') {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: bgColor, 
        color: textColor, 
        width: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", sans-serif',
        transition: 'background-color 0.3s ease, color 0.3s ease'
      }}>
        <SearchClients 
          onBack={() => {
            setCurrentPage('home')
            setActiveTab('profile')
          }}
          onNavigateToProfile={() => {
            setCurrentPage('home')
            setActiveTab('profile')
          }}
        />
        <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
    )
  }

  // Если открыта страница заказов, показываем её
  if (currentPage === 'orders') {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: bgColor, 
        color: textColor, 
        width: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", sans-serif',
        transition: 'background-color 0.3s ease, color 0.3s ease'
      }}>
        <Orders onNavigateToCategory={handleNavigateToCategory} />
        <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
    )
  }

  // Если открыта страница обращений
  if (currentPage === 'appeals') {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: bgColor, 
        color: textColor, 
        width: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", sans-serif',
        transition: 'background-color 0.3s ease, color 0.3s ease'
      }}>
        <Appeals />
        <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
    )
  }

  // Если открыта страница избранных
  if (currentPage === 'favorites') {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: bgColor, 
        color: textColor, 
        width: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", sans-serif',
        transition: 'background-color 0.3s ease, color 0.3s ease'
      }}>
        <Favorites />
        <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
    )
  }

  // Если открыта страница выполненных
  if (currentPage === 'completed') {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: bgColor, 
        color: textColor, 
        width: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", sans-serif',
        transition: 'background-color 0.3s ease, color 0.3s ease'
      }}>
        <Completed />
        <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
    )
  }

  // Если открыта страница рейтинга
  if (currentPage === 'rating') {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: bgColor, 
        color: textColor, 
        width: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", sans-serif',
        transition: 'background-color 0.3s ease, color 0.3s ease'
      }}>
        <Rating />
        <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
    )
  }

  // Если открыта страница AI Help
  if (currentPage === 'aihelp') {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: bgColor, 
        color: textColor, 
        width: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", sans-serif',
        transition: 'background-color 0.3s ease, color 0.3s ease'
      }}>
        <AIHelp onClose={() => {
          setCurrentPage(previousPage)
          setActiveTab(getActiveTabFromPage(previousPage))
        }} />
      </div>
    )
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: bgColor, 
      color: textColor, 
      width: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", sans-serif',
      transition: 'background-color 0.3s ease, color 0.3s ease',
      overflowX: 'hidden'
    }}>
      {/* Шапка */}
      <Header />
      
             {/* Основной контент */}
             <div style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', paddingTop: '16px', paddingBottom: '100px', gap: '24px' }}>
        {/* График активности */}
        <div style={{
          padding: '0 16px',
          opacity: isGraphVisible ? 1 : 0,
          transform: isGraphVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
          marginTop: '8px'
        }}>
          <div style={{
            backgroundColor: theme === 'dark' ? '#1C1C1E' : '#F2F2F7',
            borderRadius: '16px',
            padding: '20px 16px',
            transition: 'background-color 0.3s ease'
          }}>
            {/* Заголовок графика и переключатель */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '20px'
            }}>
              {/* Переключатель режимов */}
              <div style={{
                display: 'flex',
                gap: '4px',
                backgroundColor: theme === 'dark' ? '#2C2C2E' : '#E5E5EA',
                borderRadius: '8px',
                padding: '4px',
                transition: 'background-color 0.3s ease'
              }}>
                <button
                  onClick={() => setViewMode('calendar')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: viewMode === 'calendar' 
                      ? (theme === 'dark' ? '#000000' : '#FFFFFF')
                      : 'transparent',
                    color: viewMode === 'calendar'
                      ? textColor
                      : (theme === 'dark' ? 'rgba(235, 235, 245, 0.6)' : 'rgba(60, 60, 67, 0.6)'),
                    fontSize: '13px',
                    fontWeight: viewMode === 'calendar' ? 600 : 400,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    outline: 'none'
                  }}
                  aria-label="Календарь"
                >
                  Календарь
                </button>
                <button
                  onClick={() => setViewMode('chart')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: viewMode === 'chart'
                      ? (theme === 'dark' ? '#000000' : '#FFFFFF')
                      : 'transparent',
                    color: viewMode === 'chart'
                      ? textColor
                      : (theme === 'dark' ? 'rgba(235, 235, 245, 0.6)' : 'rgba(60, 60, 67, 0.6)'),
                    fontSize: '13px',
                    fontWeight: viewMode === 'chart' ? 600 : 400,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    outline: 'none'
                  }}
                  aria-label="Шкала"
                >
                  Шкала
                </button>
              </div>
              
              {/* Заголовок справа */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end'
              }}>
                <h3 style={{
                  color: textColor,
                  fontSize: '18px',
                  fontWeight: 600,
                  marginBottom: '2px',
                  transition: 'color 0.3s ease'
                }}>
                  {getMonthName(currentDate)} {currentDate.getFullYear()}
                </h3>
                <p style={{
                  color: theme === 'dark' ? 'rgba(235, 235, 245, 0.6)' : 'rgba(60, 60, 67, 0.6)',
                  fontSize: '12px',
                  transition: 'color 0.3s ease'
                }}>
                  {viewMode === 'calendar' ? '6 клиентов найдено' : 'Заработок по дням'}
                </p>
              </div>
            </div>
            
            {/* Контент с анимацией переключения */}
            <div style={{
              position: 'relative',
              minHeight: '200px'
            }}>
              {viewMode === 'calendar' ? (
                <div style={{
                  opacity: 1,
                  animation: 'fadeIn 0.3s ease'
                }}>
                  <ClientActivityChart theme={theme} textColor={textColor} />
                </div>
              ) : (
                <div style={{
                  opacity: 1,
                  animation: 'fadeIn 0.3s ease'
                }}>
                  <EarningsChart theme={theme} textColor={textColor} />
                </div>
              )}
            </div>
            
            {/* Блок с заработком и кнопки перелистывания - на одном уровне */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '16px',
              paddingTop: '16px',
              borderTop: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
              gap: '16px'
            }}>
              {/* Блок с заработком при выборе дня - слева */}
              {selectedDay !== null && earnings !== null ? (
                <div style={{
                  padding: '16px',
                  backgroundColor: theme === 'dark' ? '#2C2C2E' : '#E5E5EA',
                  borderRadius: '12px',
                  opacity: 0,
                  animation: 'fadeIn 0.4s ease forwards',
                  transition: 'background-color 0.3s ease',
                  flex: 1
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <div>
                      <p style={{
                        color: theme === 'dark' ? 'rgba(235, 235, 245, 0.6)' : 'rgba(60, 60, 67, 0.6)',
                        fontSize: '13px',
                        marginBottom: '4px',
                        transition: 'color 0.3s ease'
                      }}>
                        {selectedDay} {getMonthName(currentDate).toLowerCase()}
                      </p>
                      <p style={{
                        color: textColor,
                        fontSize: '24px',
                        fontWeight: 600,
                        transition: 'color 0.3s ease'
                      }}>
                        {earnings.toLocaleString('ru-RU').replace(/\s/g, '.')}₽
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedDay(null)
                        setEarnings(null)
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: theme === 'dark' ? 'rgba(235, 235, 245, 0.6)' : 'rgba(60, 60, 67, 0.6)',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'color 0.2s ease',
                        flexShrink: 0
                      }}
                      aria-label="Закрыть"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ flex: 1 }} />
              )}
              
              {/* Кнопки перелистывания месяцев - справа */}
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: '8px'
              }}>
                <button
                  onClick={handlePrevMonth}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: theme === 'dark' ? '#2C2C2E' : '#E5E5EA',
                    color: textColor,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background-color 0.3s ease, transform 0.2s ease',
                    outline: 'none'
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.transform = 'scale(0.95)'
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.transform = 'scale(1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)'
                  }}
                  aria-label="Предыдущий месяц"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                
                <button
                  onClick={handleNextMonth}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: theme === 'dark' ? '#2C2C2E' : '#E5E5EA',
                    color: textColor,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background-color 0.3s ease, transform 0.2s ease',
                    outline: 'none'
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.transform = 'scale(0.95)'
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.transform = 'scale(1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)'
                  }}
                  aria-label="Следующий месяц"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        
      </div>
      
      {/* Кнопка "Найти клиентов" - фиксированная снизу */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '16px',
        backgroundColor: bgColor,
        borderTop: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
        transition: 'background-color 0.3s ease, border-color 0.3s ease',
        zIndex: 10,
        maxWidth: '100vw'
      }}>
        <div style={{
          maxWidth: '428px',
          margin: '0 auto',
          width: '100%'
        }}>
        <button
          style={{
            width: '100%',
            padding: '16px 24px',
            backgroundColor: theme === 'dark' ? '#FFFFFF' : '#000000',
            color: theme === 'dark' ? '#000000' : '#FFFFFF',
            border: 'none',
            borderRadius: '16px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background-color 0.3s ease, color 0.3s ease, transform 0.2s ease',
            outline: 'none',
            boxShadow: theme === 'dark' ? 'none' : '0 2px 8px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'scale(0.98)'
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
          }}
          onClick={() => {
            setCurrentPage('search')
            setActiveTab('clients')
          }}
          >
            Найти клиентов
          </button>
        </div>
      </div>
    </div>
  )
}

const App = () => {
  return (
    <ThemeProvider>
      <OrdersProvider>
        <AppContent />
      </OrdersProvider>
    </ThemeProvider>
  )
}

export default App
