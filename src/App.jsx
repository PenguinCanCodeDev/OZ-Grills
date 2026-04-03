import { Routes, Route, Navigate } from 'react-router-dom'
import { useMemo, useState, useEffect } from 'react'
import './App.css'
import { getMenu, getSettings, getLocations } from './lib/api'

// Components
import Header from './components/layout/Header'
import Sidebar from './components/layout/Sidebar'
import Hero from './components/common/Hero'
import CategorySection from './components/menu/CategorySection'
import CartDrawer from './components/cart/CartDrawer'
import ManualTransfer from './components/payment/ManualTransfer'
import AboutUs from './components/info/AboutUs'
import ContactUs from './components/info/ContactUs'
import DeveloperFooter from './components/layout/DeveloperFooter'


// Admin Components (To be created)
import AdminLogin from './pages/admin/AdminLogin'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/Dashboard'
import ProductManager from './pages/admin/ProductManager'
import LocationManager from './pages/admin/LocationManager'
import SettingsManager from './pages/admin/SettingsManager'

const formatNaira = (amount) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount)

// Main Shop Page Component
function Shop({ 
  menu, settings, locations, cartById, 
  itemCount, total, subtotal, deliveryFee, 
  onInc, onDec, onPaid, copyStatus, onCopy, 
  checkoutOpen, setCheckoutOpen, sidebarOpen, setSidebarOpen,
  step, setStep, infoModal, setInfoModal,
  orderType, setOrderType, address, setAddress, 
  selectedLocationId, setSelectedLocationId, orderNotes, setOrderNotes,
  clearCart, goToPayment, cartItems
}) {
  return (
    <>
      <Sidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onAboutClick={() => setInfoModal('about')}
        onContactClick={() => setInfoModal('contact')}
        instagramHandle={settings?.instagram_handle}
      />

      <Header 
        shopName={settings?.name || 'OZ Grillz'}
        shopTagline={settings?.tagline}
        itemCount={itemCount}
        showBack={step === 'payment'}
        onBack={() => setStep('menu')}
        onMenuOpen={() => setSidebarOpen(true)}
        onOpenCart={() => setCheckoutOpen(true)}
      />

      {step === 'menu' ? (
        <main className="content">
          <Hero 
            heroImage={settings?.hero_image || '/placeholder-hero.jpg'}
            subtitle={settings?.tagline}
          />

          <div className="categoryChips">
            {menu.map((cat) => (
              <a key={cat.id || cat.name} className="chip" href={`#cat-${cat.name}`}>
                {cat.name}
              </a>
            ))}
          </div>

          {menu.map((category) => (
            <CategorySection
              key={category.id || category.name}
              category={category.name}
              products={category.products}
              cartById={cartById}
              onIncrement={onInc}
              onDecrement={onDec}
            />
          ))}

          <div className="bottomSpacer" />
        </main>
      ) : (
        <ManualTransfer 
          bankName={settings?.bank_name}
          accountName={settings?.account_name}
          accountNumber={settings?.account_number}
          total={total}
          copyStatus={copyStatus}
          onCopy={onCopy}
          onPaid={onPaid}
        />
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

      {checkoutOpen && (
        <CartDrawer 
          cartItems={cartItems}
          onClose={() => setCheckoutOpen(false)}
          onIncrement={onInc}
          onDecrement={onDec}
          onClear={clearCart}
          onGoToPayment={goToPayment}
          orderType={orderType}
          onOrderTypeChange={setOrderType}
          address={address}
          onAddressChange={setAddress}
          locations={locations}
          selectedLocationId={selectedLocationId}
          onLocationChange={setSelectedLocationId}
          orderNotes={orderNotes}
          onOrderNotesChange={setOrderNotes}
          subtotal={subtotal}
          deliveryFee={deliveryFee}
          total={total}
        />
      )}

      {infoModal === 'about' && (
        <AboutUs 
          content={settings?.about_us} 
          onClose={() => setInfoModal(null)} 
        />
      )}

      {infoModal === 'contact' && (
        <ContactUs 
          officeLine={settings?.office_line}
          contactEmail={settings?.contact_email}
          instagramHandle={settings?.instagram_handle}
          workingHours={settings?.working_hours}
          onClose={() => setInfoModal(null)}
        />
      )}

      <DeveloperFooter />
    </>

  )
}

function App() {
  // Data State
  const [menu, setMenu] = useState([])
  const [settings, setSettings] = useState(null)
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)

  // UI State
  const [cartById, setCartById] = useState(() => new Map())
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [step, setStep] = useState('menu')
  const [infoModal, setInfoModal] = useState(null)
  const [copyStatus, setCopyStatus] = useState('Copy')

  // Checkout State
  const [orderType, setOrderType] = useState('delivery')
  const [address, setAddress] = useState('')
  const [selectedLocationId, setSelectedLocationId] = useState('')
  const [orderNotes, setOrderNotes] = useState('')

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menuData, settingsData, locationsData] = await Promise.all([
          getMenu(),
          getSettings(),
          getLocations()
        ])
        setMenu(menuData)
        setSettings(settingsData)
        setLocations(locationsData)
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const cartItems = useMemo(() => {
    const items = []
    const allProducts = menu.flatMap(cat => cat.products)
    for (const [id, quantity] of cartById.entries()) {
      const product = allProducts.find((p) => p.id === id)
      if (!product) continue
      items.push({ ...product, quantity })
    }
    return items
  }, [cartById, menu])

  const itemCount = useMemo(
    () => cartItems.reduce((sum, i) => sum + i.quantity, 0),
    [cartItems]
  )

  const subtotal = useMemo(
    () => cartItems.reduce((sum, i) => sum + parseFloat(i.price) * i.quantity, 0),
    [cartItems]
  )

  const selectedLocation = useMemo(() => {
    return locations.find(l => l.id === parseInt(selectedLocationId))
  }, [locations, selectedLocationId])

  const deliveryFee = orderType === 'delivery' && selectedLocation ? parseFloat(selectedLocation.fee) : 0
  const total = subtotal + deliveryFee

  const inc = (id) => setCartById(prev => {
    const next = new Map(prev); next.set(id, (next.get(id) ?? 0) + 1); return next
  })
  const dec = (id) => setCartById(prev => {
    const next = new Map(prev); const current = next.get(id) ?? 0
    if (current <= 1) next.delete(id); else next.set(id, current - 1); return next
  })
  const clearCart = () => setCartById(new Map())
  const goToPayment = () => { setCheckoutOpen(false); setStep('payment'); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  const buildWhatsAppUrl = () => {
    const lines = [`*NEW ORDER - ${settings?.name || 'OZ GRILLS'}*`, '', `*Type:* ${orderType === 'delivery' ? '🚀 Delivery' : '🥡 Pickup'}`]
    if (orderType === 'delivery') { lines.push(`*Area:* ${selectedLocation?.name}`, `*Address:* ${address}`) }
    lines.push('', '*Items:*')
    cartItems.forEach(i => lines.push(`- ${i.quantity}x ${i.name} (${formatNaira(i.price)})`))
    if (orderNotes.trim()) lines.push('', `*Notes:* ${orderNotes}`)
    lines.push('', `*Subtotal:* ${formatNaira(subtotal)}`)
    if (orderType === 'delivery') lines.push(`*Delivery:* ${formatNaira(deliveryFee)}`)
    lines.push(`*Total Paid:* ${formatNaira(total)}`, '', 'Please find my transfer receipt attached!')
    return `https://wa.me/${settings?.whatsapp_phone}?text=${encodeURIComponent(lines.join('\n'))}`
  }

  const onPaid = () => window.open(buildWhatsAppUrl(), '_blank', 'noopener,noreferrer')
  const onCopy = async (text) => {
    try { await navigator.clipboard.writeText(text); setCopyStatus('Copied'); setTimeout(() => setCopyStatus('Copy'), 1200) }
    catch { setCopyStatus('Failed'); setTimeout(() => setCopyStatus('Copy'), 1200) }
  }

  if (loading) return <div className="loading">Loading the flame...</div>

  return (
    <Routes>
      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<ProductManager />} />
        <Route path="locations" element={<LocationManager />} />
        <Route path="settings" element={<SettingsManager />} />
      </Route>

      {/* Shop Routes */}
      <Route path="/" element={
        <div className="app">
          <Shop 
            menu={menu} settings={settings} locations={locations} cartById={cartById}
            itemCount={itemCount} total={total} subtotal={subtotal} deliveryFee={deliveryFee}
            onInc={inc} onDec={dec} onPaid={onPaid} copyStatus={copyStatus} onCopy={onCopy}
            checkoutOpen={checkoutOpen} setCheckoutOpen={setCheckoutOpen}
            sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}
            step={step} setStep={setStep} infoModal={infoModal} setInfoModal={setInfoModal}
            orderType={orderType} setOrderType={setOrderType} address={address} setAddress={setAddress}
            selectedLocationId={selectedLocationId} setSelectedLocationId={setSelectedLocationId}
            orderNotes={orderNotes} setOrderNotes={setOrderNotes}
            clearCart={clearCart} goToPayment={goToPayment} cartItems={cartItems}
          />
        </div>
      } />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
