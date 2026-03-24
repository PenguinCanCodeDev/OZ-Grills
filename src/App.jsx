import { useMemo, useState } from 'react'
import { menu } from './data/menu'
import { media } from './data/media'
import './App.css'

const SHOP = {
  name: 'OZ Grillz',
  tagline: 'Grilling happiness, one bite at a time.',
  whatsappPhone: '2348026649028',
  bankName: 'Moniepoint',
  accountName: 'OZ Grillz LTD.',
  accountNumber: '5210885396',
}

const formatNaira = (amount) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount)

const buildWhatsAppUrl = ({ cartItems, address, total }) => {
  const lines = []
  lines.push(`*NEW ORDER - OZ GRILLS*`)
  lines.push('')

  cartItems.forEach((item) => {
    lines.push(`- ${item.quantity}x ${item.name} (₦${item.price})`)
  })

  lines.push('')
  lines.push(`*Address:* ${address}`)
  lines.push(`*Total Paid:* ₦${total}`)
  lines.push('')
  lines.push('Please find my transfer receipt attached!')

  const text = encodeURIComponent(lines.join('\n'))
  return `https://wa.me/${SHOP.whatsappPhone}?text=${text}`
}

const sendToWhatsApp = (cartItems, address, total) => {
  const url = buildWhatsAppUrl({ cartItems, address, total })
  window.open(url, '_blank', 'noopener,noreferrer')
}

function App() {
  const [cartById, setCartById] = useState(() => new Map())
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [step, setStep] = useState('menu') // 'menu' | 'payment'
  const [address, setAddress] = useState('')
  const [copyStatus, setCopyStatus] = useState('Copy')

  const deliveryFee = 1000

  const cartItems = useMemo(() => {
    const items = []
    for (const [id, quantity] of cartById.entries()) {
      const product = menu.find((m) => m.id === id)
      if (!product) continue
      items.push({ ...product, quantity })
    }
    return items
  }, [cartById])

  const itemCount = useMemo(
    () => cartItems.reduce((sum, i) => sum + i.quantity, 0),
    [cartItems],
  )

  const subtotal = useMemo(
    () => cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [cartItems],
  )

  const total = subtotal + (itemCount > 0 ? deliveryFee : 0)

  const categories = useMemo(() => {
    const order = ['Burgers', 'Sandwiches', 'Shawarmas', 'Wings', 'Drinks']
    const existing = new Set(menu.map((m) => m.category))
    return order.filter((c) => existing.has(c))
  }, [])

  const inc = (id) => {
    setCartById((prev) => {
      const next = new Map(prev)
      next.set(id, (next.get(id) ?? 0) + 1)
      return next
    })
  }

  const dec = (id) => {
    setCartById((prev) => {
      const next = new Map(prev)
      const current = next.get(id) ?? 0
      if (current <= 1) next.delete(id)
      else next.set(id, current - 1)
      return next
    })
  }

  const clearCart = () => {
    setCartById(new Map())
  }

  const goToPayment = () => {
    setCheckoutOpen(false)
    setStep('payment')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const onPaid = () => {
    const trimmedAddress = address.trim()
    if (!trimmedAddress) {
      setCheckoutOpen(true)
      return
    }
    if (cartItems.length === 0) {
      setStep('menu')
      return
    }
    sendToWhatsApp(cartItems, trimmedAddress, total)
  }

  const copyAccountNumber = async () => {
    try {
      await navigator.clipboard.writeText(SHOP.accountNumber)
      setCopyStatus('Copied')
      window.setTimeout(() => setCopyStatus('Copy'), 1200)
    } catch {
      setCopyStatus('Copy failed')
      window.setTimeout(() => setCopyStatus('Copy'), 1200)
    }
  }

  const groupedMenu = useMemo(() => {
    const groups = new Map()
    for (const item of menu) {
      if (!groups.has(item.category)) groups.set(item.category, [])
      groups.get(item.category).push(item)
    }
    return groups
  }, [])

  const itemImage = (id) => media.items[id] ?? null

  return (
    <div className="app">
      <header className="topbar">
        <button
          className="iconButton"
          onClick={() => (step === 'payment' ? setStep('menu') : null)}
          aria-label={step === 'payment' ? 'Back to menu' : 'Menu'}
          disabled={step !== 'payment'}
        >
          ←
        </button>
        <div className="brand">
          <div className="brandName">{SHOP.name}</div>
          <div className="brandTagline">{SHOP.tagline}</div>
        </div>
        <button
          className="iconButton"
          onClick={() => setCheckoutOpen(true)}
          aria-label="Open cart"
        >
          Cart
          {itemCount > 0 ? <span className="pill">{itemCount}</span> : null}
        </button>
      </header>

      {step === 'menu' ? (
        <main className="content">
          <section className="heroSection">
            <img
              src={media.hero}
              alt="Wood-fired grill with glowing embers"
              className="heroImage"
            />
            <div className="heroOverlay">
              <h1 className="heroTitle">
                Mastering
                <span className="heroTitleAccent">The Flame</span>
              </h1>
              <p className="heroCopy">
                Experience the raw, visceral heat of premium wood-fired grilling.
                Curated for the bold.
              </p>
            </div>
          </section>

          <div className="categoryChips">
            {categories.map((c) => (
              <a key={c} className="chip" href={`#cat-${c}`}>
                {c}
              </a>
            ))}
          </div>

          {categories.map((category) => (
            <section key={category} className="category" id={`cat-${category}`}>
              <div className="categoryHeader">
                <h2>{category}</h2>
              </div>
              <div className="grid">
                {(groupedMenu.get(category) ?? []).map((item) => {
                  const qty = cartById.get(item.id) ?? 0
                  const image = itemImage(item.id)
                  return (
                    <article key={item.id} className="card">
                      {image ? (
                        <div className="cardImageWrap">
                          <img src={image} alt={item.name} className="cardImage" />
                        </div>
                      ) : null}
                      <div className="cardTop">
                        <div className="cardName">{item.name}</div>
                        <div className="cardPrice">{formatNaira(item.price)}</div>
                      </div>

                      <div className="cardActions">
                        {qty === 0 ? (
                          <button className="primary" onClick={() => inc(item.id)}>
                            Add to cart
                          </button>
                        ) : (
                          <div className="qty">
                            <button
                              className="qtyBtn"
                              onClick={() => dec(item.id)}
                              aria-label={`Decrease ${item.name}`}
                            >
                              –
                            </button>
                            <div className="qtyCount">{qty}</div>
                            <button
                              className="qtyBtn"
                              onClick={() => inc(item.id)}
                              aria-label={`Increase ${item.name}`}
                            >
                              +
                            </button>
                          </div>
                        )}
                        {qty > 0 ? (
                          <button className="ghost" onClick={() => dec(item.id)}>
                            Remove
                          </button>
                        ) : (
                          <span className="muted"> </span>
                        )}
                      </div>
                    </article>
                  )
                })}
              </div>
            </section>
          ))}
          <div className="bottomSpacer" />
        </main>
      ) : (
        <main className="content payment">
          <div className="paymentHeader">
            <div className="kicker">Secure Payment</div>
            <h1 className="paymentTitle">Manual Bank Transfer</h1>
            <p className="paymentSubtitle">
              Minimize this page, make the transfer in your bank app, then return
              here.
            </p>
          </div>

          <div className="paymentCard">
            <div className="kv">
              <div className="k">Bank name</div>
              <div className="v">{SHOP.bankName}</div>
            </div>
            <div className="kv">
              <div className="k">Account name</div>
              <div className="v">{SHOP.accountName}</div>
            </div>
            <div className="kv accountRow">
              <div>
                <div className="k">Account number</div>
                <div className="v accountNumber">{SHOP.accountNumber}</div>
              </div>
              <button className="copyBtn" onClick={copyAccountNumber}>
                {copyStatus}
              </button>
            </div>
          </div>

          <div className="paymentCard">
            <div className="k">Total to pay</div>
            <div className="bigTotal">{formatNaira(total)}</div>
            <div className="muted">
              Includes delivery fee{itemCount > 0 ? '' : ' (added once you add items)'}.
            </div>
          </div>

          <button className="primary cta" onClick={onPaid}>
            I Have Paid
          </button>

          <div className="finePrint">SECURE PAYMENT GATEWAY BY OZ GRILLZ</div>
        </main>
      )}

      {step === 'menu' && itemCount > 0 ? (
        <div className="cartBar">
          <div className="cartBarLeft">
            <div className="cartBarTitle">Items in cart</div>
            <div className="cartBarMeta">
              {itemCount} • {formatNaira(total)}
            </div>
          </div>
          <button className="primary" onClick={() => setCheckoutOpen(true)}>
            View cart
          </button>
        </div>
      ) : null}

      {checkoutOpen ? (
        <div
          className="overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Checkout"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setCheckoutOpen(false)
          }}
        >
          <div className="drawer">
            <div className="drawerTop">
              <div className="drawerTitle">Your Selection</div>
              <button className="iconButton" onClick={() => setCheckoutOpen(false)}>
                ✕
              </button>
            </div>

            {cartItems.length === 0 ? (
              <div className="empty">
                Your cart is empty. Add something tasty from the menu.
              </div>
            ) : (
              <>
                <div className="cartList">
                  {cartItems.map((item) => (
                    <div key={item.id} className="cartItem">
                      <div className="cartItemMain">
                        <div className="cartItemName">{item.name}</div>
                        <div className="cartItemSub">
                          {formatNaira(item.price)} each
                        </div>
                      </div>
                      <div className="cartItemRight">
                        <div className="qty compact">
                          <button
                            className="qtyBtn"
                            onClick={() => dec(item.id)}
                            aria-label={`Decrease ${item.name}`}
                          >
                            –
                          </button>
                          <div className="qtyCount">{item.quantity}</div>
                          <button
                            className="qtyBtn"
                            onClick={() => inc(item.id)}
                            aria-label={`Increase ${item.name}`}
                          >
                            +
                          </button>
                        </div>
                        <button className="ghost" onClick={() => dec(item.id)}>
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="logistics">
                  <div className="drawerSubtitle">Delivery Logistics</div>
                  <label className="field">
                    <span className="fieldLabel">Delivery address (required)</span>
                    <input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter your delivery address…"
                      className="input"
                      required
                    />
                  </label>
                </div>

                <div className="recap">
                  <div className="drawerSubtitle">Order Recap</div>
                  <div className="row">
                    <span className="muted">Subtotal</span>
                    <span className="strong">{formatNaira(subtotal)}</span>
                  </div>
                  <div className="row">
                    <span className="muted">Delivery fee</span>
                    <span className="strong">{formatNaira(deliveryFee)}</span>
                  </div>
                  <div className="row totalRow">
                    <span className="muted">Grand total</span>
                    <span className="grand">{formatNaira(total)}</span>
                  </div>
                </div>

                <div className="drawerActions">
                  <button className="ghost" onClick={clearCart}>
                    Clear cart
                  </button>
                  <button
                    className="primary"
                    onClick={goToPayment}
                    disabled={!address.trim()}
                    title={!address.trim() ? 'Please enter delivery address' : ''}
                  >
                    Proceed to payment
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}
export default App
