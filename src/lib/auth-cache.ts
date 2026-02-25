import { cache } from 'react'
import { auth } from '@/auth'

/**
 * React cache()-wrapped auth() so repeated calls within the same server
 * render tree (e.g. layout + page both calling getSession) only decode
 * the JWT once per request.
 */
export const getSession = cache(auth)
