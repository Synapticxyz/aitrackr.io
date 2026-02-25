'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Copy, RefreshCw, CheckCircle, Shield, Lightbulb, Send, Download, FolderOpen, Tag, AlertCircle } from 'lucide-react'

interface ApiKeyData { hasApiKey: boolean; maskedKey: string | null; apiKeyCreatedAt: string | null }
interface SuggestionForm { url: string; name: string; notes: string }
interface VersionEntry { version: string; date: string; notes: string[] }
interface VersionData { latestVersion: string; minVersion: string; changelog: VersionEntry[] }

const inputCls = 'font-mono text-sm bg-black border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-amber-500/50'

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border border-white/10 bg-[#111111]">
      <div className="px-5 py-4 border-b border-white/10">
        <p className="text-xs font-mono font-bold text-white">{label}</p>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

export default function ExtensionPage() {
  const [apiKeyData, setApiKeyData] = useState<ApiKeyData | null>(null)
  const [loading, setLoading] = useState(false)
  const [newKey, setNewKey] = useState<string | null>(null)
  const [suggestion, setSuggestion] = useState<SuggestionForm>({ url: '', name: '', notes: '' })
  const [suggestionLoading, setSuggestionLoading] = useState(false)
  const [suggestionSent, setSuggestionSent] = useState(false)
  const [versionData, setVersionData] = useState<VersionData | null>(null)

  async function loadApiKey() { const res = await fetch('/api/user/api-key'); if (res.ok) setApiKeyData(await res.json() as ApiKeyData) }
  async function loadVersion() { const res = await fetch('/api/extension/version'); if (res.ok) setVersionData(await res.json() as VersionData) }
  async function generateKey() {
    setLoading(true)
    try { const res = await fetch('/api/user/api-key', { method: 'POST' }); if (res.ok) { const data = await res.json() as { apiKey: string }; setNewKey(data.apiKey); await loadApiKey(); toast.success('API key generated!') } }
    finally { setLoading(false) }
  }
  async function copyKey(key: string) { await navigator.clipboard.writeText(key); toast.success('Copied to clipboard') }
  async function submitSuggestion(e: React.FormEvent) {
    e.preventDefault()
    if (!suggestion.url.trim()) { toast.error('Please enter a tool URL'); return }
    setSuggestionLoading(true)
    try {
      const res = await fetch('/api/tool-suggestions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: suggestion.url.trim(), name: suggestion.name.trim() || undefined, notes: suggestion.notes.trim() || undefined }) })
      if (res.ok) { setSuggestionSent(true); setSuggestion({ url: '', name: '', notes: '' }); toast.success('Suggestion sent!') }
      else toast.error((await res.json() as { error?: string }).error ?? 'Failed to submit')
    } finally { setSuggestionLoading(false) }
  }

  useEffect(() => { loadApiKey(); loadVersion() }, [])

  const steps = [
    { n: 1, title: 'INSTALL_EXTENSION', desc: 'Download and install the extension manually (see instructions below). Chrome Web Store listing coming soon.' },
    { n: 2, title: 'GET_API_KEY', desc: 'Generate your API key below and copy it.' },
    { n: 3, title: 'CONNECT_EXTENSION', desc: 'Open the extension popup, paste your API key, and click Connect.' },
    { n: 4, title: 'START_TRACKING', desc: 'Visit ChatGPT, Claude, or any supported AI tool. Usage is tracked automatically.' },
  ]

  const supportedTools = [
    'ChatGPT', 'Claude', 'Gemini', 'Google AI Studio', 'Perplexity',
    'Grok', 'Microsoft Copilot', 'Poe', 'Mistral', 'Midjourney', 'Kimi',
  ]

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <p className="text-xs font-mono text-gray-500">// SETUP</p>
        <h1 className="text-2xl font-bold font-mono text-white mt-1">CHROME_EXTENSION</h1>
        <p className="text-sm font-mono text-gray-400">Set up automatic usage tracking</p>
      </div>

      {/* Chrome Web Store notice */}
      <div className="flex items-start gap-3 p-4 border border-white/10 bg-[#111111]">
        <Download className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-xs font-mono font-bold text-white mb-1">WHY_NO_CHROME_WEB_STORE?</p>
          <p className="text-xs font-mono text-gray-400 leading-relaxed mb-3">
            Google does not allow companies registered in Slovenia to open a Chrome Web Store developer account.
            Until this changes, the extension is distributed directly from this site — same code, same privacy guarantees, just a manual install.
          </p>
          <a
            href="/extension/aitrackr-extension-v1.0.0.zip"
            download
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 text-black font-mono font-bold text-sm hover:brightness-110 transition-all"
          >
            <Download className="h-4 w-4" />
            DOWNLOAD_EXTENSION_v1.0.0
          </a>
        </div>
      </div>

      {/* Privacy notice */}
      <div className="flex items-start gap-3 p-4 border border-amber-500/20 bg-amber-500/5">
        <Shield className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-xs font-mono font-bold text-amber-500 mb-1">PRIVACY_FIRST</p>
          <p className="text-xs font-mono text-gray-400">
            The extension ONLY tracks which tool you use and for how long. It <strong className="text-white">never</strong> reads your prompts, conversations, or any content.
          </p>
        </div>
      </div>

      <Section label="SETUP_STEPS">
        <div className="space-y-4">
          {steps.map((step) => (
            <div key={step.n} className="flex gap-4">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center bg-amber-500 text-black text-xs font-bold font-mono">
                {step.n}
              </div>
              <div>
                <p className="text-xs font-mono font-bold text-white">{step.title}</p>
                <p className="text-xs font-mono text-gray-500 mt-0.5">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section label="MANUAL_INSTALL">
        <div className="space-y-5">
          <div className="space-y-3">
            <p className="text-xs font-mono font-bold text-white">INSTALL_STEPS</p>
            {[
              { n: 1, text: 'Download the .zip file above and unzip it to a permanent folder on your computer (e.g. Documents/aitrackr-extension)' },
              { n: 2, text: 'Open Chrome and go to chrome://extensions in the address bar' },
              { n: 3, text: 'Enable "Developer mode" using the toggle in the top-right corner' },
              { n: 4, text: 'Click "Load unpacked" and select the unzipped folder' },
              { n: 5, text: 'The AiTrackr icon will appear in your toolbar. Pin it for easy access.' },
            ].map((step) => (
              <div key={step.n} className="flex gap-3">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center border border-amber-500/50 text-amber-500 text-xs font-bold font-mono">
                  {step.n}
                </div>
                <p className="text-xs font-mono text-gray-400 leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>

          <div className="flex items-start gap-3 p-3 border border-white/5 bg-white/[0.02]">
            <FolderOpen className="h-3.5 w-3.5 text-gray-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs font-mono text-gray-600">
              <span className="text-gray-400">NOTE:</span> Do not delete the unzipped folder — Chrome loads the extension from it on every startup. Chrome Web Store version coming soon.
            </p>
          </div>
        </div>
      </Section>

      <Section label="YOUR_API_KEY">
        {newKey ? (
          <div className="space-y-3">
            <p className="text-xs font-mono text-amber-500">⚠ Copy this key now — it won&apos;t be shown again</p>
            <div className="flex gap-2">
              <code className="flex-1 p-3 bg-black border border-white/10 text-xs font-mono text-white break-all">{newKey}</code>
              <button onClick={() => copyKey(newKey)} className="p-3 border border-white/10 text-gray-400 hover:text-white transition-colors">
                <Copy className="h-4 w-4" />
              </button>
            </div>
            <button onClick={() => setNewKey(null)} className="flex items-center gap-2 px-4 py-2 border border-white/10 text-xs font-mono text-gray-400 hover:text-white transition-all">
              <CheckCircle className="h-3.5 w-3.5" />
              I&apos;VE_SAVED_MY_KEY
            </button>
          </div>
        ) : (
          <div>
            {apiKeyData?.hasApiKey ? (
              <div className="flex items-center justify-between p-3 bg-black border border-white/10 mb-3">
                <code className="text-xs font-mono text-gray-400">{apiKeyData.maskedKey}</code>
                <button onClick={generateKey} disabled={loading} className="flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors">
                  <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                  REGENERATE
                </button>
              </div>
            ) : (
              <button onClick={generateKey} disabled={loading} className="px-4 py-2.5 bg-amber-500 text-black font-mono font-bold text-sm hover:brightness-110 transition-all disabled:opacity-60">
                {loading ? 'GENERATING...' : 'GENERATE_API_KEY'}
              </button>
            )}
          </div>
        )}
      </Section>

      <Section label="SUPPORTED_TOOLS">
        <div className="grid grid-cols-2 gap-0">
          {supportedTools.map((tool) => (
            <div key={tool} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0 pr-4">
              <p className="text-xs font-mono text-gray-300">{tool}</p>
              <span className="text-xs font-mono text-green-500">✓ SUPPORTED</span>
            </div>
          ))}
        </div>
      </Section>

      <Section label="VERSION_&amp;_CHANGELOG">
        {versionData ? (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Tag className="h-4 w-4 text-amber-500" />
                <div>
                  <p className="text-xs font-mono text-gray-500">LATEST_VERSION</p>
                  <p className="text-lg font-mono font-bold text-white">v{versionData.latestVersion}</p>
                </div>
              </div>
              <a
                href="/extension/aitrackr-extension-v1.0.0.zip"
                download
                className="flex items-center gap-2 px-3 py-2 border border-amber-500/30 text-amber-500 text-xs font-mono hover:bg-amber-500/10 transition-all"
              >
                <Download className="h-3.5 w-3.5" />
                DOWNLOAD_LATEST
              </a>
            </div>

            <div className="flex items-start gap-2 p-3 border border-white/5 bg-white/[0.02]">
              <AlertCircle className="h-3.5 w-3.5 text-gray-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs font-mono text-gray-500 leading-relaxed">
                The extension popup shows an <span className="text-white">&quot;Update available&quot;</span> notice automatically when a new version is released. Re-download and reload to update.
              </p>
            </div>

            <div className="space-y-4">
              {versionData.changelog.map((entry) => (
                <div key={entry.version} className="border-l-2 border-amber-500/30 pl-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-mono font-bold text-white">v{entry.version}</span>
                    <span className="text-xs font-mono text-gray-600">{entry.date}</span>
                  </div>
                  <ul className="space-y-1">
                    {entry.notes.map((note, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-500 text-xs mt-0.5">›</span>
                        <span className="text-xs font-mono text-gray-400">{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-xs font-mono text-gray-600">Loading...</p>
        )}
      </Section>

      <Section label="SUGGEST_A_TOOL">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="h-4 w-4 text-amber-500" />
          <p className="text-xs font-mono text-gray-400">Don&apos;t see your AI tool? Let us know and we&apos;ll add support.</p>
        </div>
        {suggestionSent ? (
          <div className="flex items-center gap-3 p-4 border border-green-500/20 bg-green-500/5">
            <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-mono font-bold text-green-500">SUGGESTION_RECEIVED</p>
              <p className="text-xs font-mono text-gray-500">Our team will review it and add support soon.</p>
            </div>
            <button onClick={() => setSuggestionSent(false)} className="text-xs font-mono text-gray-500 hover:text-white">SUGGEST_ANOTHER</button>
          </div>
        ) : (
          <form onSubmit={submitSuggestion} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-mono text-gray-400">TOOL_URL *</Label>
              <Input placeholder="e.g. app.example.ai" className={inputCls} value={suggestion.url} onChange={(e) => setSuggestion((s) => ({ ...s, url: e.target.value }))} required />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-mono text-gray-400">TOOL_NAME</Label>
              <Input placeholder="e.g. ExampleAI" className={inputCls} value={suggestion.name} onChange={(e) => setSuggestion((s) => ({ ...s, name: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-mono text-gray-400">NOTES <span className="text-gray-600">(optional)</span></Label>
              <Textarea placeholder="Any extra context..." className={`${inputCls} resize-none`} rows={3} value={suggestion.notes} onChange={(e) => setSuggestion((s) => ({ ...s, notes: e.target.value }))} />
            </div>
            <button type="submit" disabled={suggestionLoading} className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 text-black font-mono font-bold text-sm hover:brightness-110 transition-all disabled:opacity-60">
              <Send className="h-4 w-4" />
              {suggestionLoading ? 'SENDING...' : 'SEND_SUGGESTION'}
            </button>
          </form>
        )}
      </Section>
    </div>
  )
}
