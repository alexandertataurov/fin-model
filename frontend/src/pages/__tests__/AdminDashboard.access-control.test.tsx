import { describe, it, expect, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import React from 'react'
import AdminDashboard from '@/pages/AdminDashboard'

describe('AdminDashboard access control', () => {
    beforeEach(() => {
        (globalThis as any).__TEST_USER__ = null
    })

    it('redirects to /login when unauthenticated (renders null)', () => {
        const { container } = render(<AdminDashboard />)
        expect(container.firstChild).toBeNull()
    })
})


