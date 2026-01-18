import { useState, useRef, useCallback, useEffect } from 'react'
import './App.css'

type GameState = 'ready' | 'holding' | 'launched' | 'result'
type ResultType = 'none' | 'fail' | 'normal' | 'world'

interface Stats {
  total: number
  fail: number
  normal: number
  world: number
}

interface Country {
  name: string
  message: string
  trivia: string
  flag: string
  flagEmoji: string
}

interface TaketomboColor {
  name: string
  blade: string
  stick: string
  center: string
}

const TAKETOMBO_COLORS: TaketomboColor[] = [
  { name: 'ノーマル', blade: '#DEB887', stick: '#8B4513', center: '#6B8E23' },
  { name: 'さくら', blade: '#FFB7C5', stick: '#8B4513', center: '#FF69B4' },
  { name: 'そら', blade: '#87CEEB', stick: '#4682B4', center: '#1E90FF' },
  { name: 'もえぎ', blade: '#98FB98', stick: '#228B22', center: '#32CD32' },
  { name: 'ゆうやけ', blade: '#FFA500', stick: '#8B0000', center: '#FF4500' },
  { name: 'むらさき', blade: '#DDA0DD', stick: '#4B0082', center: '#9932CC' },
  { name: 'ゴールド', blade: '#FFD700', stick: '#B8860B', center: '#FFA500' },
  { name: 'シルバー', blade: '#C0C0C0', stick: '#708090', center: '#A9A9A9' },
  { name: 'レインボー', blade: 'linear-gradient(90deg, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #4B0082, #8F00FF)', stick: '#8B4513', center: '#FFD700' },
  { name: 'ほのお', blade: '#FF4500', stick: '#8B0000', center: '#FFD700' },
]

const COUNTRIES: Country[] = [
  {
    name: 'アメリカ',
    message: 'ニューヨークの自由の女神の横を通過中。',
    trivia: '自由の女神はフランスからの贈り物。雷に年間約300回打たれている。',
    flag: 'linear-gradient(180deg, #B22234 0%, #B22234 7.7%, #fff 7.7%, #fff 15.4%, #B22234 15.4%, #B22234 23.1%, #fff 23.1%, #fff 30.8%, #B22234 30.8%, #B22234 38.5%, #fff 38.5%, #fff 46.2%, #B22234 46.2%, #B22234 53.9%, #fff 53.9%, #fff 61.6%, #B22234 61.6%, #B22234 69.3%, #fff 69.3%, #fff 77%, #B22234 77%, #B22234 84.7%, #fff 84.7%, #fff 92.4%, #B22234 92.4%)',
    flagEmoji: '🇺🇸'
  },
  {
    name: 'フランス',
    message: 'エッフェル塔の上空をくるくる回っている。',
    trivia: 'エッフェル塔は夏に最大18cm伸びる。金属が熱膨張するため。',
    flag: 'linear-gradient(90deg, #002395 33%, #fff 33%, #fff 66%, #ED2939 66%)',
    flagEmoji: '🇫🇷'
  },
  {
    name: 'イタリア',
    message: 'ピサの斜塔の上に着地しそう。',
    trivia: 'ピサの斜塔は約200年かけて建設された。傾いているのは地盤が柔らかいから。',
    flag: 'linear-gradient(90deg, #009246 33%, #fff 33%, #fff 66%, #CE2B37 66%)',
    flagEmoji: '🇮🇹'
  },
  {
    name: 'エジプト',
    message: 'ピラミッドの上空を飛行中。',
    trivia: 'ギザの大ピラミッドは約230万個の石で作られている。1個平均2.5トン。',
    flag: 'linear-gradient(180deg, #CE1126 33%, #fff 33%, #fff 66%, #000 66%)',
    flagEmoji: '🇪🇬'
  },
  {
    name: 'ブラジル',
    message: 'アマゾンのジャングルの上を飛んでいる。',
    trivia: 'アマゾン川には名前のない支流が数千本ある。地球の酸素の20%を生産。',
    flag: 'linear-gradient(180deg, #009739 0%, #009739 100%)',
    flagEmoji: '🇧🇷'
  },
  {
    name: 'オーストラリア',
    message: 'カンガルーが見上げている。',
    trivia: 'オーストラリアには羊が人間の3倍いる。カンガルーは後ろに歩けない。',
    flag: 'linear-gradient(180deg, #00008B 100%, #00008B 100%)',
    flagEmoji: '🇦🇺'
  },
  {
    name: 'イギリス',
    message: 'ビッグベンの時計の針に引っかかりそう。',
    trivia: 'ビッグベンは時計塔の名前ではなく、中の鐘の名前。塔は「エリザベス・タワー」。',
    flag: 'linear-gradient(180deg, #012169 100%, #012169 100%)',
    flagEmoji: '🇬🇧'
  },
  {
    name: 'インド',
    message: 'タージマハルの上空でホバリング中。',
    trivia: 'タージマハルは妻への愛の証。建設に22年、職人2万人が携わった。',
    flag: 'linear-gradient(180deg, #FF9933 33%, #fff 33%, #fff 66%, #138808 66%)',
    flagEmoji: '🇮🇳'
  },
  {
    name: 'ケニア',
    message: 'サバンナの上空をキリンが見上げている。',
    trivia: 'キリンの睡眠時間は1日30分程度。立ったまま眠ることも。',
    flag: 'linear-gradient(180deg, #000 25%, #BB0000 25%, #BB0000 50%, #006600 75%, #006600 100%)',
    flagEmoji: '🇰🇪'
  },
  {
    name: '中国',
    message: '万里の長城の上を滑空中。',
    trivia: '万里の長城は月から見えるは嘘。でも全長は約2万km以上ある。',
    flag: 'linear-gradient(180deg, #DE2910 100%, #DE2910 100%)',
    flagEmoji: '🇨🇳'
  },
  {
    name: 'ペルー',
    message: 'マチュピチュの遺跡の上空を旋回中。',
    trivia: 'マチュピチュは「老いた峰」という意味。標高2430mにあるインカの空中都市。',
    flag: 'linear-gradient(90deg, #D91023 33%, #fff 33%, #fff 66%, #D91023 66%)',
    flagEmoji: '🇵🇪'
  },
  {
    name: 'メキシコ',
    message: 'チチェン・イッツァのピラミッドに接近中。',
    trivia: '春分と秋分の日、ピラミッドに蛇の影が現れる。マヤ文明の天文学の結晶。',
    flag: 'linear-gradient(90deg, #006847 33%, #fff 33%, #fff 66%, #CE1126 66%)',
    flagEmoji: '🇲🇽'
  },
  {
    name: 'ギリシャ',
    message: 'パルテノン神殿の柱の間を通過中。',
    trivia: 'パルテノン神殿の柱は真っ直ぐに見えるが、実は微妙に膨らんでいる（エンタシス）。',
    flag: 'linear-gradient(180deg, #0D5EAF 11%, #fff 11%, #fff 22%, #0D5EAF 22%, #0D5EAF 33%, #fff 33%, #fff 44%, #0D5EAF 44%, #0D5EAF 55%, #fff 55%, #fff 66%, #0D5EAF 66%, #0D5EAF 77%, #fff 77%, #fff 88%, #0D5EAF 88%)',
    flagEmoji: '🇬🇷'
  },
  {
    name: 'カナダ',
    message: 'ナイアガラの滝の水しぶきを浴びている。',
    trivia: 'ナイアガラの滝は毎分約1億6800万リットルの水が流れ落ちる。',
    flag: 'linear-gradient(90deg, #FF0000 25%, #fff 25%, #fff 75%, #FF0000 75%)',
    flagEmoji: '🇨🇦'
  },
  {
    name: '日本',
    message: '富士山の頂上付近をくるくる回っている。',
    trivia: '富士山は私有地。8合目以上は富士山本宮浅間大社の境内。',
    flag: 'linear-gradient(180deg, #fff 100%, #fff 100%)',
    flagEmoji: '🇯🇵'
  },
]

// localStorageのキー
const STORAGE_KEYS = {
  TOTAL_PLAYS: 'taketombo_totalPlays',
  CUT_BAMBOO_COUNT: 'taketombo_cutBambooCount',
}

function getResult(): ResultType {
  const r = Math.random()
  if (r < 0.3) return 'fail'
  if (r < 0.9) return 'normal'
  return 'world'
}

function getRandomCountry(): Country {
  return COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)]
}

function getRandomColor(currentIndex: number): number {
  let newIndex = Math.floor(Math.random() * TAKETOMBO_COLORS.length)
  while (newIndex === currentIndex) {
    newIndex = Math.floor(Math.random() * TAKETOMBO_COLORS.length)
  }
  return newIndex
}

// localStorageから値を取得
function getStoredNumber(key: string, defaultValue: number): number {
  const stored = localStorage.getItem(key)
  if (stored !== null) {
    const parsed = parseInt(stored, 10)
    if (!isNaN(parsed)) return parsed
  }
  return defaultValue
}

function App() {
  const [gameState, setGameState] = useState<GameState>('ready')
  const [result, setResult] = useState<ResultType>('none')
  const [country, setCountry] = useState<Country | null>(null)
  const [stats, setStats] = useState<Stats>({ total: 0, fail: 0, normal: 0, world: 0 })
  const [colorIndex, setColorIndex] = useState(0)
  const [showColorChange, setShowColorChange] = useState(false)

  // 環境活動ギミック用のState
  const [totalPlays, setTotalPlays] = useState<number>(() => getStoredNumber(STORAGE_KEYS.TOTAL_PLAYS, 0))
  const [cutBambooCount, setCutBambooCount] = useState<number>(() => getStoredNumber(STORAGE_KEYS.CUT_BAMBOO_COUNT, 0))
  const [showBambooCutAnimation, setShowBambooCutAnimation] = useState(false)
  const [bambooIsCut, setBambooIsCut] = useState(false)

  const touchStartX = useRef(0)
  const touchStartTime = useRef(0)

  const currentColor = TAKETOMBO_COLORS[colorIndex]

  // localStorageへの保存
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TOTAL_PLAYS, totalPlays.toString())
  }, [totalPlays])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUT_BAMBOO_COUNT, cutBambooCount.toString())
  }, [cutBambooCount])

  const handleTouchStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (gameState !== 'ready' || showBambooCutAnimation) return

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    touchStartX.current = clientX
    touchStartTime.current = Date.now()
    setGameState('holding')
  }, [gameState, showBambooCutAnimation])

  const handleTouchEnd = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (gameState !== 'holding') return

    const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX
    const deltaX = clientX - touchStartX.current
    const deltaTime = Date.now() - touchStartTime.current
    const swipeDistance = Math.abs(deltaX)
    const swipeSpeed = swipeDistance / deltaTime

    if (swipeDistance > 30 && swipeSpeed > 0.2) {
      setGameState('launched')

      const flightResult = getResult()
      setResult(flightResult)

      if (flightResult === 'world') {
        setCountry(getRandomCountry())
      }

      const animationDuration = flightResult === 'fail' ? 1000 : flightResult === 'normal' ? 2000 : 3000
      setTimeout(() => {
        setGameState('result')
        const newTotal = stats.total + 1
        const newTotalPlays = totalPlays + 1

        setStats(prev => ({
          total: newTotal,
          fail: prev.fail + (flightResult === 'fail' ? 1 : 0),
          normal: prev.normal + (flightResult === 'normal' ? 1 : 0),
          world: prev.world + (flightResult === 'world' ? 1 : 0),
        }))
        setTotalPlays(newTotalPlays)

        // 10回ごとに色が変わる
        if (newTotal % 10 === 0) {
          const newColorIndex = getRandomColor(colorIndex)
          setColorIndex(newColorIndex)
          setShowColorChange(true)
        }

        // 30回ごとに竹を切る演出
        if (newTotalPlays % 30 === 0) {
          // 少し遅延してから竹切り演出を開始
          setTimeout(() => {
            setShowBambooCutAnimation(true)
            setBambooIsCut(false)
          }, 500)
        }
      }, animationDuration)
    } else {
      setGameState('ready')
    }
  }, [gameState, stats.total, colorIndex, totalPlays])

  // 竹を切るアクション（ユーザーがタップ/スワイプ）
  const handleCutBamboo = useCallback(() => {
    if (!showBambooCutAnimation || bambooIsCut) return

    setBambooIsCut(true)
    setCutBambooCount(prev => prev + 1)

    // 2.5秒後に演出終了
    setTimeout(() => {
      setShowBambooCutAnimation(false)
      setBambooIsCut(false)
    }, 2500)
  }, [showBambooCutAnimation, bambooIsCut])

  const handleRetry = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation()
    setGameState('ready')
    setResult('none')
    setCountry(null)
    setShowColorChange(false)
  }

  const getResultMessage = () => {
    switch (result) {
      case 'fail':
        return '失敗... すぐ落ちちゃった'
      case 'normal':
        return 'まあまあ飛んだ！'
      case 'world':
        return `世界へ飛んでいった！`
      default:
        return ''
    }
  }

  const getInstructionText = () => {
    switch (gameState) {
      case 'ready':
        return '画面をタッチして竹とんぼを握ろう'
      case 'holding':
        return '← 左右にスワイプ！ →'
      case 'launched':
        return '飛んでいる...'
      case 'result':
        return ''
      default:
        return ''
    }
  }

  const taketomboStyle = {
    '--blade-color': currentColor.blade,
    '--stick-color': currentColor.stick,
    '--center-color': currentColor.center,
  } as React.CSSProperties

  return (
    <div
      className={`game-container ${gameState === 'result' && result === 'world' ? 'world-bg' : ''}`}
      style={gameState === 'result' && result === 'world' && country ? { '--flag-bg': country.flag } as React.CSSProperties : {}}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
    >
      {/* 背景（空） */}
      <div className={`sky ${gameState === 'result' && result === 'world' ? 'hidden' : ''}`}>
        <div className="cloud cloud-1"></div>
        <div className="cloud cloud-2"></div>
        <div className="cloud cloud-3"></div>
      </div>

      {/* 国旗背景（世界へ飛んだ時） */}
      {gameState === 'result' && result === 'world' && country && (
        <div className="flag-background" style={{ background: country.flag }}>
          <div className="flag-emoji">{country.flagEmoji}</div>
        </div>
      )}

      {/* 竹林演出（30回ごと） */}
      {showBambooCutAnimation && (
        <div
          className="bamboo-forest-overlay"
          onClick={handleCutBamboo}
          onTouchEnd={(e) => { e.stopPropagation(); handleCutBamboo(); }}
        >
          {/* 竹林背景 */}
          <div className="bamboo-forest-bg">
            {/* 背景の竹（遠景） */}
            {[...Array(8)].map((_, i) => (
              <div
                key={`bg-bamboo-${i}`}
                className="bamboo-bg"
                style={{
                  left: `${5 + i * 12}%`,
                  height: `${60 + Math.random() * 30}%`,
                  opacity: 0.3 + Math.random() * 0.2,
                }}
              />
            ))}
          </div>

          {/* メインの竹（切る対象） */}
          <div className={`bamboo-main ${bambooIsCut ? 'cut' : ''}`}>
            <div className="bamboo-trunk">
              {/* 節（ふし） */}
              {[...Array(6)].map((_, i) => (
                <div key={`node-${i}`} className="bamboo-node" style={{ bottom: `${15 + i * 15}%` }} />
              ))}
            </div>
            <div className="bamboo-leaves">
              <div className="leaf leaf-1"></div>
              <div className="leaf leaf-2"></div>
              <div className="leaf leaf-3"></div>
            </div>
          </div>

          {/* ノコギリ */}
          {!bambooIsCut && (
            <div className="saw">
              <div className="saw-blade"></div>
              <div className="saw-handle"></div>
            </div>
          )}

          {/* 説明テキスト */}
          <div className="bamboo-instruction">
            {!bambooIsCut ? (
              <p>タップして竹を切ろう！</p>
            ) : (
              <p className="cut-complete">🎋 竹を1本切りました！</p>
            )}
          </div>
        </div>
      )}

      {/* 竹とんぼ */}
      <div className={`taketombo ${gameState} ${result}`} style={taketomboStyle}>
        <div className="propeller">
          <div className="blade blade-left"></div>
          <div className="blade blade-right"></div>
          <div className="propeller-center"></div>
        </div>
        <div className="stick"></div>
      </div>

      {/* 手 */}
      <div className={`hands ${gameState}`}>
        <div className="hand left-hand">
          <div className="palm">
            <div className="palm-line line-1"></div>
            <div className="palm-line line-2"></div>
          </div>
          <div className="fingers">
            <div className="finger finger-index"><div className="knuckle"></div></div>
            <div className="finger finger-middle"><div className="knuckle"></div></div>
            <div className="finger finger-ring"><div className="knuckle"></div></div>
            <div className="finger finger-pinky"><div className="knuckle"></div></div>
          </div>
          <div className="thumb"><div className="thumb-knuckle"></div></div>
        </div>
        <div className="hand right-hand">
          <div className="palm">
            <div className="palm-line line-1"></div>
            <div className="palm-line line-2"></div>
          </div>
          <div className="fingers">
            <div className="finger finger-index"><div className="knuckle"></div></div>
            <div className="finger finger-middle"><div className="knuckle"></div></div>
            <div className="finger finger-ring"><div className="knuckle"></div></div>
            <div className="finger finger-pinky"><div className="knuckle"></div></div>
          </div>
          <div className="thumb"><div className="thumb-knuckle"></div></div>
        </div>
      </div>

      {/* 操作説明（手の下） */}
      <p className={`instruction ${gameState}`}>{getInstructionText()}</p>

      {/* 結果メッセージ */}
      {gameState === 'result' && !showBambooCutAnimation && (
        <div className={`result-display ${result} ${showColorChange ? 'with-bonus' : ''}`}>
          <p className="result-message">{getResultMessage()}</p>

          {result === 'world' && country && (
            <div className="world-result">
              <p className="country-name">{country.flagEmoji} {country.name}</p>
              <p className="country-message">{country.message}</p>
              <div className="trivia-box">
                <p className="trivia-label">💡 豆知識</p>
                <p className="trivia-text">{country.trivia}</p>
              </div>
            </div>
          )}

          {/* 10回ごとの色変更ボーナス */}
          {showColorChange && (
            <div className="color-change-bonus">
              <p className="bonus-title">🎨 色が変わった！</p>
              <p className="bonus-text">「{currentColor.name}」の竹とんぼになった！</p>
            </div>
          )}

          <button className="retry-button" onClick={handleRetry} onTouchEnd={handleRetry}>
            もう一度飛ばす
          </button>
        </div>
      )}

      {/* 統計 */}
      <div className="stats">
        <span>🎯 {stats.total}</span>
        <span>❌ {stats.fail}</span>
        <span>✓ {stats.normal}</span>
        <span>🌍 {stats.world}</span>
      </div>

      {/* 切られた竹の本数（常時表示） */}
      {cutBambooCount > 0 && (
        <div className="bamboo-count">
          🎋 これまでに切られた竹の本数：{cutBambooCount} 本
        </div>
      )}
    </div>
  )
}

export default App
