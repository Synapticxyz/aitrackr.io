const API_BASE = 'https://aitrackr.io'
const QUEUE_KEY = 'usageQueue'
const SYNC_ALARM = 'syncUsage'
const SYNC_INTERVAL_MINUTES = 5
const MAX_RETRIES = 5

// Active tab tracking state
let activeTab = null
let tabStartTime = null

// ─── Session ────────────────────────────────────────────────────────────────

function generateSessionId() {
  return 'sess_' + Date.now().toString(36) + Math.random().toString(36).slice(2)
}

const SESSION_ID = generateSessionId()

// ─── Tool Detection ──────────────────────────────────────────────────────────

const TOOL_MAP = {
  'chat.openai.com': { tool: 'ChatGPT', provider: 'OpenAI' },
  'chatgpt.com': { tool: 'ChatGPT', provider: 'OpenAI' },
  'claude.ai': { tool: 'Claude', provider: 'Anthropic' },
  'gemini.google.com': { tool: 'Gemini', provider: 'Google' },
  'midjourney.com': { tool: 'Midjourney', provider: 'Midjourney' },
  'perplexity.ai': { tool: 'Perplexity', provider: 'Perplexity' },
}

function getToolFromUrl(url) {
  try {
    const hostname = new URL(url).hostname.replace('www.', '')
    return TOOL_MAP[hostname] ?? null
  } catch {
    return null
  }
}

// ─── Queue ───────────────────────────────────────────────────────────────────

async function getQueue() {
  const result = await chrome.storage.local.get(QUEUE_KEY)
  return result[QUEUE_KEY] ?? []
}

async function addToQueue(entry) {
  const queue = await getQueue()
  queue.push({ ...entry, retries: 0, addedAt: Date.now() })
  await chrome.storage.local.set({ [QUEUE_KEY]: queue })
}

async function removeFromQueue(indices) {
  const queue = await getQueue()
  const filtered = queue.filter((_, i) => !indices.includes(i))
  await chrome.storage.local.set({ [QUEUE_KEY]: filtered })
}

// ─── Tab Tracking ─────────────────────────────────────────────────────────────

async function startTracking(tab) {
  const toolInfo = getToolFromUrl(tab.url)
  if (!toolInfo) return
  activeTab = { ...tab, ...toolInfo }
  tabStartTime = Date.now()
}

async function stopTracking() {
  if (!activeTab || !tabStartTime) return

  const durationSeconds = Math.round((Date.now() - tabStartTime) / 1000)
  if (durationSeconds < 5) {
    activeTab = null
    tabStartTime = null
    return
  }

  const entry = {
    tool: activeTab.tool,
    model: activeTab.model ?? null,
    feature: activeTab.feature ?? 'chat',
    durationSeconds,
    sessionId: SESSION_ID,
    timestamp: new Date().toISOString(),
  }

  await addToQueue(entry)
  activeTab = null
  tabStartTime = null
}

// ─── API Sync ─────────────────────────────────────────────────────────────────

async function getApiKey() {
  const result = await chrome.storage.sync.get('apiKey')
  return result.apiKey ?? null
}

async function syncQueue() {
  const apiKey = await getApiKey()
  if (!apiKey) return

  const queue = await getQueue()
  if (queue.length === 0) return

  const toRetry = []
  const successIndices = []

  for (let i = 0; i < queue.length; i++) {
    const entry = queue[i]
    if (entry.retries >= MAX_RETRIES) continue

    try {
      const res = await fetch(`${API_BASE}/api/usage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
        },
        body: JSON.stringify({
          tool: entry.tool,
          model: entry.model,
          feature: entry.feature,
          durationSeconds: entry.durationSeconds,
          sessionId: entry.sessionId,
          timestamp: entry.timestamp,
        }),
      })

      if (res.ok) {
        successIndices.push(i)
      } else if (res.status === 401) {
        // Invalid API key — stop syncing, notify user
        await chrome.storage.sync.set({ connected: false, lastError: 'invalid_api_key' })
        chrome.action.setBadgeText({ text: '!' })
        chrome.action.setBadgeBackgroundColor({ color: '#ef4444' })
        return
      } else if (res.status === 429) {
        // Rate limited — back off
        const retryAfter = parseInt(res.headers.get('Retry-After') ?? '60', 10)
        queue[i].retries = (queue[i].retries ?? 0) + 1
        toRetry.push({ index: i, entry: queue[i] })
        console.log(`[AiTrackr] Rate limited. Retry after ${retryAfter}s`)
      } else {
        queue[i].retries = (queue[i].retries ?? 0) + 1
      }
    } catch (err) {
      queue[i].retries = (queue[i].retries ?? 0) + 1
      console.warn('[AiTrackr] Sync error:', err)
    }
  }

  if (successIndices.length > 0) {
    await removeFromQueue(successIndices)
  }

  // Update today's cache for popup
  await updateTodayCache()
}

async function updateTodayCache() {
  const apiKey = await getApiKey()
  if (!apiKey) return
  try {
    const res = await fetch(`${API_BASE}/api/usage/realtime`, {
      headers: { 'X-API-Key': apiKey },
    })
    if (res.ok) {
      const data = await res.json()
      await chrome.storage.local.set({ todayCache: data, todayCacheAt: Date.now() })
    }
  } catch {
    // Non-blocking
  }
}

// ─── Event Listeners ─────────────────────────────────────────────────────────

chrome.tabs.onActivated.addListener(async (info) => {
  await stopTracking()
  try {
    const tab = await chrome.tabs.get(info.tabId)
    if (tab.url) await startTracking(tab)
  } catch {
    // Tab might not be accessible
  }
})

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'complete') return
  if (activeTab?.id === tabId) {
    await stopTracking()
    await startTracking(tab)
  }
})

chrome.tabs.onRemoved.addListener(async () => {
  await stopTracking()
})

chrome.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    await stopTracking()
  } else {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      if (tab?.url) await startTracking(tab)
    } catch {
      // Ignore
    }
  }
})

// ─── Content Script Messages ──────────────────────────────────────────────────

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.type === 'MODEL_CHANGED' && activeTab?.id === sender.tab?.id) {
    activeTab.model = message.model
  }
  if (message.type === 'FEATURE_CLICKED' && activeTab?.id === sender.tab?.id) {
    activeTab.feature = message.feature
  }
})

// ─── Alarms ──────────────────────────────────────────────────────────────────

chrome.alarms.create(SYNC_ALARM, { periodInMinutes: SYNC_INTERVAL_MINUTES })

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === SYNC_ALARM) {
    await syncQueue()
  }
})

// ─── Install ─────────────────────────────────────────────────────────────────

chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create(SYNC_ALARM, { periodInMinutes: SYNC_INTERVAL_MINUTES })
  console.log('[AiTrackr] Extension installed. Queue sync every 5 minutes.')
})
