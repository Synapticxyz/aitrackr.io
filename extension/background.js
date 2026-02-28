// AiTrackr Background Service Worker
// Privacy-first: tracks time on AI tools, never reads content

const DEFAULT_API_BASE = 'https://aitrackr.xflashdev.com'
const EXTENSION_VERSION = chrome.runtime.getManifest().version
const QUEUE_KEY = 'usageQueue'
const SYNC_ALARM = 'syncUsage'
const IDLE_ALARM = 'idleCheck'
const SYNC_INTERVAL_MINUTES = 5
const IDLE_THRESHOLD_SECONDS = 120  // 2 min idle = stop tracking
const MAX_RETRIES = 5

// ─── Tool Registry ────────────────────────────────────────────────────────────

const TOOL_MAP = {
  'chat.openai.com':        { tool: 'ChatGPT',       provider: 'OpenAI',      category: 'TEXT_GEN' },
  'chatgpt.com':            { tool: 'ChatGPT',       provider: 'OpenAI',      category: 'TEXT_GEN' },
  'claude.ai':              { tool: 'Claude',        provider: 'Anthropic',   category: 'TEXT_GEN' },
  'gemini.google.com':      { tool: 'Gemini',        provider: 'Google',      category: 'TEXT_GEN' },
  'gemini.google':          { tool: 'Gemini',        provider: 'Google',      category: 'TEXT_GEN' },
  'aistudio.google.com':    { tool: 'AI Studio',     provider: 'Google',      category: 'TEXT_GEN' },
  'midjourney.com':         { tool: 'Midjourney',    provider: 'Midjourney',  category: 'IMAGE_GEN' },
  'perplexity.ai':          { tool: 'Perplexity',    provider: 'Perplexity',  category: 'RESEARCH' },
  'grok.com':               { tool: 'Grok',          provider: 'xAI',         category: 'TEXT_GEN' },
  'x.com':                  { tool: 'Grok',          provider: 'xAI',         category: 'TEXT_GEN', pathPrefix: '/i/grok' },
  'copilot.microsoft.com':  { tool: 'Copilot',       provider: 'Microsoft',   category: 'TEXT_GEN' },
  'github.com':             { tool: 'GitHub Copilot',provider: 'GitHub',      category: 'CODE',     pathPrefix: '/copilot' },
  'poe.com':                { tool: 'Poe',           provider: 'Quora',       category: 'TEXT_GEN' },
  'character.ai':           { tool: 'Character.AI',  provider: 'Character.AI',category: 'TEXT_GEN' },
  'mistral.ai':             { tool: 'Mistral',       provider: 'Mistral AI',  category: 'TEXT_GEN' },
  'huggingface.co':         { tool: 'HuggingFace',   provider: 'HuggingFace', category: 'OTHER' },
  'replicate.com':          { tool: 'Replicate',     provider: 'Replicate',   category: 'OTHER' },
  'cohere.com':             { tool: 'Cohere',        provider: 'Cohere',      category: 'TEXT_GEN' },
  'kimi.com':               { tool: 'Kimi',          provider: 'Moonshot AI', category: 'TEXT_GEN' },
}

function getToolFromUrl(url) {
  try {
    const u = new URL(url)
    const hostname = u.hostname.replace('www.', '')
    const info = TOOL_MAP[hostname]
    if (!info) return null
    // Check path prefix if required (e.g. x.com/i/grok)
    if (info.pathPrefix && !u.pathname.startsWith(info.pathPrefix)) return null
    return info
  } catch {
    return null
  }
}

// ─── State ────────────────────────────────────────────────────────────────────

let activeTab = null
let tabStartTime = null
let isIdle = false
const SESSION_ID = 'sess_' + Date.now().toString(36) + Math.random().toString(36).slice(2)

// ─── Storage helpers ──────────────────────────────────────────────────────────

async function getApiBase() {
  const r = await chrome.storage.sync.get('apiBase')
  return r.apiBase || DEFAULT_API_BASE
}

async function getApiKey() {
  const r = await chrome.storage.sync.get('apiKey')
  return r.apiKey ?? null
}

async function getQueue() {
  const r = await chrome.storage.local.get(QUEUE_KEY)
  return r[QUEUE_KEY] ?? []
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

// ─── Badge ────────────────────────────────────────────────────────────────────

function setBadge(text, color) {
  chrome.action.setBadgeText({ text: text || '' })
  if (color) chrome.action.setBadgeBackgroundColor({ color })
}

function updateTrackingBadge() {
  if (activeTab && !isIdle) {
    setBadge('●', '#22c55e')
  } else {
    setBadge('', '')
  }
}

// ─── Tab Tracking ─────────────────────────────────────────────────────────────

async function startTracking(tab) {
  if (!tab?.url) return
  const toolInfo = getToolFromUrl(tab.url)
  if (!toolInfo) return
  activeTab = { ...tab, ...toolInfo }
  tabStartTime = Date.now()
  isIdle = false
  updateTrackingBadge()
}

async function stopTracking(reason = 'manual') {
  if (!activeTab || !tabStartTime) return

  const durationSeconds = Math.round((Date.now() - tabStartTime) / 1000)

  // Don't log if idle was the cause (already subtracted idle time)
  if (durationSeconds >= 10) {
    const entry = {
      tool: activeTab.tool,
      model: activeTab.model ?? null,
      feature: activeTab.feature ?? 'chat',
      durationSeconds,
      sessionId: SESSION_ID,
      timestamp: new Date().toISOString(),
    }
    await addToQueue(entry)

    // Update popup pending count badge
    const queue = await getQueue()
    if (queue.length > 0) setBadge(String(queue.length), '#6366f1')
  }

  activeTab = null
  tabStartTime = null
  isIdle = false
  updateTrackingBadge()
}

// ─── API Sync ─────────────────────────────────────────────────────────────────

async function syncQueue() {
  const [apiKey, apiBase] = await Promise.all([getApiKey(), getApiBase()])
  if (!apiKey) return { ok: false, error: 'no_api_key' }

  const queue = await getQueue()
  if (queue.length === 0) {
    await updateTodayCache()
    return { ok: true }
  }

  const successIndices = []
  let lastError = null

  for (let i = 0; i < queue.length; i++) {
    const entry = queue[i]
    if ((entry.retries ?? 0) >= MAX_RETRIES) {
      successIndices.push(i)
      continue
    }

    try {
      const res = await fetch(`${apiBase}/api/usage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
          'X-Extension-Version': EXTENSION_VERSION,
        },
        body: JSON.stringify({
          tool: entry.tool,
          model: entry.model ?? null,
          feature: entry.feature,
          durationSeconds: entry.durationSeconds,
          sessionId: entry.sessionId,
          timestamp: entry.timestamp,
        }),
      })

      if (res.ok) {
        successIndices.push(i)
      } else if (res.status === 401) {
        await chrome.storage.sync.set({ connected: false, lastError: 'invalid_api_key' })
        setBadge('!', '#ef4444')
        return { ok: false, error: 'invalid_api_key' }
      } else {
        queue[i].retries = (queue[i].retries ?? 0) + 1
        try {
          const data = await res.json()
          lastError = data.error || `HTTP ${res.status}`
        } catch {
          lastError = `HTTP ${res.status}`
        }
      }
    } catch (e) {
      queue[i].retries = (queue[i].retries ?? 0) + 1
      lastError = (e && e.message) ? String(e.message) : 'Network error'
    }
  }

  if (successIndices.length > 0) {
    await removeFromQueue(successIndices)
    const remaining = await getQueue()
    if (remaining.length === 0) setBadge(activeTab ? '●' : '', activeTab ? '#22c55e' : '')
    else setBadge(String(remaining.length), '#6366f1')
  }

  await updateTodayCache()
  if (lastError) return { ok: false, error: lastError }
  return { ok: true }
}

async function updateTodayCache() {
  const [apiKey, apiBase] = await Promise.all([getApiKey(), getApiBase()])
  if (!apiKey) return
  try {
    const res = await fetch(`${apiBase}/api/usage/realtime`, {
      headers: { 'X-API-Key': apiKey, 'X-Extension-Version': EXTENSION_VERSION },
    })
    if (res.ok) {
      const data = await res.json()
      await chrome.storage.local.set({ todayCache: data, todayCacheAt: Date.now() })
    }
  } catch { /* non-blocking */ }
}

async function verifyApiKey(apiKey) {
  const apiBase = await getApiBase()
  try {
    const res = await fetch(`${apiBase}/api/user/api-key`, {
      headers: { 'X-API-Key': apiKey },
    })
    return res.status !== 401
  } catch {
    return false
  }
}

// ─── Idle Detection ───────────────────────────────────────────────────────────

chrome.idle.onStateChanged.addListener(async (state) => {
  if (state === 'idle' || state === 'locked') {
    if (!isIdle && activeTab) {
      isIdle = true
      // Flush current session as-is (up to now)
      await stopTracking('idle')
    }
  } else if (state === 'active') {
    isIdle = false
    // Resume tracking current tab
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      if (tab?.url) await startTracking(tab)
    } catch { /* ignore */ }
  }
})

// ─── Tab Events ───────────────────────────────────────────────────────────────

chrome.tabs.onActivated.addListener(async (info) => {
  await stopTracking('tab_switch')
  try {
    const tab = await chrome.tabs.get(info.tabId)
    if (tab.url) await startTracking(tab)
  } catch { /* tab not accessible */ }
})

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'complete') return
  if (activeTab?.id === tabId) {
    await stopTracking('navigation')
    await startTracking(tab)
  }
})

chrome.tabs.onRemoved.addListener(async () => {
  await stopTracking('tab_closed')
})

chrome.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    // Don't immediately stop — wait for idle detection
    // Browser loses focus (e.g. alt-tab) but user may return quickly
  } else {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      if (tab?.url) {
        if (!activeTab) await startTracking(tab)
      }
    } catch { /* ignore */ }
  }
})

// ─── Content Script Messages ──────────────────────────────────────────────────

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'MODEL_CHANGED' && activeTab?.id === sender.tab?.id) {
    activeTab.model = message.model
  }
  if (message.type === 'FEATURE_CLICKED' && activeTab?.id === sender.tab?.id) {
    activeTab.feature = message.feature
  }
  if (message.type === 'GET_STATUS') {
    return true  // async response
  }
  if (message.type === 'SYNC_NOW') {
    ;(async () => {
      try {
        const result = await syncQueue()
        if (result && result.ok) {
          sendResponse({ success: true })
        } else {
          sendResponse({ success: false, error: (result && result.error) || 'Sync failed' })
        }
      } catch (err) {
        sendResponse({ success: false, error: (err && err.message) ? String(err.message) : 'Sync failed' })
      }
    })()
    return true  // keep channel open for async sendResponse
  }
  if (message.type === 'VERIFY_KEY') {
    verifyApiKey(message.apiKey).then((valid) => {
      chrome.storage.sync.set({
        apiKey: valid ? message.apiKey : null,
        connected: valid,
        lastError: valid ? null : 'invalid_api_key',
      })
    })
  }
})

// ─── Alarms ───────────────────────────────────────────────────────────────────

chrome.alarms.create(SYNC_ALARM, { periodInMinutes: SYNC_INTERVAL_MINUTES })
chrome.idle.setDetectionInterval(IDLE_THRESHOLD_SECONDS)

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === SYNC_ALARM || alarm.name === 'syncNow') await syncQueue()
})

// ─── Install / Startup ────────────────────────────────────────────────────────

chrome.runtime.onInstalled.addListener(async () => {
  chrome.alarms.create(SYNC_ALARM, { periodInMinutes: SYNC_INTERVAL_MINUTES })
  console.log('[AiTrackr] Installed. Tracking 18 AI tools. Sync every 5 min.')
})

chrome.runtime.onStartup.addListener(async () => {
  await syncQueue()
})
