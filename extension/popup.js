const DEFAULT_API_BASE = 'https://aitrackr.xflashdev.com'
const COLORS = ['c0','c1','c2','c3','c4','c5','c6','c7']

// ─── DOM refs ─────────────────────────────────────────────────────────────────

const $ = (id) => document.getElementById(id)
const statusBadge     = $('status-badge')
const headerSub       = $('header-sub')
const trackingBanner  = $('tracking-banner')
const trackingTool    = $('tracking-tool')
const statsSection    = $('stats-section')
const statsList       = $('stats-list')
const totalRow        = $('total-row')
const totalValue      = $('total-value')
const queueSection    = $('queue-section')
const queueText       = $('queue-text')
const syncNowBtn      = $('sync-now-btn')
const setupSection    = $('setup-section')
const apiKeyInput     = $('api-key-input')
const connectBtn      = $('connect-btn')
const keyMsg          = $('key-msg')
const footerDiv       = $('footer')
const dashboardBtn    = $('dashboard-btn')
const disconnectBtn   = $('disconnect-btn')
const settingsBtn     = $('settings-btn')
const versionLabel    = $('version-label')
const updateNotice    = $('update-notice')

// ─── Utilities ────────────────────────────────────────────────────────────────

function formatDuration(seconds) {
  if (!seconds || seconds < 1) return '0s'
  if (seconds < 60) return `${seconds}s`
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`
  const h = Math.floor(seconds / 3600)
  const m = Math.round((seconds % 3600) / 60)
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

function setMsg(msg, type = 'info') {
  keyMsg.textContent = msg
  keyMsg.className = `msg msg-${type}`
}

// ─── Render ───────────────────────────────────────────────────────────────────

async function render() {
  const sync = await chrome.storage.sync.get(['apiKey', 'connected', 'lastError'])
  const local = await chrome.storage.local.get(['todayCache', 'todayCacheAt', 'usageQueue'])

  const isConnected = !!(sync.apiKey && sync.connected !== false && sync.lastError !== 'invalid_api_key')
  const isInvalidKey = sync.lastError === 'invalid_api_key'

  // Update badge & header
  if (isInvalidKey) {
    statusBadge.textContent = 'Key Invalid'
    statusBadge.className = 'badge badge-disconnected'
    headerSub.textContent = 'API key rejected'
  } else if (isConnected) {
    statusBadge.textContent = 'Connected'
    statusBadge.className = 'badge badge-connected'
    headerSub.textContent = 'Tracking active'
  } else {
    statusBadge.textContent = 'Disconnected'
    statusBadge.className = 'badge badge-disconnected'
    headerSub.textContent = 'Not connected'
  }

  // Queue section
  const queue = local.usageQueue ?? []
  if (queue.length > 0 && isConnected) {
    queueSection.style.display = 'block'
    queueText.textContent = `${queue.length} session${queue.length !== 1 ? 's' : ''} pending sync`
  } else {
    queueSection.style.display = 'none'
  }

  if (isConnected) {
    setupSection.style.display = 'none'
    footerDiv.style.display = 'flex'

    // Stats
    const today = local.todayCache
    if (today?.byTool) {
      const entries = Object.entries(today.byTool)
        .sort((a, b) => b[1] - a[1])
        .filter(([, s]) => s > 0)

      if (entries.length > 0) {
        statsSection.style.display = 'block'
        const totalSeconds = entries.reduce((s, [, v]) => s + v, 0)

        statsList.innerHTML = entries.map(([tool, seconds], i) => {
          const pct = totalSeconds > 0 ? ((seconds / totalSeconds) * 100).toFixed(0) : 0
          const colorClass = COLORS[i % COLORS.length]
          return `
            <div class="stat-row">
              <div class="stat-dot ${colorClass}"></div>
              <span class="stat-name">${tool}</span>
              <span class="stat-time">${formatDuration(seconds)}</span>
            </div>
            <div class="stat-bar-wrap">
              <div class="stat-bar ${colorClass}" style="width:${pct}%"></div>
            </div>`
        }).join('')

        totalRow.style.display = 'flex'
        totalValue.textContent = formatDuration(totalSeconds)
      } else {
        statsSection.style.display = 'block'
        statsList.innerHTML = '<div class="empty">No usage logged today yet</div>'
        totalRow.style.display = 'none'
      }
    } else {
      statsSection.style.display = 'none'
    }

    // Check tracking state via badge text
    const badgeText = await chrome.action.getBadgeText({})
    if (badgeText === '●') {
      trackingBanner.style.display = 'flex'
      // Try to get current tab
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
        if (tab?.title) trackingTool.textContent = tab.title.slice(0, 30)
      } catch { /* ignore */ }
    } else {
      trackingBanner.style.display = 'none'
    }

  } else {
    setupSection.style.display = 'block'
    footerDiv.style.display = 'none'
    statsSection.style.display = 'none'
    trackingBanner.style.display = 'none'
    queueSection.style.display = 'none'
  }
}

// ─── Connect ──────────────────────────────────────────────────────────────────

connectBtn.addEventListener('click', async () => {
  const key = apiKeyInput.value.trim()
  if (!key) { setMsg('Please enter your API key', 'error'); return }
  if (!key.startsWith('atk_')) { setMsg('API key should start with atk_', 'error'); return }

  connectBtn.textContent = 'Verifying...'
  connectBtn.disabled = true
  setMsg('Connecting to AiTrackr...', 'info')

  try {
    const apiBase = await getApiBase()
    const res = await fetch(`${apiBase}/api/user/api-key`, {
      headers: { 'X-API-Key': key },
    })
    if (res.status === 401) {
      setMsg('Invalid API key. Check the key from your dashboard.', 'error')
      return
    }
    if (!res.ok) throw new Error('Server unreachable')

    await chrome.storage.sync.set({ apiKey: key, connected: true, lastError: null })
    setMsg('Connected! Tracking will start on your next AI tool visit.', 'success')
    setTimeout(render, 800)
  } catch {
    setMsg('Could not reach AiTrackr server. Check your connection.', 'error')
  } finally {
    connectBtn.textContent = 'Connect'
    connectBtn.disabled = false
  }
})

// ─── Disconnect ───────────────────────────────────────────────────────────────

disconnectBtn.addEventListener('click', async () => {
  await chrome.storage.sync.remove(['apiKey', 'connected', 'lastError'])
  await chrome.storage.local.remove(['todayCache', 'todayCacheAt'])
  render()
})

// ─── Sync Now ─────────────────────────────────────────────────────────────────

syncNowBtn.addEventListener('click', async () => {
  syncNowBtn.textContent = 'Syncing...'
  syncNowBtn.disabled = true
  // Trigger background alarm
  await chrome.alarms.create('syncNow', { when: Date.now() + 100 })
  setTimeout(async () => {
    syncNowBtn.textContent = 'Sync now'
    syncNowBtn.disabled = false
    await render()
  }, 2000)
})

// ─── Dashboard ────────────────────────────────────────────────────────────────

dashboardBtn.addEventListener('click', async () => {
  const apiBase = await getApiBase()
  chrome.tabs.create({ url: `${apiBase}/dashboard` })
})

// ─── Settings ─────────────────────────────────────────────────────────────────

settingsBtn.addEventListener('click', () => {
  chrome.runtime.openOptionsPage()
})

// ─── API Base ─────────────────────────────────────────────────────────────────

async function getApiBase() {
  const r = await chrome.storage.sync.get('apiBase')
  return r.apiBase || DEFAULT_API_BASE
}

// ─── Version check ────────────────────────────────────────────────────────────

const manifest = chrome.runtime.getManifest()
versionLabel.textContent = `v${manifest.version}`

async function checkVersion() {
  try {
    const apiBase = await getApiBase()
    const res = await fetch(`${apiBase}/api/extension/version`)
    if (!res.ok) return
    const data = await res.json()
    if (data.latestVersion && data.latestVersion > manifest.version) {
      updateNotice.innerHTML = `<a href="${data.updateUrl}" class="update-link" target="_blank">Update available ↗</a>`
    }
  } catch { /* non-blocking */ }
}

// ─── Init ─────────────────────────────────────────────────────────────────────

render()
checkVersion()
