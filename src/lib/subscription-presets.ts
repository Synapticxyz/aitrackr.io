/**
 * Presets for the Add Subscription form: name, provider, URL, category.
 * Aligned with extension TOOL_MAP (background.js). Add new tools here and in extension when needed.
 */
export type AICategory = 'TEXT_GEN' | 'IMAGE_GEN' | 'CODE' | 'VIDEO' | 'AUDIO' | 'RESEARCH' | 'OTHER'

export interface SubscriptionPreset {
  name: string
  provider: string
  url: string
  category: AICategory
}

export const SUBSCRIPTION_PRESETS: SubscriptionPreset[] = [
  { name: 'ChatGPT', provider: 'OpenAI', url: 'https://chat.openai.com', category: 'TEXT_GEN' },
  { name: 'Claude', provider: 'Anthropic', url: 'https://claude.ai', category: 'TEXT_GEN' },
  { name: 'Gemini', provider: 'Google', url: 'https://gemini.google.com', category: 'TEXT_GEN' },
  { name: 'AI Studio', provider: 'Google', url: 'https://aistudio.google.com', category: 'TEXT_GEN' },
  { name: 'Midjourney', provider: 'Midjourney', url: 'https://midjourney.com', category: 'IMAGE_GEN' },
  { name: 'Perplexity', provider: 'Perplexity', url: 'https://perplexity.ai', category: 'RESEARCH' },
  { name: 'Grok', provider: 'xAI', url: 'https://grok.com', category: 'TEXT_GEN' },
  { name: 'Microsoft Copilot', provider: 'Microsoft', url: 'https://copilot.microsoft.com', category: 'TEXT_GEN' },
  { name: 'GitHub Copilot', provider: 'GitHub', url: 'https://github.com/copilot', category: 'CODE' },
  { name: 'Poe', provider: 'Quora', url: 'https://poe.com', category: 'TEXT_GEN' },
  { name: 'Character.AI', provider: 'Character.AI', url: 'https://character.ai', category: 'TEXT_GEN' },
  { name: 'Mistral', provider: 'Mistral AI', url: 'https://mistral.ai', category: 'TEXT_GEN' },
  { name: 'HuggingFace', provider: 'HuggingFace', url: 'https://huggingface.co', category: 'OTHER' },
  { name: 'Replicate', provider: 'Replicate', url: 'https://replicate.com', category: 'OTHER' },
  { name: 'Cohere', provider: 'Cohere', url: 'https://cohere.com', category: 'TEXT_GEN' },
  { name: 'Kimi', provider: 'Moonshot AI', url: 'https://kimi.com', category: 'TEXT_GEN' },
]

export const PRESET_OTHER = '__OTHER__'
