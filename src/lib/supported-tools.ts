/**
 * Supported AI tools — single source of truth for the app.
 * When adding a new tool to the extension, add it here too.
 * Extension: background.js TOOL_MAP, options.js TOOLS, content.js TOOL_CONFIGS
 */
export const SUPPORTED_TOOLS = [
  'ChatGPT',
  'Claude',
  'Gemini',
  'AI Studio',
  'Perplexity',
  'Midjourney',
  'Grok',
  'Microsoft Copilot',
  'GitHub Copilot',
  'Poe',
  'Character.AI',
  'Mistral',
  'HuggingFace',
  'Replicate',
  'Cohere',
  'Kimi',
] as const

export const SUPPORTED_TOOLS_COUNT = SUPPORTED_TOOLS.length
