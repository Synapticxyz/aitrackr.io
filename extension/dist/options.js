const DEFAULT_API_BASE = 'https://aitrackr.xflashdev.com'

const TOOLS = [
  { name: 'ChatGPT',        provider: 'OpenAI' },
  { name: 'Claude',         provider: 'Anthropic' },
  { name: 'Gemini',         provider: 'Google' },
  { name: 'AI Studio',      provider: 'Google' },
  { name: 'Perplexity',     provider: 'Perplexity' },
  { name: 'Midjourney',     provider: 'Midjourney' },
  { name: 'Grok',           provider: 'xAI' },
  { name: 'Copilot',        provider: 'Microsoft' },
  { name: 'GitHub Copilot', provider: 'GitHub' },
  { name: 'Poe',            provider: 'Quora' },
  { name: 'Character.AI',   provider: 'Character.AI' },
  { name: 'Mistral',        provider: 'Mistral AI' },
  { name: 'HuggingFace',    provider: 'HuggingFace' },
  { name: 'Replicate',      provider: 'Replicate' },
  { name: 'Cohere',         provider: 'Cohere' },
  { name: 'Kimi',           provider: 'Moonshot AI' },
]

const apiBaseInput = document.getElementById('api-base')
const saveBtn      = document.getElementById('save-btn')
const resetBtn     = document.getElementById('reset-btn')
const saveMsg      = document.getElementById('save-msg')
const clearBtn     = document.getElementById('clear-btn')
const clearMsg     = document.getElementById('clear-msg')
const toolsGrid    = document.getElementById('tools-grid')

// Populate tools grid
toolsGrid.innerHTML = TOOLS.map((t) => `
  <div class="tool-item">
    <div class="tool-dot"></div>
    <span class="tool-name">${t.name}</span>
    <span class="tool-provider">${t.provider}</span>
  </div>`).join('')

// Load saved settings
async function loadSettings() {
  const r = await chrome.storage.sync.get('apiBase')
  apiBaseInput.value = r.apiBase || DEFAULT_API_BASE
}

// Save
saveBtn.addEventListener('click', async () => {
  const val = apiBaseInput.value.trim().replace(/\/$/, '')
  if (!val.startsWith('http')) {
    saveMsg.textContent = 'URL must start with http:// or https://'
    saveMsg.className = 'msg msg-error'
    return
  }
  await chrome.storage.sync.set({ apiBase: val })
  saveMsg.textContent = 'Saved! Restart the extension popup to apply.'
  saveMsg.className = 'msg msg-success'
  setTimeout(() => { saveMsg.textContent = '' }, 3000)
})

// Reset
resetBtn.addEventListener('click', async () => {
  await chrome.storage.sync.remove('apiBase')
  apiBaseInput.value = DEFAULT_API_BASE
  saveMsg.textContent = 'Reset to default.'
  saveMsg.className = 'msg msg-success'
  setTimeout(() => { saveMsg.textContent = '' }, 2000)
})

// Clear all data
clearBtn.addEventListener('click', async () => {
  if (!confirm('Are you sure? This will disconnect you and delete all pending usage data.')) return
  await chrome.storage.sync.clear()
  await chrome.storage.local.clear()
  clearMsg.textContent = 'All data cleared. You will need to reconnect.'
  clearMsg.className = 'msg msg-success'
})

loadSettings()
