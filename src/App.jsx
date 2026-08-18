import { useState } from 'react'

const SHOWS = 24
const FESTIVALS = 4

const ITEMS = [
  { key: 'tshirts', label: 'T-Shirts', perShow: 20, perFestival: 30 },
  { key: 'longsleeves', label: 'Longsleeve Shirts', perShow: 6, perFestival: 8 },
  { key: 'hoodies', label: 'Hoodies', perShow: 5, perFestival: 8 },
  { key: 'hats', label: 'Hats', perShow: 4, perFestival: 7 },
]

function MerchItem({ label, perShow, perFestival, onChange }) {
  const showQty = Number(perShow) || 0
  const festivalQty = Number(perFestival) || 0
  const showTotal = showQty * SHOWS
  const festivalTotal = festivalQty * FESTIVALS
  const total = showTotal + festivalTotal

  return (
    <section className="item">
      <h2>{label}</h2>
      <div className="inputs">
        <label>
          Per show
          <input
            type="text"
            inputMode="numeric"
            value={perShow}
            onChange={(e) => onChange('perShow', e.target.value)}
          />
        </label>
        <label>
          Per festival
          <input
            type="text"
            inputMode="numeric"
            value={perFestival}
            onChange={(e) => onChange('perFestival', e.target.value)}
          />
        </label>
      </div>
      <div className="math">
        <div className="row">
          <span>{showQty} × {SHOWS} shows</span>
          <span>{showTotal}</span>
        </div>
        <div className="row">
          <span>{festivalQty} × {FESTIVALS} festivals</span>
          <span>{festivalTotal}</span>
        </div>
        <div className="row total">
          <span>{showTotal} + {festivalTotal} = wholesale order</span>
          <span>{total}</span>
        </div>
      </div>
    </section>
  )
}

export default function App() {
  const [items, setItems] = useState(ITEMS)

  const updateItem = (key, field, value) => {
    if (value !== '' && !/^\d+$/.test(value)) return
    const next = value === '' ? '' : Number(value)
    setItems((prev) =>
      prev.map((item) => (item.key === key ? { ...item, [field]: next } : item)),
    )
  }

  return (
    <main className="app">
      <header>
        <h1>Tour Merch Calculator</h1>
        <p>{SHOWS} regular shows · {FESTIVALS} festival shows</p>
      </header>
      {items.map((item) => (
        <MerchItem
          key={item.key}
          label={item.label}
          perShow={item.perShow}
          perFestival={item.perFestival}
          onChange={(field, value) => updateItem(item.key, field, value)}
        />
      ))}
    </main>
  )
}
