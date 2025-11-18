import { http, HttpResponse } from 'msw'
import { mockUser, mockEvent, mockTicket } from '../mock-data'

/**
 * MSW handlers for API mocking in tests
 * Add handlers here as new API routes are created
 */

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export const handlers = [
  // Auth endpoints
  http.post(`${baseUrl}/api/auth/login`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        user: mockUser,
        token: 'mock-jwt-token',
      },
    })
  }),

  http.get(`${baseUrl}/api/auth/me`, () => {
    return HttpResponse.json({
      success: true,
      data: mockUser,
    })
  }),

  // Events endpoints
  http.get(`${baseUrl}/api/events`, () => {
    return HttpResponse.json({
      success: true,
      data: [mockEvent],
      pagination: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
      },
    })
  }),

  http.get(`${baseUrl}/api/events/:id`, ({ params }) => {
    return HttpResponse.json({
      success: true,
      data: { ...mockEvent, id: params.id },
    })
  }),

  http.post(`${baseUrl}/api/events`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>
    return HttpResponse.json({
      success: true,
      data: { ...mockEvent, ...body },
    }, { status: 201 })
  }),

  // Tickets endpoints
  http.get(`${baseUrl}/api/tickets/:id`, ({ params }) => {
    return HttpResponse.json({
      success: true,
      data: { ...mockTicket, id: params.id as string },
    })
  }),

  http.post(`${baseUrl}/api/tickets/:id/transfer`, async ({ params, request }) => {
    const body = await request.json() as { recipientEmail: string }
    return HttpResponse.json({
      success: true,
      data: {
        ticketId: params.id,
        transferredTo: body.recipientEmail,
        status: 'transferred',
      },
    })
  }),

  http.post(`${baseUrl}/api/tickets/validate`, async ({ request }) => {
    const body = await request.json() as { qrCode: string }
    return HttpResponse.json({
      success: true,
      data: {
        valid: true,
        ticket: mockTicket,
        qrCode: body.qrCode,
      },
    })
  }),

  // Error handlers for testing error cases
  http.get(`${baseUrl}/api/events/error`, () => {
    return HttpResponse.json({
      success: false,
      error: 'Internal server error',
    }, { status: 500 })
  }),

  http.get(`${baseUrl}/api/events/not-found`, () => {
    return HttpResponse.json({
      success: false,
      error: 'Event not found',
    }, { status: 404 })
  }),
]
