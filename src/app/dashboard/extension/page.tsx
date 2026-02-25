'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Copy, RefreshCw, CheckCircle, Shield, Lightbulb, Send } from 'lucide-react'

interface ApiKeyData {
  hasApiKey: boolean
  maskedKey: string | null
  apiKeyCreatedAt: string | null
}

interface SuggestionForm {
  url: string
  name: string
  notes: string
}

export default function ExtensionPage() {
  const [apiKeyData, setApiKeyData] = useState<ApiKeyData | null>(null)
  const [loading, setLoading] = useState(false)
  const [newKey, setNewKey] = useState<string | null>(null)
  const [suggestion, setSuggestion] = useState<SuggestionForm>({ url: '', name: '', notes: '' })
  const [suggestionLoading, setSuggestionLoading] = useState(false)
  const [suggestionSent, setSuggestionSent] = useState(false)

  async function loadApiKey() {
    const res = await fetch('/api/user/api-key')
    if (res.ok) setApiKeyData(await res.json() as ApiKeyData)
  }

  async function generateKey() {
    setLoading(true)
    try {
      const res = await fetch('/api/user/api-key', { method: 'POST' })
      if (res.ok) {
        const data = await res.json() as { apiKey: string }
        setNewKey(data.apiKey)
        await loadApiKey()
        toast.success('API key generated!')
      }
    } finally {
      setLoading(false)
    }
  }

  async function copyKey(key: string) {
    await navigator.clipboard.writeText(key)
    toast.success('Copied to clipboard')
  }

  async function submitSuggestion(e: React.FormEvent) {
    e.preventDefault()
    if (!suggestion.url.trim()) {
      toast.error('Please enter a tool URL')
      return
    }
    setSuggestionLoading(true)
    try {
      const res = await fetch('/api/tool-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: suggestion.url.trim(),
          name: suggestion.name.trim() || undefined,
          notes: suggestion.notes.trim() || undefined,
        }),
      })
      if (res.ok) {
        setSuggestionSent(true)
        setSuggestion({ url: '', name: '', notes: '' })
        toast.success('Thanks! Your suggestion has been sent to our team.')
      } else {
        const data = await res.json() as { error?: string }
        toast.error(data.error ?? 'Failed to submit suggestion')
      }
    } finally {
      setSuggestionLoading(false)
    }
  }

  useEffect(() => { loadApiKey() }, [])

  const steps = [
    { n: 1, title: 'Install the Extension', desc: 'Get the AiTrackr Chrome Extension from the Chrome Web Store.' },
    { n: 2, title: 'Get Your API Key', desc: 'Generate your API key below and copy it.' },
    { n: 3, title: 'Connect the Extension', desc: 'Open the extension popup, paste your API key, and click Connect.' },
    { n: 4, title: 'Start Tracking!', desc: 'Visit ChatGPT, Claude, or any supported AI tool. Usage is tracked automatically.' },
  ]

  const supportedTools = [
    { name: 'ChatGPT', url: 'chat.openai.com', status: 'Supported' },
    { name: 'Claude', url: 'claude.ai', status: 'Supported' },
    { name: 'Gemini', url: 'gemini.google.com', status: 'Supported' },
    { name: 'Google AI Studio', url: 'aistudio.google.com', status: 'Supported' },
    { name: 'Perplexity', url: 'perplexity.ai', status: 'Supported' },
    { name: 'Grok', url: 'grok.com', status: 'Supported' },
    { name: 'Microsoft Copilot', url: 'copilot.microsoft.com', status: 'Supported' },
    { name: 'Poe', url: 'poe.com', status: 'Supported' },
    { name: 'Mistral', url: 'mistral.ai', status: 'Supported' },
    { name: 'Midjourney', url: 'midjourney.com', status: 'Supported' },
  ]

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Chrome Extension</h1>
        <p className="text-muted-foreground">Set up automatic usage tracking</p>
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex items-start gap-3 pt-6">
          <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-sm">Privacy First</p>
            <p className="text-sm text-muted-foreground">
              The extension ONLY tracks which tool you use and for how long.
              It <strong>never</strong> reads your prompts, conversations, or any content.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Setup Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {steps.map((step) => (
              <div key={step.n} className="flex gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  {step.n}
                </div>
                <div>
                  <p className="font-medium text-sm">{step.title}</p>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your API Key</CardTitle>
          <CardDescription>
            Used to securely link the extension to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {newKey ? (
            <div className="space-y-2">
              <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">
                ⚠️ Copy this key now — it won&apos;t be shown again
              </p>
              <div className="flex gap-2">
                <code className="flex-1 p-2 bg-muted rounded text-xs font-mono break-all">{newKey}</code>
                <Button variant="outline" size="icon" onClick={() => copyKey(newKey)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="outline" size="sm" onClick={() => setNewKey(null)}>
                <CheckCircle className="h-4 w-4 mr-2" />
                I&apos;ve saved my key
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {apiKeyData?.hasApiKey ? (
                <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                  <code className="text-xs font-mono">{apiKeyData.maskedKey}</code>
                  <Button variant="ghost" size="sm" onClick={generateKey} disabled={loading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Regenerate
                  </Button>
                </div>
              ) : (
                <Button onClick={generateKey} disabled={loading}>
                  {loading ? 'Generating...' : 'Generate API Key'}
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Supported AI Tools</CardTitle>
          <CardDescription>
            The extension automatically tracks your usage on these platforms.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {supportedTools.map((tool) => (
              <div key={tool.name} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
                <div>
                  <p className="text-sm font-medium">{tool.name}</p>
                  <p className="text-xs text-muted-foreground">{tool.url}</p>
                </div>
                <Badge variant="secondary" className="text-green-600 dark:text-green-400 bg-green-500/10">
                  {tool.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            <CardTitle>Suggest a Tool</CardTitle>
          </div>
          <CardDescription>
            Don&apos;t see your AI tool listed? Let us know and we&apos;ll add support for it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {suggestionSent ? (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10 text-green-700 dark:text-green-400">
              <CheckCircle className="h-5 w-5 shrink-0" />
              <div>
                <p className="text-sm font-medium">Suggestion received!</p>
                <p className="text-xs opacity-80">Our team will review it and add support soon.</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto"
                onClick={() => setSuggestionSent(false)}
              >
                Suggest another
              </Button>
            </div>
          ) : (
            <form onSubmit={submitSuggestion} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tool-url">
                  Tool URL <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="tool-url"
                  placeholder="e.g. app.example.ai"
                  value={suggestion.url}
                  onChange={(e) => setSuggestion((s) => ({ ...s, url: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tool-name">Tool Name</Label>
                <Input
                  id="tool-name"
                  placeholder="e.g. ExampleAI"
                  value={suggestion.name}
                  onChange={(e) => setSuggestion((s) => ({ ...s, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tool-notes">Notes <span className="text-muted-foreground text-xs">(optional)</span></Label>
                <Textarea
                  id="tool-notes"
                  placeholder="Any extra context — pricing tier, what you use it for, etc."
                  className="resize-none"
                  rows={3}
                  value={suggestion.notes}
                  onChange={(e) => setSuggestion((s) => ({ ...s, notes: e.target.value }))}
                />
              </div>
              <Button type="submit" disabled={suggestionLoading} className="w-full sm:w-auto">
                <Send className="h-4 w-4 mr-2" />
                {suggestionLoading ? 'Sending...' : 'Send Suggestion'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
