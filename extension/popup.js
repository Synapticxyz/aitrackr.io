const API_BASE = 'https://aitrackr.io'

const statusBadge = document.getElementById('status-badge')
const statsSection = document.getElementById('stats-section')
const todayStats = document.getElementById('today-stats')
const apiKeySection = document.getElementById('api-key-section')
const apiKeyInput = document.getElementById('api-key-input')
const connectBtn = document.getElementById('connect-btn')
const keyMessage = document.getElementById('key-message')
const dashboardBtn = document.getElementById('dashboard-btn')
const disconnectBtn = document.getElementById('disconnect-btn')

function formatDuration(seconds) {
  if (seconds < 60) return `${seconds}s`
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`
  const h = Math.floor(seconds / 3600)
  const m = Math.round((seconds % 3600) / 60)
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

async function loadState() {
  const data = await chrome.storage.sync.get(['apiKey', 'connected', 'lastError'])
  const cache = await chrome.storage.local.get(['todayCache'])

  if (data.apiKey && data.connected !== false) {
    // Connected state
    statusBadge.textContent = 'Connected'
    statusBadge.className = 'status-badge connected'
    apiKeySection.style.display = 'none'
    disconnectBtn.style.display = 'block'

    if (data.lastError === 'invalid_api_key') {
      statusBadge.textContent = 'Key Invalid'
      statusBadge.className = 'status-badge disconnected'
    }

    // Show today's stats
    const today = cache.todayCache
    if (today) {
      statsSection.style.display = 'block'
      const byTool = Object.entries(today.byTool ?? {})
        .sort((a, b) => b[1] - a[1])
      if (byTool.length > 0) {
        todayStats.innerHTML = byTool
          .map(([tool, seconds]) => `
            <div class="stat-row">
              <span class="stat-label">${tool}</span>
              <span class="stat-value">${formatDuration(seconds)}</span>
            </div>`)
          .join('')
      } else {
        todayStats.innerHTML = '<p style="color:#64748b;font-size:12px">No usage yet today</p>'
      }
    }
  } else {
    // Disconnected
    statsSection.style.display = 'none'
    apiKeySection.style.display = 'block'
    disconnectBtn.style.display = 'none'
  }
}

connectBtn.addEventListener('click', async () => {
  const key = apiKeyInput.value.trim()
  if (!key) {
    keyMessage.innerHTML = '<span class="error-text">Please enter your API key</span>'
    return
  }

  connectBtn.textContent = 'Verifying...'
  connectBtn.disabled = true

  try {
    const res = await fetch(`${API_BASE}/api/health`)
    if (!res.ok) throw new Error('Server unreachable')

    await chrome.storage.sync.set({ apiKey: key, connected: true, lastError: null })
    keyMessage.innerHTML = '<span class="success-text">Connected! Tracking will start shortly.</span>'
    setTimeout(loadState, 1000)
  } catch {
    keyMessage.innerHTML = '<span class="error-text">Could not connect. Check your internet connection.</span>'
  } finally {
    connectBtn.textContent = 'Connect'
    connectBtn.disabled = false
  }
})

disconnectBtn.addEventListener('click', async () => {
  await chrome.storage.sync.remove(['apiKey', 'connected', 'lastError'])
  await chrome.storage.local.remove(['todayCache'])
  loadState()
})

dashboardBtn.addEventListener('click', () => {
  chrome.tabs.create({ url: `${API_BASE}/dashboard` })
})

// Check extension version
fetch(`${API_BASE}/api/extension/version`)
  .then((r) => r.json())
  .then((data) => {
    const current = chrome.runtime.getManifest().version
    if (data.latestVersion > current) {
      const notice = document.createElement('div')
      notice.style.cssText = 'padding:8px 16px;background:#1e293b;font-size:11px;color:#94a3b8'
      notice.innerHTML = `Update available: v${data.latestVersion} <a href="${data.updateUrl}" style="color:#6366f1" target="_blank">Update</a>`
      document.body.appendChild(notice)
    }
  })
  .catch(() => {})

loadState()
