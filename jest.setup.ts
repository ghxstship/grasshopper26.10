// IMPORTANT: Polyfills must be set up BEFORE any imports that need them
import { TextEncoder, TextDecoder } from 'util'
import { Readable, Transform } from 'stream'

// Polyfill TextEncoder/TextDecoder for Node environment (required by MSW)
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder as typeof global.TextDecoder

// Polyfill ReadableStream for MSW compatibility
if (typeof global.ReadableStream === 'undefined') {
  global.ReadableStream = Readable as unknown as typeof ReadableStream
}

// Polyfill TransformStream for MSW compatibility
if (typeof global.TransformStream === 'undefined') {
  global.TransformStream = Transform as unknown as typeof TransformStream
}

// Now import everything else after polyfills are in place
import '@testing-library/jest-dom'
import 'whatwg-fetch'

// Mock environment variables for testing
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
process.env.NEXTAUTH_SECRET = 'test-secret'
process.env.NEXTAUTH_URL = 'http://localhost:3000'

// MSW setup - Currently disabled due to Jest/MSW v2 compatibility issues
// MSW v2.12.1 requires full Web Streams API which Jest doesn't fully support
// Even with Node.js v22, Jest's JSDOM environment lacks required APIs
// 
// Options to enable integration tests:
// 1. Downgrade to MSW v1.x (simpler, works with Jest)
// 2. Use Vitest instead of Jest (better Web API support)
// 3. Use alternative mocking (nock, fetch-mock, etc.)
// 4. Wait for Jest to add better Web API support
//
// For now, integration tests are structured and ready but blocked
// Recommendation: Consider MSW v1.x or Vitest for integration testing

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return []
  }
  unobserve() {}
} as unknown as typeof IntersectionObserver

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
} as unknown as typeof ResizeObserver

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})
