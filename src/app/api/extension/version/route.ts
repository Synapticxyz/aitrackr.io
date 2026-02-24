import { NextResponse } from 'next/server'

const EXTENSION_VERSION = {
  minVersion: '1.0.0',
  latestVersion: '1.0.0',
  updateUrl: 'https://chrome.google.com/webstore/detail/aitrackr',
  releaseNotes: 'Initial release',
}

export async function GET() {
  return NextResponse.json(EXTENSION_VERSION)
}
