// AiTrackr Content Script — Privacy First
// NEVER reads text content, inputs, prompts, responses, or any user data
// ONLY reads: URL path, aria-labels on buttons, data-testid attributes, model badge text

const TOOL_CONFIGS = {
  'chat.openai.com': {
    modelSelectors: [
      '[data-testid="model-switcher-dropdown-button"] span',
      'button[aria-haspopup="menu"] span.text-token-text-secondary',
      '.group\\/button span',
    ],
    featureMap: {
      'image-gen': ['dalle', 'image', 'dall-e'],
      'code':      ['code interpreter', 'python'],
      'browse':    ['browse', 'search the web'],
      'voice':     ['voice', 'audio'],
    },
  },
  'chatgpt.com': {
    modelSelectors: [
      '[data-testid="model-switcher-dropdown-button"] span',
    ],
    featureMap: {
      'image-gen': ['dalle', 'image'],
      'code':      ['code interpreter'],
    },
  },
  'claude.ai': {
    modelSelectors: [
      'button[data-testid="model-selector"] span',
      '[class*="ModelPicker"] span',
      'span[class*="model"]',
    ],
    featureMap: {
      'code':     ['code', 'artifact'],
      'research': ['research', 'analysis'],
    },
  },
  'gemini.google.com': {
    modelSelectors: [
      '[data-model-name]',
      '.model-selector span',
      'div[jsname] span[class*="model"]',
    ],
    featureMap: {
      'image-gen': ['image', 'generate image'],
      'code':      ['code', 'run code'],
    },
  },
  'gemini.google': {
    modelSelectors: [
      '[data-model-name]',
      '.model-selector span',
      'div[jsname] span[class*="model"]',
    ],
    featureMap: {
      'image-gen': ['image', 'generate image'],
      'code':      ['code', 'run code'],
    },
  },
  'aistudio.google.com': {
    modelSelectors: [
      'mat-select[aria-label*="model"] .mat-select-value-text',
      '.model-selector',
    ],
    featureMap: {},
  },
  'perplexity.ai': {
    modelSelectors: [
      'button[aria-label*="model"] span',
      '[data-testid*="model"] span',
    ],
    featureMap: {
      'research': ['focus', 'deep research'],
      'code':     ['code'],
    },
  },
  'grok.com': {
    modelSelectors: [
      '[data-testid*="model"] span',
      'button[aria-label*="Grok"] span',
    ],
    featureMap: {},
  },
  'copilot.microsoft.com': {
    modelSelectors: [
      '[aria-label*="model"] span',
      '.model-name',
    ],
    featureMap: {
      'image-gen': ['designer', 'image creator'],
      'code':      ['code'],
    },
  },
  'poe.com': {
    modelSelectors: [
      '[class*="BotHeader"] span',
      'h2[class*="title"]',
    ],
    featureMap: {},
  },
  'mistral.ai': {
    modelSelectors: [
      '[data-testid*="model"] span',
      'button[aria-haspopup] span',
    ],
    featureMap: {
      'code': ['code', 'codestral'],
    },
  },
  'kimi.com': {
    modelSelectors: [
      '[class*="model"] span',
      'button[class*="ModelSwitch"] span',
      '[data-testid*="model"] span',
    ],
    featureMap: {
      'code':     ['code', 'k2'],
      'research': ['deep research', 'search'],
    },
  },
}

const hostname = window.location.hostname.replace('www.', '')
const config = TOOL_CONFIGS[hostname]
if (!config) return  // Not a tracked tool on this page

// ─── Model Detection ──────────────────────────────────────────────────────────

const MODEL_PATTERN = /^[A-Za-z0-9][A-Za-z0-9\s\-\.\_\+]{0,49}$/  // safe model name pattern

function detectModel() {
  for (const sel of config.modelSelectors) {
    const el = document.querySelector(sel)
    if (!el) continue
    const text = (el.textContent || el.getAttribute('data-model-name') || '').trim()
    if (text && MODEL_PATTERN.test(text) && text.length > 1) return text
  }
  return null
}

// ─── Feature Detection ────────────────────────────────────────────────────────

function detectFeatureFromElement(el) {
  const aria = (el.getAttribute('aria-label') || '').toLowerCase()
  const testid = (el.getAttribute('data-testid') || '').toLowerCase()
  const title = (el.getAttribute('title') || '').toLowerCase()
  const combined = `${aria} ${testid} ${title}`

  for (const [feature, keywords] of Object.entries(config.featureMap ?? {})) {
    if (keywords.some((kw) => combined.includes(kw))) return feature
  }
  return null
}

// ─── Model Observer ───────────────────────────────────────────────────────────

let lastModel = null

function reportModel(model) {
  if (model && model !== lastModel) {
    lastModel = model
    chrome.runtime.sendMessage({ type: 'MODEL_CHANGED', model })
  }
}

function attachModelObserver() {
  const targets = []
  for (const sel of config.modelSelectors) {
    const el = document.querySelector(sel)
    if (el) {
      const root = el.closest('[role="button"]') || el.parentElement || el
      if (!targets.includes(root)) targets.push(root)
    }
  }

  if (targets.length === 0) {
    // Fallback: observe body with low frequency
    const observer = new MutationObserver(() => reportModel(detectModel()))
    observer.observe(document.body, { childList: true, subtree: true })
    return
  }

  const observer = new MutationObserver(() => reportModel(detectModel()))
  targets.forEach((t) => observer.observe(t, { childList: true, subtree: true, characterData: true }))
}

// ─── Feature Click Listener ───────────────────────────────────────────────────

document.addEventListener('click', (e) => {
  const target = e.target
  if (!(target instanceof Element)) return

  // Walk up to 3 levels to find a button with aria attributes
  let el = target
  for (let i = 0; i < 3; i++) {
    const feature = detectFeatureFromElement(el)
    if (feature) {
      chrome.runtime.sendMessage({ type: 'FEATURE_CLICKED', feature })
      return
    }
    if (!el.parentElement) break
    el = el.parentElement
  }
}, { passive: true, capture: false })

// ─── Init ─────────────────────────────────────────────────────────────────────

setTimeout(() => {
  const model = detectModel()
  if (model) {
    lastModel = model
    chrome.runtime.sendMessage({ type: 'MODEL_CHANGED', model })
  }
  attachModelObserver()
}, 1500)

// Re-run after SPA navigation (handles React Router / Next.js apps)
let lastPath = location.pathname
const navObserver = new MutationObserver(() => {
  if (location.pathname !== lastPath) {
    lastPath = location.pathname
    setTimeout(() => {
      const model = detectModel()
      if (model) reportModel(model)
    }, 1000)
  }
})
navObserver.observe(document.documentElement, { childList: true, subtree: true })
