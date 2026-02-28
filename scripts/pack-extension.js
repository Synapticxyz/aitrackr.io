#!/usr/bin/env node
/**
 * Pack extension: copy source to dist and create zip.
 * Reads version from extension/manifest.json; zip name includes version.
 * Usage: node scripts/pack-extension.js
 */
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const root = path.join(__dirname, '..')
const extDir = path.join(root, 'extension')
const distDir = path.join(extDir, 'dist')

const manifest = JSON.parse(fs.readFileSync(path.join(extDir, 'manifest.json'), 'utf8'))
const version = manifest.version

const files = ['manifest.json', 'background.js', 'content.js', 'popup.html', 'popup.js', 'options.html', 'options.js']
for (const f of files) {
  const src = path.join(extDir, f)
  const dest = path.join(distDir, f)
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest)
    console.log(`Copied ${f}`)
  }
}
// Copy icons dir if present
const iconsSrc = path.join(extDir, 'icons')
const iconsDest = path.join(distDir, 'icons')
if (fs.existsSync(iconsSrc)) {
  if (!fs.existsSync(iconsDest)) fs.mkdirSync(iconsDest, { recursive: true })
  for (const name of fs.readdirSync(iconsSrc)) {
    fs.copyFileSync(path.join(iconsSrc, name), path.join(iconsDest, name))
  }
  console.log('Copied icons/')
}

const zipName = `aitrackr-extension-v${version}.zip`
const zipPath = path.join(distDir, zipName)
// Remove old zip(s) and any leftover temp files (e.g. _makezip.py)
try {
  for (const name of fs.readdirSync(distDir)) {
    const full = path.join(distDir, name)
    if (name.startsWith('aitrackr-extension-') && name.endsWith('.zip')) fs.unlinkSync(full)
    else if (name.startsWith('_')) fs.unlinkSync(full)
  }
} catch (_) {}

let zipOk = false
try {
  execSync('zip -r "' + zipPath.replace(/"/g, '\\"') + '" . -x "*.zip" -x "_*"', { cwd: distDir, stdio: 'inherit' })
  zipOk = true
} catch (_) {}

if (!zipOk) {
  const pyScript = path.join(distDir, '_makezip.py')
  fs.writeFileSync(pyScript, [
    'import zipfile, os',
    'os.chdir("' + distDir.replace(/\\/g, '/') + '")',
    'with zipfile.ZipFile("' + zipPath.replace(/\\/g, '/') + '", "w", zipfile.ZIP_DEFLATED) as z:',
    '    for r, _, files in os.walk("."):',
    '        for f in files:',
    '            if f.endswith(".zip") or f.startswith("_"): continue',
    '            p = os.path.join(r, f)',
    '            z.write(p, p)',
  ].join('\n'), 'utf8')
  try {
    execSync('python3 _makezip.py', { cwd: distDir, stdio: 'inherit' })
    zipOk = true
    fs.unlinkSync(pyScript)
  } catch (_) {
    try { fs.unlinkSync(pyScript) } catch (_) {}
  }
}

if (!zipOk) {
  console.error('Zip failed. Install zip (apt install zip) or run from extension/dist: zip -r aitrackr-extension-v' + version + '.zip . -x "*.zip"')
  process.exit(1)
}
console.log('Extension v' + version + ' packed to extension/dist/' + zipName)

// Copy to public/extension/ so the dashboard can serve the latest zip
const publicExt = path.join(root, 'public', 'extension')
if (!fs.existsSync(publicExt)) fs.mkdirSync(publicExt, { recursive: true })
const versionedDest = path.join(publicExt, zipName)
const latestDest = path.join(publicExt, 'aitrackr-extension-latest.zip')
fs.copyFileSync(zipPath, versionedDest)
fs.copyFileSync(zipPath, latestDest)
fs.writeFileSync(path.join(publicExt, 'version.json'), JSON.stringify({ version }) + '\n', 'utf8')
console.log('Copied zip to public/extension/ (versioned + latest) and wrote version.json')
