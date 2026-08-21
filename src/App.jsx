import { useState } from "react";

const SHOWS = 24;
const FESTIVALS = 4;

const INVENTORY = [
    {
        name: 'KRALLICE "No Hope" T-Shirt',
        sizes: [
            ["S", 1],
            ["M", 13],
            ["L", 17],
            ["XL", 14],
            ["2XL", 4],
        ],
    },
    {
        name: 'KRALLICE "Wolf Redo" T-Shirt',
        sizes: [
            ["S", 3],
            ["M", 13],
            ["L", 9],
            ["XL", 13],
            ["2XL", 4],
            ["3XL", 2],
        ],
    },
    {
        name: 'KRALLICE "Logo" T-Shirt',
        sizes: [
            ["M", 5],
            ["L", 7],
            ["XL", 2],
            ["2XL", 6],
        ],
    },
];

const TSHIRT_DESIGNS = [
    "White shirt Scour Order",
    "Inorganic trees",
    "Go Be Forgotten",
    "Logo",
];

const SIZES = ["S", "M", "L", "XL", "2XL"];

// Existing stock of the Logo shirt, folded into the Logo design's totals.
const LOGO_INVENTORY = Object.fromEntries(
    INVENTORY.find((item) => item.name.includes('"Logo"')).sizes,
);
const DEFAULT_SIZE_PCTS = { S: 20, M: 20, L: 20, XL: 20, "2XL": 20 };

const ITEMS = [
    {
        key: "tshirts",
        label: "T-Shirts",
        perShow: 20,
        perFestival: 30,
        designs: TSHIRT_DESIGNS,
        sizePcts: { ...DEFAULT_SIZE_PCTS },
    },
    {
        key: "longsleeves",
        label: "Longsleeve Shirts",
        perShow: 6,
        perFestival: 8,
        sizePcts: { ...DEFAULT_SIZE_PCTS },
    },
    {
        key: "hoodies",
        label: "Hoodies",
        perShow: 5,
        perFestival: 8,
        sizePcts: { ...DEFAULT_SIZE_PCTS },
    },
    { key: "hats", label: "Hats", perShow: 4, perFestival: 7 },
];

// Largest-remainder split so the size quantities always add up to the
// percentage share of the total (exactly the total when pcts sum to 100).
function splitBySizes(total, sizePcts) {
    const raw = SIZES.map((s) => (total * (Number(sizePcts[s]) || 0)) / 100);
    const counts = raw.map(Math.floor);
    const pctSum = SIZES.reduce((sum, s) => sum + (Number(sizePcts[s]) || 0), 0);
    let remainder =
        Math.round((total * pctSum) / 100) - counts.reduce((a, b) => a + b, 0);
    raw.map((r, i) => [r - Math.floor(r), i])
        .sort((a, b) => b[0] - a[0])
        .forEach(([, i]) => {
            if (remainder > 0) {
                counts[i] += 1;
                remainder -= 1;
            }
        });
    return SIZES.map((s, i) => [s, counts[i]]);
}

function SizeChips({ total, sizePcts }) {
    return (
        <div className="sizes">
            {splitBySizes(total, sizePcts).map(([size, qty]) => (
                <span className="size" key={size}>
                    {size} <strong>{qty}</strong>
                </span>
            ))}
        </div>
    );
}

function LogoBreakdown({ total, sizePcts }) {
    const split = splitBySizes(total, sizePcts);
    const invTotal = SIZES.reduce(
        (sum, size) => sum + (LOGO_INVENTORY[size] || 0),
        0,
    );
    return (
        <>
            <SizeChips total={total} sizePcts={sizePcts} />
            <div className="chip-line">
                <span className="chip-line-label">
                    + existing inventory ({invTotal})
                </span>
                <div className="sizes">
                    {SIZES.map((size) => (
                        <span className="size" key={size}>
                            {size} <strong>+{LOGO_INVENTORY[size] || 0}</strong>
                        </span>
                    ))}
                </div>
            </div>
            <div className="chip-line">
                <div className="chip-line-header">
                    <span className="chip-line-label">Actual total</span>
                    <span className="chip-line-total">{total + invTotal}</span>
                </div>
                <div className="sizes">
                    {split.map(([size, qty]) => (
                        <span className="size" key={size}>
                            {size}{" "}
                            <strong>{qty + (LOGO_INVENTORY[size] || 0)}</strong>
                        </span>
                    ))}
                </div>
            </div>
        </>
    );
}

function MerchItem({
    label,
    perShow,
    perFestival,
    designs,
    sizePcts,
    onChange,
    onSizeChange,
}) {
    const [expanded, setExpanded] = useState(false);
    const showQty = Number(perShow) || 0;
    const festivalQty = Number(perFestival) || 0;
    const showTotal = showQty * SHOWS;
    const festivalTotal = festivalQty * FESTIVALS;
    const total = showTotal + festivalTotal;
    const pctSum = sizePcts
        ? SIZES.reduce((sum, s) => sum + (Number(sizePcts[s]) || 0), 0)
        : 0;

    return (
        <section className="item">
            {designs ? (
                <button
                    type="button"
                    className="item-toggle"
                    onClick={() => setExpanded((open) => !open)}
                    aria-expanded={expanded}
                >
                    <h2>{label}</h2>
                    <span
                        className={`chevron${expanded ? " open" : ""}`}
                        aria-hidden="true"
                    >
                        ▸
                    </span>
                </button>
            ) : (
                <h2>{label}</h2>
            )}
            <div className="inputs">
                <label>
                    Per show
                    <input
                        type="text"
                        inputMode="numeric"
                        value={perShow}
                        onChange={(e) => onChange("perShow", e.target.value)}
                    />
                </label>
                <label>
                    Per festival
                    <input
                        type="text"
                        inputMode="numeric"
                        value={perFestival}
                        onChange={(e) =>
                            onChange("perFestival", e.target.value)
                        }
                    />
                </label>
            </div>
            <div className="math">
                <div className="row">
                    <span>
                        {showQty} × {SHOWS} shows
                    </span>
                    <span>{showTotal}</span>
                </div>
                <div className="row">
                    <span>
                        {festivalQty} × {FESTIVALS} festivals
                    </span>
                    <span>{festivalTotal}</span>
                </div>
                <div className="row total">
                    <span>
                        {showTotal} + {festivalTotal} = wholesale order
                    </span>
                    <span>{total}</span>
                </div>
            </div>
            {sizePcts && (
                <div className="size-split">
                    <h3>Size split</h3>
                    <div className="pct-inputs">
                        {SIZES.map((size) => (
                            <label key={size}>
                                {size} %
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={sizePcts[size]}
                                    onChange={(e) =>
                                        onSizeChange(size, e.target.value)
                                    }
                                />
                            </label>
                        ))}
                    </div>
                    {pctSum !== 100 && (
                        <p className="pct-warning">
                            Percentages add up to {pctSum}%
                        </p>
                    )}
                    {!designs && (
                        <SizeChips total={total} sizePcts={sizePcts} />
                    )}
                </div>
            )}
            {designs && expanded && (
                <div className="designs">
                    {designs.map((design, i) => {
                        const designQty =
                            Math.floor(total / designs.length) +
                            (i < total % designs.length ? 1 : 0);
                        return (
                            <div className="design" key={design}>
                                <div className="row">
                                    <span>{design}</span>
                                    <span>{designQty}</span>
                                </div>
                                {sizePcts &&
                                    (design === "Logo" ? (
                                        <LogoBreakdown
                                            total={designQty}
                                            sizePcts={sizePcts}
                                        />
                                    ) : (
                                        <SizeChips
                                            total={designQty}
                                            sizePcts={sizePcts}
                                        />
                                    ))}
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}

export default function App() {
    const [items, setItems] = useState(ITEMS);

    const updateItem = (key, field, value) => {
        if (value !== "" && !/^\d+$/.test(value)) return;
        const next = value === "" ? "" : Number(value);
        setItems((prev) =>
            prev.map((item) =>
                item.key === key ? { ...item, [field]: next } : item,
            ),
        );
    };

    const updateSizePct = (key, size, value) => {
        if (value !== "" && !/^\d+$/.test(value)) return;
        const next = value === "" ? "" : Number(value);
        setItems((prev) =>
            prev.map((item) =>
                item.key === key
                    ? { ...item, sizePcts: { ...item.sizePcts, [size]: next } }
                    : item,
            ),
        );
    };

    return (
        <main className="app">
            <header>
                <h1>Tour Merch Calculator</h1>
                <p>
                    {SHOWS} regular shows · {FESTIVALS} festival shows
                </p>
            </header>

            {items.map((item) => (
                <MerchItem
                    key={item.key}
                    label={item.label}
                    perShow={item.perShow}
                    perFestival={item.perFestival}
                    designs={item.designs}
                    sizePcts={item.sizePcts}
                    onChange={(field, value) =>
                        updateItem(item.key, field, value)
                    }
                    onSizeChange={(size, value) =>
                        updateSizePct(item.key, size, value)
                    }
                />
            ))}
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
                            <span>
                                {sizes.reduce((sum, [, qty]) => sum + qty, 0)}
                            </span>
                        </div>
                    </div>
                ))}
            </section>
        </main>
    );
}
