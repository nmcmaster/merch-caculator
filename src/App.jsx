import { useState } from 'react'

const SHOWS = 24
const FESTIVALS = 4

const INVENTORY = [
  {
    name: 'KRALLICE "No Hope" T-Shirt',
    sizes: [['S', 1], ['M', 13], ['L', 17], ['XL', 14], ['2XL', 4]],
  },
  {
    name: 'KRALLICE "Wolf Redo" T-Shirt',
    sizes: [['S', 3], ['M', 13], ['L', 9], ['XL', 13], ['2XL', 4], ['3XL', 2]],
  },
  {
    name: 'KRALLICE "Logo" T-Shirt',
    sizes: [['M', 5], ['L', 7], ['XL', 2], ['2XL', 6]],
  },
]

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
      <section className="item inventory">
        <h2>Current Inventory</h2>
        {INVENTORY.map(({ name, sizes }) => (
          <div className="inventory-shirt" key={name}>
            <h3>{name}</h3>
            <div className="sizes">
              {sizes.map(([size, qty]) => (
                <span className="size" key={size}>
                  {size} <strong>{qty}</strong>
                </span>
              ))}
            </div>
            <div className="row total">
              <span>Total</span>
              <span>{sizes.reduce((sum, [, qty]) => sum + qty, 0)}</span>
            </div>
          </div>
        ))}
      </section>
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
