import { describe, it, expect, beforeEach } from 'vitest'
import apiClient from '../api'

describe('apiClient interceptors', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('adds Authorization header when access_token is present', async () => {
    localStorage.setItem('access_token', 'abc123')
    const handler = (apiClient.interceptors.request as any).handlers[0].fulfilled
    const cfg = await handler({ headers: {} })
    expect(cfg.headers.Authorization).toBe('Bearer abc123')
  })

  it('does not add Authorization when token missing', async () => {
    const handler = (apiClient.interceptors.request as any).handlers[0].fulfilled
    const cfg = await handler({ headers: {} })
    expect(cfg.headers.Authorization).toBeUndefined()
  })

  it('on 401 clears tokens', async () => {
    localStorage.setItem('access_token', 'x')
    localStorage.setItem('refresh_token', 'y')
    localStorage.setItem('user_data', 'z')
    const rejected = (apiClient.interceptors.response as any).handlers[0].rejected
    await rejected({ response: { status: 401 } }).catch(() => {})
    expect(localStorage.getItem('access_token')).toBeNull()
    expect(localStorage.getItem('refresh_token')).toBeNull()
    expect(localStorage.getItem('user_data')).toBeNull()
  })
})


