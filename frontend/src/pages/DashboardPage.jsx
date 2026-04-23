import { useEffect, useState } from 'react'
import api from '../services/api'
import './DashboardPage.css'

const emptyItemForm = {
  name: '',
  category: 'other',
  quantity: 1,
  expiryDate: '',
}

const categoryOptions = ['produce', 'dairy', 'meat', 'pantry', 'frozen', 'other']

function getDaysUntil(dateValue) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const expiry = new Date(dateValue)
  expiry.setHours(0, 0, 0, 0)

  const diffMs = expiry.getTime() - today.getTime()
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
}

function getDerivedStatus(item) {
  if (item.status === 'used' || item.status === 'wasted') {
    return item.status
  }

  const daysLeft = getDaysUntil(item.expiryDate)

  if (daysLeft < 0) {
    return 'expired'
  }

  if (daysLeft <= 3) {
    return 'expiring-soon'
  }

  return 'fresh'
}

function formatExpiryLabel(dateValue) {
  const date = new Date(dateValue)
  const daysLeft = getDaysUntil(dateValue)
  const formatted = date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  if (daysLeft < 0) {
    return `${formatted} - ${Math.abs(daysLeft)} day${Math.abs(daysLeft) === 1 ? '' : 's'} overdue`
  }

  if (daysLeft === 0) {
    return `${formatted} - expires today`
  }

  return `${formatted} - ${daysLeft} day${daysLeft === 1 ? '' : 's'} left`
}

function DashboardPage() {
  const [user, setUser] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState('')
  const [householdName, setHouseholdName] = useState('')
  const [householdLoading, setHouseholdLoading] = useState(false)
  const [householdMessage, setHouseholdMessage] = useState('')
  const [itemForm, setItemForm] = useState(emptyItemForm)
  const [itemLoading, setItemLoading] = useState(false)
  const [itemMessage, setItemMessage] = useState('')
  const [actionLoadingId, setActionLoadingId] = useState('')

  const loadDashboard = async () => {
    setLoading(true)
    setPageError('')

    try {
      const meResponse = await api.get('/auth/me')
      setUser(meResponse.data)

      if (meResponse.data?.householdId) {
        const itemsResponse = await api.get('/auth/items')
        setItems(itemsResponse.data.items ?? [])
      } else {
        setItems([])
      }
    } catch (error) {
      setPageError(
        error.response?.data?.message || 'Unable to load your dashboard right now.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  const handleHouseholdSubmit = async (event) => {
    event.preventDefault()
    setHouseholdMessage('')

    if (!householdName.trim()) {
      setHouseholdMessage('Please enter a household name.')
      return
    }

    setHouseholdLoading(true)

    try {
      const response = await api.post('/auth/household/create', {
        name: householdName.trim(),
      })

      setUser((currentUser) => ({
        ...currentUser,
        householdId: response.data.household?._id ?? currentUser?.householdId,
      }))
      setHouseholdName('')
      setHouseholdMessage('Household created successfully.')
      await loadDashboard()
    } catch (error) {
      setHouseholdMessage(
        error.response?.data?.message || 'Could not create the household.',
      )
    } finally {
      setHouseholdLoading(false)
    }
  }

  const handleItemChange = (event) => {
    const { name, value } = event.target
    setItemForm((currentForm) => ({
      ...currentForm,
      [name]: name === 'quantity' ? Number(value) : value,
    }))
    setItemMessage('')
  }

  const handleItemSubmit = async (event) => {
    event.preventDefault()
    setItemMessage('')

    if (!itemForm.name.trim() || !itemForm.expiryDate || !itemForm.quantity) {
      setItemMessage('Name, quantity, and expiry date are required.')
      return
    }

    setItemLoading(true)

    try {
      const response = await api.post('/auth/items/create', {
        ...itemForm,
        name: itemForm.name.trim(),
      })

      setItems((currentItems) => [response.data.item, ...currentItems])
      setItemForm(emptyItemForm)
      setItemMessage('Item added successfully.')
    } catch (error) {
      setItemMessage(error.response?.data?.message || 'Could not create item.')
    } finally {
      setItemLoading(false)
    }
  }

  const handleStatusUpdate = async (itemId, status) => {
    setActionLoadingId(itemId)
    setItemMessage('')

    try {
      const response = await api.put(`/auth/items/${itemId}`, { status })
      setItems((currentItems) =>
        currentItems.map((item) =>
          item._id === itemId ? response.data.item : item,
        ),
      )
    } catch (error) {
      setItemMessage(
        error.response?.data?.message || 'Could not update the item status.',
      )
    } finally {
      setActionLoadingId('')
    }
  }

  const handleDelete = async (itemId) => {
    setActionLoadingId(itemId)
    setItemMessage('')

    try {
      await api.delete(`/auth/items/${itemId}`)
      setItems((currentItems) => currentItems.filter((item) => item._id !== itemId))
    } catch (error) {
      setItemMessage(error.response?.data?.message || 'Could not delete the item.')
    } finally {
      setActionLoadingId('')
    }
  }

  const stats = items.reduce(
    (summary, item) => {
      const derivedStatus = getDerivedStatus(item)

      summary.total += 1

      if (derivedStatus === 'fresh') summary.fresh += 1
      if (derivedStatus === 'expiring-soon') summary.expiringSoon += 1
      if (derivedStatus === 'expired') summary.expired += 1

      return summary
    },
    {
      total: 0,
      fresh: 0,
      expiringSoon: 0,
      expired: 0,
    },
  )

  if (loading) {
    return (
      <div className="dashboard-page">
        <main className="dashboard-shell dashboard-loading">
          <div className="loading-ring" aria-hidden="true"></div>
          <p>Loading your dashboard...</p>
        </main>
      </div>
    )
  }

  return (
    <div className="dashboard-page">
      <main className="dashboard-shell">
        <header className="dashboard-navbar">
          <a href="/dashboard" className="dashboard-brand" aria-label="ShelfLife dashboard">
            ShelfLife
          </a>
        </header>

        <section className="dashboard-hero">
          <div className="hero-copy">
            <span className="eyebrow">Dashboard</span>
            <h1>
              Welcome back, <span>{user?.name || 'there'}</span>.
            </h1>
            <p>
              Manage your household inventory, monitor upcoming expiry dates, and
              keep essential items organized.
            </p>
          </div>

          <div className="hero-actions">
            <div className="hero-usercard">
              <span className="usercard-label">Account</span>
              <strong>{user?.email}</strong>
              <span>
                Household status:{' '}
                {user?.householdId ? 'Connected' : 'Not created'}
              </span>
            </div>
            <button type="button" className="ghost-button" onClick={handleLogout}>
              Log out
            </button>
          </div>
        </section>

        {pageError ? (
          <div className="dashboard-alert dashboard-alert-error">{pageError}</div>
        ) : null}

        <section className="stats-grid">
          <article className="stat-card">
            <span className="stat-label">Total items</span>
            <strong>{stats.total}</strong>
          </article>
          <article className="stat-card">
            <span className="stat-label">Fresh</span>
            <strong>{stats.fresh}</strong>
          </article>
          <article className="stat-card">
            <span className="stat-label">Expiring soon</span>
            <strong>{stats.expiringSoon}</strong>
          </article>
          <article className="stat-card">
            <span className="stat-label">Expired</span>
            <strong>{stats.expired}</strong>
          </article>
        </section>

        <section className="dashboard-grid">
          <div className="dashboard-panel panel-tall">
            <div className="panel-header">
              <div>
                <span className="panel-kicker">Household</span>
                <h2>Workspace setup</h2>
              </div>
            </div>

            {user?.householdId ? (
              <div className="household-ready">
                <div className="status-pill">Household connected</div>
                <p>
                  Your account is linked to a household and ready for inventory
                  tracking.
                </p>
              </div>
            ) : (
              <form className="dashboard-form" onSubmit={handleHouseholdSubmit}>
                <label htmlFor="household-name">Household name</label>
                <input
                  id="household-name"
                  type="text"
                  placeholder="Main Kitchen"
                  value={householdName}
                  onChange={(event) => setHouseholdName(event.target.value)}
                  disabled={householdLoading}
                />
                <button
                  type="submit"
                  className="primary-button"
                  disabled={householdLoading}
                >
                  {householdLoading ? 'Creating...' : 'Create household'}
                </button>
              </form>
            )}

            {householdMessage ? (
              <div className="dashboard-alert">{householdMessage}</div>
            ) : null}
          </div>

          <div className="dashboard-panel panel-tall">
            <div className="panel-header">
              <div>
                <span className="panel-kicker">Add item</span>
                <h2>Inventory entry</h2>
              </div>
            </div>

            <form className="dashboard-form" onSubmit={handleItemSubmit}>
              <label htmlFor="item-name">Item name</label>
              <input
                id="item-name"
                name="name"
                type="text"
                placeholder="Greek yogurt"
                value={itemForm.name}
                onChange={handleItemChange}
                disabled={itemLoading || !user?.householdId}
              />

              <div className="form-split">
                <div>
                  <label htmlFor="item-category">Category</label>
                  <select
                    id="item-category"
                    name="category"
                    value={itemForm.category}
                    onChange={handleItemChange}
                    disabled={itemLoading || !user?.householdId}
                  >
                    {categoryOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="item-quantity">Quantity</label>
                  <input
                    id="item-quantity"
                    name="quantity"
                    type="number"
                    min="1"
                    value={itemForm.quantity}
                    onChange={handleItemChange}
                    disabled={itemLoading || !user?.householdId}
                  />
                </div>
              </div>

              <label htmlFor="item-expiryDate">Expiry date</label>
              <input
                id="item-expiryDate"
                name="expiryDate"
                type="date"
                value={itemForm.expiryDate}
                onChange={handleItemChange}
                disabled={itemLoading || !user?.householdId}
              />

              <button
                type="submit"
                className="primary-button"
                disabled={itemLoading || !user?.householdId}
              >
                {itemLoading ? 'Saving...' : 'Add item'}
              </button>
            </form>

            {itemMessage ? <div className="dashboard-alert">{itemMessage}</div> : null}
          </div>
        </section>

        <section className="dashboard-panel inventory-panel">
          <div className="panel-header">
            <div>
              <span className="panel-kicker">Inventory</span>
              <h2>Your items</h2>
            </div>
            <div className="legend-row">
              <span className="legend-chip fresh">Fresh</span>
              <span className="legend-chip expiring-soon">Expiring soon</span>
              <span className="legend-chip expired">Expired</span>
            </div>
          </div>

          {!user?.householdId ? (
            <div className="empty-state">
              <h3>Create a household to get started</h3>
              <p>
                Once your household exists, you can add inventory items and manage
                them here.
              </p>
            </div>
          ) : items.length === 0 ? (
            <div className="empty-state">
              <h3>No items yet</h3>
              <p>Add your first inventory item using the form above.</p>
            </div>
          ) : (
            <div className="inventory-list">
              {items.map((item) => {
                const derivedStatus = getDerivedStatus(item)
                const isBusy = actionLoadingId === item._id

                return (
                  <article key={item._id} className="inventory-card">
                    <div className="inventory-main">
                      <div className="inventory-title-row">
                        <h3>{item.name}</h3>
                        <span className={`status-pill ${derivedStatus}`}>
                          {derivedStatus.replace('-', ' ')}
                        </span>
                      </div>

                      <div className="inventory-meta">
                        <span className="meta-chip">{item.category}</span>
                        <span className="meta-chip">Qty {item.quantity}</span>
                        <span>{formatExpiryLabel(item.expiryDate)}</span>
                      </div>
                    </div>

                    <div className="inventory-actions">
                      <button
                        type="button"
                        className="mini-button"
                        onClick={() => handleStatusUpdate(item._id, 'used')}
                        disabled={isBusy}
                      >
                        Mark used
                      </button>
                      <button
                        type="button"
                        className="mini-button warning"
                        onClick={() => handleStatusUpdate(item._id, 'wasted')}
                        disabled={isBusy}
                      >
                        Mark wasted
                      </button>
                      <button
                        type="button"
                        className="mini-button danger"
                        onClick={() => handleDelete(item._id)}
                        disabled={isBusy}
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default DashboardPage
