import { useState, useEffect, useCallback } from 'react'
import './App.css'

function App() {
  const [score, setScore] = useState(() => {
    const saved = localStorage.getItem('clicker-score')
    return saved ? Number(saved) : 0
  })
  const [clickPower, setClickPower] = useState(1)
  const [autoClickers, setAutoClickers] = useState(0)
  const [particles, setParticles] = useState([])
  const [isAnimating, setIsAnimating] = useState(false)

  // Сохранение прогресса
  useEffect(() => {
    localStorage.setItem('clicker-score', score.toString())
  }, [score])

  // Авто-кликеры
  useEffect(() => {
    if (autoClickers === 0) return
    const interval = setInterval(() => {
      setScore(prev => prev + autoClickers)
      createParticle(window.innerWidth / 2, window.innerHeight / 2, autoClickers, '#4ade80')
    }, 1000)
    return () => clearInterval(interval)
  }, [autoClickers])

  // Создание частиц
  const createParticle = (x, y, value, color = '#fbbf24') => {
    const id = Date.now() + Math.random()
    setParticles(prev => [...prev, { id, x, y, value, color }])
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== id))
    }, 1000)
  }

  // Обработка клика
  const handleClick = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    setScore(prev => prev + clickPower)
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 100)
    
    createParticle(x, y, clickPower)
  }, [clickPower])

  // Покупка улучшений
  const buyUpgrade = (type) => {
    if (type === 'click' && score >= clickPower * 10) {
      setScore(prev => prev - clickPower * 10)
      setClickPower(prev => prev + 1)
    }
    if (type === 'auto' && score >= (autoClickers + 1) * 25) {
      setScore(prev => prev - (autoClickers + 1) * 25)
      setAutoClickers(prev => prev + 1)
    }
  }

  return (
    <div className="app">
      <div className="header">
        <h1>🔥 Clicker Vadim</h1>
        <div className="score-display">
          <span className="score">{score.toLocaleString()}</span>
          <span className="label">монет</span>
        </div>
      </div>

      <div className="main-content">
        <button 
          className={`click-btn ${isAnimating ? 'clicked' : ''}`}
          onClick={handleClick}
        >
          <span className="btn-icon">👆</span>
          <span className="btn-text">КЛИК!</span>
          <span className="power">+{clickPower}</span>
        </button>

        {/* Частицы */}
        <div className="particles-container">
          {particles.map(p => (
            <span 
              key={p.id} 
              className="particle"
              style={{ 
                left: p.x, 
                top: p.y,
                color: p.color,
                animation: `float-up 1s ease-out forwards`
              }}
            >
              +{p.value}
            </span>
          ))}
        </div>
      </div>

      <div className="upgrades">
        <h2>🚀 Улучшения</h2>
        <div className="upgrade-grid">
          <div className="upgrade-card">
            <div className="upgrade-icon">⚡</div>
            <div className="upgrade-info">
              <h3>Сила клика</h3>
              <p>Текущая: <strong>+{clickPower}</strong></p>
              <p>Цена: <strong>{clickPower * 10} 💰</strong></p>
            </div>
            <button 
              className="upgrade-btn"
              onClick={() => buyUpgrade('click')}
              disabled={score < clickPower * 10}
            >
              Купить
            </button>
          </div>

          <div className="upgrade-card">
            <div className="upgrade-icon">🤖</div>
            <div className="upgrade-info">
              <h3>Авто-кликер</h3>
              <p>Текущий: <strong>+{autoClickers}/сек</strong></p>
              <p>Цена: <strong>{(autoClickers + 1) * 25} 💰</strong></p>
            </div>
            <button 
              className="upgrade-btn"
              onClick={() => buyUpgrade('auto')}
              disabled={score < (autoClickers + 1) * 25}
            >
              Купить
            </button>
          </div>
        </div>
      </div>

      <div className="footer">
        <p>💡 Кликай по кнопке и покупай улучшения!</p>
        <button 
          className="reset-btn"
          onClick={() => {
            if (confirm('Сбросить прогресс?')) {
              setScore(0)
              setClickPower(1)
              setAutoClickers(0)
              localStorage.removeItem('clicker-score')
            }
          }}
        >
          🔄 Сбросить
        </button>
      </div>
    </div>
  )
}

export default App