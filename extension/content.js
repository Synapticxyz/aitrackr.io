// AiTrackr Content Script — Privacy First
// NEVER reads text content, inputs, prompts, or responses
// ONLY reads: URL, model selector badges, feature button attributes

const TOOL_CONFIGS = {
  'chat.openai.com': {
    modelSelectors: [
      '[data-testid="model-switcher-dropdown-button"]',
      '.group\\/button span',
    ],
    featureSelectors: {
      'image-gen': '[data-testid*="dalle"], [aria-label*="image"], button[data-plugin*="dall"]',
      'code': '[data-testid*="code"], [aria-label*="code interpreter"]',
      'browse': '[data-testid*="browse"], [aria-label*="browse"]',
    },
  },
  'claude.ai': {
    modelSelectors: [
      '[data-testid="model-selector"] span',
      '.model-name',
    ],
    featureSelectors: {},
  },
  'gemini.google.com': {
    modelSelectors: [
      '.model-selector-label',
    ],
    featureSelectors: {},
  },
}

const hostname = window.location.hostname.replace('www.', '')
const config = TOOL_CONFIGS[hostname]

if (config) {
  // Detect model from DOM (class names / badge text only)
  function detectModel() {
    for (const selector of config.modelSelectors) {
      const el = document.querySelector(selector)
      if (el) {
        const text = el.textContent?.trim()
        // Only send if it looks like a model name (not user content)
        if (text && text.length < 50 && /^[A-Za-z0-9\s\-\.]+$/.test(text)) {
          return text
        }
      }
    }
    return null
  }

  // Detect active feature from button attributes
  function detectFeature() {
    for (const [feature, selector] of Object.entries(config.featureSelectors)) {
      const el = document.querySelector(selector)
      if (el) return feature
    }
    return 'chat'
  }

  // Watch for model changes (MutationObserver on specific badge elements)
  let lastModel = null
  const observer = new MutationObserver(() => {
    const model = detectModel()
    if (model && model !== lastModel) {
      lastModel = model
      chrome.runtime.sendMessage({ type: 'MODEL_CHANGED', model })
    }
  })

  // Only observe the model selector area, not the entire page
  function attachObserver() {
    for (const selector of config.modelSelectors) {
      const el = document.querySelector(selector)
      if (el) {
        observer.observe(el.closest('[role="button"]') ?? el, {
          childList: true,
          subtree: true,
          characterData: true,
        })
      }
    }
  }

  // Initial detection after DOM ready
  setTimeout(() => {
    const model = detectModel()
    if (model) {
      lastModel = model
      chrome.runtime.sendMessage({ type: 'MODEL_CHANGED', model })
    }
    attachObserver()
  }, 1500)

  // Feature click detection via button attribute inspection
  document.addEventListener('click', (e) => {
    const target = e.target
    if (!(target instanceof Element)) return
    // Only inspect aria-label and data attributes, never text content
    const ariaLabel = target.getAttribute('aria-label') ?? ''
    const dataAttr = target.getAttribute('data-testid') ?? ''
    const combined = (ariaLabel + ' ' + dataAttr).toLowerCase()

    let feature = 'chat'
    if (combined.includes('image') || combined.includes('dall')) feature = 'image-gen'
    else if (combined.includes('code')) feature = 'code'
    else if (combined.includes('browse') || combined.includes('search')) feature = 'browse'
    else if (combined.includes('voice') || combined.includes('audio')) feature = 'voice'

    if (feature !== 'chat') {
      chrome.runtime.sendMessage({ type: 'FEATURE_CLICKED', feature })
    }
  }, { passive: true, capture: false })
}
