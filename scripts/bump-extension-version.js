#!/usr/bin/env node
/**
 * Bump extension version in extension/manifest.json.
 * Usage: node scripts/bump-extension-version.js [patch|minor|major]
 * Default: patch
 */
const fs = require('fs')
const path = require('path')

const manifestPath = path.join(__dirname, '..', 'extension', 'manifest.json')
const bump = (process.argv[2] || 'patch').toLowerCase()
if (!['patch', 'minor', 'major'].includes(bump)) {
  console.error('Usage: bump-extension-version.js [patch|minor|major]')
  process.exit(1)
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
const parts = manifest.version.split('.').map(Number)
const major = parts[0] || 0
const minor = parts[1] || 0
const patch = parts[2] || 0

let nextVersion
if (bump === 'major') nextVersion = [major + 1, 0, 0]
else if (bump === 'minor') nextVersion = [major, minor + 1, 0]
else nextVersion = [major, minor, patch + 1]

const oldVersion = manifest.version
const newVersion = nextVersion.join('.')
manifest.version = newVersion
fs.writeFileSync(manifestPath, JSON.stringify(manifest) + '\n', 'utf8')
console.log('Extension version: ' + oldVersion + ' -> ' + newVersion)
