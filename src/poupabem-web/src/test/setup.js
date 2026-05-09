import '@testing-library/jest-dom'
import { afterEach, beforeEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

beforeEach(() => {
  localStorage.clear()
  vi.spyOn(window, 'confirm').mockImplementation(() => true)
  vi.spyOn(window, 'alert').mockImplementation(() => {})

  if (!window.URL.createObjectURL) {
    window.URL.createObjectURL = vi.fn(() => 'blob:mock')
    window.URL.revokeObjectURL = vi.fn()
  } else {
    vi.spyOn(window.URL, 'createObjectURL').mockReturnValue('blob:mock')
    vi.spyOn(window.URL, 'revokeObjectURL').mockImplementation(() => {})
  }
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})
