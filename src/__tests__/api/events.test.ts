/**
 * API Integration Tests - Events
 * Tests the events API endpoints with mocked responses
 */

describe('Events API', () => {
  const baseUrl = 'http://localhost:3000'

  describe('GET /api/events', () => {
    it('returns list of events with pagination', async () => {
      const response = await fetch(`${baseUrl}/api/events`)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(Array.isArray(data.data)).toBe(true)
      expect(data.pagination).toBeDefined()
      expect(data.pagination.page).toBe(1)
      expect(data.pagination.limit).toBe(10)
    })

    it('returns events with correct structure', async () => {
      const response = await fetch(`${baseUrl}/api/events`)
      const data = await response.json()

      const event = data.data[0]
      expect(event).toHaveProperty('id')
      expect(event).toHaveProperty('title')
      expect(event).toHaveProperty('description')
      expect(event).toHaveProperty('date')
      expect(event).toHaveProperty('venue')
      expect(event).toHaveProperty('price')
    })
  })

  describe('GET /api/events/:id', () => {
    it('returns single event by ID', async () => {
      const eventId = 'test-event-123'
      const response = await fetch(`${baseUrl}/api/events/${eventId}`)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toBeDefined()
      expect(data.data.id).toBe(eventId)
    })

    it('handles non-existent event', async () => {
      const response = await fetch(`${baseUrl}/api/events/not-found`)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Event not found')
    })
  })

  describe('POST /api/events', () => {
    it('creates new event with valid data', async () => {
      const newEvent = {
        title: 'New Test Event',
        description: 'A test event',
        date: new Date().toISOString(),
        venue: 'Test Venue',
        price: 50.00,
      }

      const response = await fetch(`${baseUrl}/api/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEvent),
      })

      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.data.title).toBe(newEvent.title)
    })
  })

  describe('Error Handling', () => {
    it('handles server errors gracefully', async () => {
      const response = await fetch(`${baseUrl}/api/events/error`)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Internal server error')
    })
  })
})
