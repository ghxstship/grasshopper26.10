# API Reference

**Complete API Documentation**  
**Version:** 1.0.0  
**Last Updated:** November 16, 2025

---

## Base URLs

- **Production**: `https://api.gvteway-atlvs.com`
- **Staging**: `https://staging-api.gvteway-atlvs.com`
- **Development**: `http://localhost:3000`

---

## Authentication

All API requests require authentication using JWT tokens.

### Headers

```http
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

### Getting a Token

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

---

## Rate Limiting

- **Authenticated**: 1000 requests/hour
- **Unauthenticated**: 100 requests/hour

**Rate Limit Headers:**
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642348800
```

---

## Pagination

All list endpoints support pagination:

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20, max: 100)

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## Error Handling

**Error Response Format:**
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "Additional information"
  }
}
```

**Status Codes:**
- `200` - Success
- `201` - Created
- `204` - No Content
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `429` - Rate Limit Exceeded
- `500` - Internal Server Error

---

## OpenAPI Specifications

Detailed API specifications available in OpenAPI format:

- [GVTEWAY API Spec](./openapi-gvteway.yaml)
- [COMPVSS API Spec](./openapi-compvss.yaml)
- [ATLVS API Spec](./openapi-atlvs.yaml)

---

## Interactive Documentation

Access interactive API documentation:

- **Swagger UI**: `https://api.gvteway-atlvs.com/docs`
- **ReDoc**: `https://api.gvteway-atlvs.com/redoc`

---

## Quick Reference

### GVTEWAY Endpoints

**Events**
- `GET /api/gvteway/events` - List events
- `POST /api/gvteway/events` - Create event
- `GET /api/gvteway/events/{id}` - Get event
- `PUT /api/gvteway/events/{id}` - Update event
- `DELETE /api/gvteway/events/{id}` - Delete event

**Tickets**
- `GET /api/gvteway/tickets` - List user tickets
- `POST /api/gvteway/tickets/purchase` - Purchase tickets

**Orders**
- `GET /api/gvteway/orders` - List orders
- `GET /api/gvteway/orders/{id}` - Get order

### COMPVSS Endpoints

**Advancing**
- `GET /api/compvss/advancing` - List requests
- `POST /api/compvss/advancing` - Create request
- `GET /api/compvss/advancing/{id}` - Get request
- `POST /api/compvss/advancing/{id}/approve` - Approve
- `POST /api/compvss/advancing/{id}/reject` - Reject

**QR Codes**
- `POST /api/compvss/qr/generate` - Generate QR code
- `POST /api/compvss/qr/scan` - Scan QR code

**Teams**
- `GET /api/compvss/teams` - List teams
- `POST /api/compvss/teams` - Create team

### ATLVS Endpoints

**Projects**
- `GET /api/atlvs/projects` - List projects
- `POST /api/atlvs/projects` - Create project
- `GET /api/atlvs/projects/{id}` - Get project
- `PUT /api/atlvs/projects/{id}` - Update project

**Tasks**
- `GET /api/atlvs/tasks` - List tasks
- `POST /api/atlvs/tasks` - Create task
- `GET /api/atlvs/tasks/{id}` - Get task
- `PUT /api/atlvs/tasks/{id}` - Update task

**Equipment**
- `GET /api/atlvs/equipment` - List equipment
- `POST /api/atlvs/equipment/{id}/book` - Book equipment

---

## Webhooks

Configure webhooks to receive real-time notifications.

**Supported Events:**
- `event.created`
- `ticket.purchased`
- `advancing.submitted`
- `advancing.approved`
- `project.created`
- `task.completed`

**Webhook Payload:**
```json
{
  "event": "ticket.purchased",
  "timestamp": "2025-01-15T10:00:00Z",
  "data": {
    "ticketId": "tkt_123",
    "eventId": "evt_123",
    "userId": "user_123"
  }
}
```

---

## SDKs & Libraries

**JavaScript/TypeScript**
```bash
npm install @gvteway/sdk
```

```typescript
import { GVTEWAYClient } from '@gvteway/sdk';

const client = new GVTEWAYClient({
  apiKey: 'your-api-key',
});

const events = await client.events.list();
```

**Python**
```bash
pip install gvteway-sdk
```

```python
from gvteway import GVTEWAYClient

client = GVTEWAYClient(api_key='your-api-key')
events = client.events.list()
```

---

## Support

- **Documentation**: https://docs.gvteway-atlvs.com
- **API Status**: https://status.gvteway-atlvs.com
- **Support Email**: api-support@gvteway-atlvs.com
- **Discord**: https://discord.gg/gvteway
