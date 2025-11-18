/**
 * API Integration Tests - Tickets
 * Tests the tickets API endpoints with mocked responses
 */

describe('Tickets API', () => {
  const baseUrl = 'http://localhost:3000'

  describe('GET /api/tickets/:id', () => {
    it('returns ticket by ID', async () => {
      const ticketId = 'test-ticket-123'
      const response = await fetch(`${baseUrl}/api/tickets/${ticketId}`)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toBeDefined()
      expect(data.data.id).toBe(ticketId)
      expect(data.data.qrCode).toBeDefined()
    })

    it('returns ticket with correct structure', async () => {
      const response = await fetch(`${baseUrl}/api/tickets/test-ticket-id`)
      const data = await response.json()

      const ticket = data.data
      expect(ticket).toHaveProperty('id')
      expect(ticket).toHaveProperty('eventId')
      expect(ticket).toHaveProperty('userId')
      expect(ticket).toHaveProperty('qrCode')
      expect(ticket).toHaveProperty('status')
      expect(ticket).toHaveProperty('price')
    })
  })

  describe('POST /api/tickets/:id/transfer', () => {
    it('transfers ticket to another user', async () => {
      const ticketId = 'test-ticket-123'
      const transferData = {
        recipientEmail: 'recipient@example.com',
      }

      const response = await fetch(`${baseUrl}/api/tickets/${ticketId}/transfer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transferData),
      })

      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.ticketId).toBe(ticketId)
      expect(data.data.transferredTo).toBe(transferData.recipientEmail)
      expect(data.data.status).toBe('transferred')
    })
  })

  describe('POST /api/tickets/validate', () => {
    it('validates ticket QR code', async () => {
      const validationData = {
        qrCode: 'TEST-QR-CODE',
      }

      const response = await fetch(`${baseUrl}/api/tickets/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validationData),
      })

      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.valid).toBe(true)
      expect(data.data.ticket).toBeDefined()
      expect(data.data.qrCode).toBe(validationData.qrCode)
    })

    it('returns ticket details on successful validation', async () => {
      const response = await fetch(`${baseUrl}/api/tickets/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ qrCode: 'VALID-CODE' }),
      })

      const data = await response.json()

      expect(data.data.ticket).toHaveProperty('id')
      expect(data.data.ticket).toHaveProperty('eventId')
      expect(data.data.ticket).toHaveProperty('status')
    })
  })
})
