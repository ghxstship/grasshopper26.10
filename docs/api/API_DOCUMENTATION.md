# API Documentation

**Version:** 1.0.0  
**Last Updated:** November 15, 2025  
**Base URL:** `https://api.gvteway-atlvs.com` (Production)  
**Base URL:** `http://localhost:3000` (Development)

---

## Table of Contents

1. [Authentication](#authentication)
2. [GVTEWAY APIs](#gvteway-apis)
3. [COMPVSS APIs](#compvss-apis)
4. [ATLVS APIs](#atlvs-apis)
5. [Common APIs](#common-apis)
6. [Error Handling](#error-handling)
7. [Rate Limiting](#rate-limiting)

---

## Authentication

All API requests require authentication using JWT tokens.

### Headers

```http
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

### Authentication Endpoints

#### POST `/api/auth/login`

Login with email and password.

**Request:**
```json
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
    "name": "John Doe",
    "role": "USER"
  }
}
```

#### POST `/api/auth/register`

Register a new user account.

**Request:**
```json
{
  "email": "newuser@example.com",
  "password": "securePassword123",
  "name": "Jane Doe"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_124",
    "email": "newuser@example.com",
    "name": "Jane Doe",
    "role": "USER"
  }
}
```

---

## GVTEWAY APIs

### Events

#### GET `/api/events`

List all events with optional filters.

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 20, max: 100)
- `category` (string, optional): Filter by category
- `status` (string, optional): Filter by status (upcoming, ongoing, past)
- `search` (string, optional): Search by name or description

**Response:**
```json
{
  "events": [
    {
      "id": "evt_123",
      "name": "Summer Music Festival",
      "description": "Annual outdoor music festival",
      "startDate": "2025-07-15T18:00:00Z",
      "endDate": "2025-07-17T23:00:00Z",
      "venue": "Central Park",
      "category": "MUSIC",
      "status": "UPCOMING",
      "imageUrl": "https://cdn.example.com/events/123.jpg",
      "ticketsAvailable": 5000
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

#### POST `/api/events`

Create a new event (requires ORGANIZER role).

**Request:**
```json
{
  "name": "Summer Music Festival",
  "description": "Annual outdoor music festival",
  "startDate": "2025-07-15T18:00:00Z",
  "endDate": "2025-07-17T23:00:00Z",
  "venue": "Central Park",
  "category": "MUSIC",
  "ticketsAvailable": 5000,
  "imageUrl": "https://cdn.example.com/events/123.jpg"
}
```

**Response:**
```json
{
  "id": "evt_123",
  "name": "Summer Music Festival",
  "createdAt": "2025-01-15T10:00:00Z"
}
```

#### GET `/api/events/[id]`

Get a single event by ID.

**Response:**
```json
{
  "id": "evt_123",
  "name": "Summer Music Festival",
  "description": "Annual outdoor music festival",
  "startDate": "2025-07-15T18:00:00Z",
  "endDate": "2025-07-17T23:00:00Z",
  "venue": "Central Park",
  "category": "MUSIC",
  "status": "UPCOMING",
  "imageUrl": "https://cdn.example.com/events/123.jpg",
  "ticketsAvailable": 5000,
  "organizer": {
    "id": "user_123",
    "name": "Event Organizers Inc"
  }
}
```

### Tickets

#### GET `/api/tickets`

List user's tickets.

**Response:**
```json
{
  "tickets": [
    {
      "id": "tkt_123",
      "type": "VIP",
      "status": "ACTIVE",
      "qrCode": "https://cdn.example.com/qr/tkt_123.png",
      "event": {
        "id": "evt_123",
        "name": "Summer Music Festival",
        "startDate": "2025-07-15T18:00:00Z"
      }
    }
  ]
}
```

#### POST `/api/tickets/purchase`

Purchase tickets for an event.

**Request:**
```json
{
  "eventId": "evt_123",
  "ticketType": "VIP",
  "quantity": 2,
  "paymentMethodId": "pm_123"
}
```

**Response:**
```json
{
  "orderId": "ord_123",
  "tickets": [
    {
      "id": "tkt_123",
      "type": "VIP",
      "qrCode": "https://cdn.example.com/qr/tkt_123.png"
    },
    {
      "id": "tkt_124",
      "type": "VIP",
      "qrCode": "https://cdn.example.com/qr/tkt_124.png"
    }
  ],
  "total": 299.98
}
```

### Adventures

#### GET `/api/adventures`

List available adventures.

**Query Parameters:**
- `category` (string, optional): Filter by category
- `difficulty` (string, optional): Filter by difficulty level

**Response:**
```json
{
  "adventures": [
    {
      "id": "adv_123",
      "name": "Mountain Hiking Tour",
      "description": "Guided hiking experience",
      "category": "OUTDOOR",
      "difficulty": "MODERATE",
      "duration": 240,
      "price": 89.99,
      "imageUrl": "https://cdn.example.com/adventures/123.jpg"
    }
  ]
}
```

#### POST `/api/adventures/[id]/book`

Book an adventure.

**Request:**
```json
{
  "date": "2025-08-01T09:00:00Z",
  "participants": 2
}
```

**Response:**
```json
{
  "bookingId": "bkg_123",
  "status": "CONFIRMED",
  "totalPrice": 179.98
}
```

### Memberships

#### POST `/api/memberships/subscribe`

Subscribe to a membership tier.

**Request:**
```json
{
  "tier": "PREMIUM",
  "paymentMethodId": "pm_123"
}
```

**Response:**
```json
{
  "subscriptionId": "sub_123",
  "tier": "PREMIUM",
  "status": "ACTIVE",
  "nextBillingDate": "2025-02-15T00:00:00Z"
}
```

---

## COMPVSS APIs

### Advancing Requests

#### GET `/api/compvss/advancing`

List advancing requests.

**Query Parameters:**
- `status` (string, optional): Filter by status
- `category` (string, optional): Filter by category
- `page` (number, optional): Page number

**Response:**
```json
{
  "requests": [
    {
      "id": "adv_123",
      "category": "TECHNICAL",
      "status": "PENDING",
      "submittedBy": {
        "id": "user_123",
        "name": "John Doe"
      },
      "submittedAt": "2025-01-10T14:30:00Z",
      "details": {
        "description": "Need audio equipment for main stage"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45
  }
}
```

#### POST `/api/compvss/advancing`

Submit a new advancing request.

**Request:**
```json
{
  "category": "TECHNICAL",
  "description": "Need audio equipment for main stage",
  "priority": "HIGH",
  "eventId": "evt_123",
  "details": {
    "equipmentNeeded": ["Microphones", "Speakers", "Mixer"],
    "setupDate": "2025-07-14T08:00:00Z"
  }
}
```

**Response:**
```json
{
  "id": "adv_123",
  "status": "PENDING",
  "submittedAt": "2025-01-10T14:30:00Z"
}
```

#### GET `/api/compvss/advancing/[id]`

Get a single advancing request.

**Response:**
```json
{
  "id": "adv_123",
  "category": "TECHNICAL",
  "status": "PENDING",
  "submittedBy": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "submittedAt": "2025-01-10T14:30:00Z",
  "approvers": [
    {
      "id": "user_456",
      "name": "Jane Smith",
      "status": "PENDING"
    }
  ],
  "details": {
    "description": "Need audio equipment for main stage",
    "equipmentNeeded": ["Microphones", "Speakers", "Mixer"]
  }
}
```

#### POST `/api/compvss/advancing/[id]/approve`

Approve an advancing request (requires APPROVER role).

**Request:**
```json
{
  "comment": "Approved. Equipment will be ready by setup date."
}
```

**Response:**
```json
{
  "id": "adv_123",
  "status": "APPROVED",
  "approvedAt": "2025-01-11T09:00:00Z"
}
```

### QR Codes

#### POST `/api/compvss/qr/generate`

Generate a QR code.

**Request:**
```json
{
  "type": "ACCESS",
  "name": "Backstage Pass - John Doe",
  "description": "VIP backstage access",
  "validFrom": "2025-07-15T00:00:00Z",
  "validUntil": "2025-07-17T23:59:59Z",
  "maxScans": 10,
  "zone": "BACKSTAGE"
}
```

**Response:**
```json
{
  "id": "qr_123",
  "qrCodeUrl": "https://cdn.example.com/qr/qr_123.png",
  "code": "QR-ABC123XYZ",
  "type": "ACCESS",
  "status": "ACTIVE"
}
```

#### POST `/api/compvss/qr/scan`

Scan and validate a QR code.

**Request:**
```json
{
  "code": "QR-ABC123XYZ"
}
```

**Response:**
```json
{
  "valid": true,
  "qrCode": {
    "id": "qr_123",
    "type": "ACCESS",
    "name": "Backstage Pass - John Doe",
    "zone": "BACKSTAGE",
    "scansRemaining": 9
  }
}
```

### Teams

#### GET `/api/compvss/teams`

List teams.

**Response:**
```json
{
  "teams": [
    {
      "id": "team_123",
      "name": "Production Team",
      "type": "PRODUCTION",
      "memberCount": 15
    }
  ]
}
```

---

## ATLVS APIs

### Projects

#### GET `/api/atlvs/projects`

List projects.

**Query Parameters:**
- `status` (string, optional): Filter by status
- `page` (number, optional): Page number

**Response:**
```json
{
  "projects": [
    {
      "id": "prj_123",
      "name": "Festival Setup 2025",
      "status": "IN_PROGRESS",
      "startDate": "2025-06-01T00:00:00Z",
      "endDate": "2025-07-20T00:00:00Z",
      "progress": 45,
      "teamSize": 12
    }
  ]
}
```

#### POST `/api/atlvs/projects`

Create a new project.

**Request:**
```json
{
  "name": "Festival Setup 2025",
  "description": "Complete festival setup and logistics",
  "startDate": "2025-06-01T00:00:00Z",
  "endDate": "2025-07-20T00:00:00Z",
  "budget": 150000
}
```

**Response:**
```json
{
  "id": "prj_123",
  "name": "Festival Setup 2025",
  "status": "PLANNING",
  "createdAt": "2025-01-15T10:00:00Z"
}
```

### Tasks

#### GET `/api/atlvs/tasks`

List tasks.

**Query Parameters:**
- `projectId` (string, optional): Filter by project
- `assigneeId` (string, optional): Filter by assignee
- `status` (string, optional): Filter by status

**Response:**
```json
{
  "tasks": [
    {
      "id": "tsk_123",
      "title": "Setup main stage",
      "status": "IN_PROGRESS",
      "priority": "HIGH",
      "assignee": {
        "id": "user_123",
        "name": "John Doe"
      },
      "dueDate": "2025-07-10T00:00:00Z"
    }
  ]
}
```

#### POST `/api/atlvs/tasks`

Create a new task.

**Request:**
```json
{
  "projectId": "prj_123",
  "title": "Setup main stage",
  "description": "Assemble and test main stage equipment",
  "priority": "HIGH",
  "assigneeId": "user_123",
  "dueDate": "2025-07-10T00:00:00Z"
}
```

**Response:**
```json
{
  "id": "tsk_123",
  "title": "Setup main stage",
  "status": "TODO",
  "createdAt": "2025-01-15T10:00:00Z"
}
```

### Equipment

#### GET `/api/atlvs/equipment`

List equipment inventory.

**Query Parameters:**
- `status` (string, optional): Filter by availability status
- `type` (string, optional): Filter by equipment type

**Response:**
```json
{
  "equipment": [
    {
      "id": "eq_123",
      "name": "Professional Sound System",
      "type": "AUDIO",
      "status": "AVAILABLE",
      "location": "Warehouse A"
    }
  ]
}
```

#### POST `/api/atlvs/equipment/[id]/book`

Book equipment.

**Request:**
```json
{
  "startDate": "2025-07-15T08:00:00Z",
  "endDate": "2025-07-17T20:00:00Z",
  "projectId": "prj_123"
}
```

**Response:**
```json
{
  "bookingId": "bk_123",
  "status": "CONFIRMED",
  "equipment": {
    "id": "eq_123",
    "name": "Professional Sound System"
  }
}
```

---

## Common APIs

### File Upload

#### POST `/api/upload`

Upload a file.

**Request:**
- Content-Type: `multipart/form-data`
- Body: File in `file` field

**Response:**
```json
{
  "url": "https://cdn.example.com/uploads/file_123.jpg",
  "fileId": "file_123",
  "size": 2048576,
  "mimeType": "image/jpeg"
}
```

### Search

#### GET `/api/search`

Global search across all entities.

**Query Parameters:**
- `q` (string, required): Search query
- `type` (string, optional): Filter by entity type (events, projects, tasks)

**Response:**
```json
{
  "results": [
    {
      "type": "EVENT",
      "id": "evt_123",
      "title": "Summer Music Festival",
      "description": "Annual outdoor music festival",
      "url": "/gvteway/events/evt_123"
    }
  ],
  "total": 15
}
```

---

## Error Handling

All errors follow this format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "Additional error details"
  }
}
```

### Common Error Codes

| Status Code | Error Code | Description |
|-------------|------------|-------------|
| 400 | `VALIDATION_ERROR` | Invalid request data |
| 401 | `UNAUTHORIZED` | Missing or invalid authentication |
| 403 | `FORBIDDEN` | Insufficient permissions |
| 404 | `NOT_FOUND` | Resource not found |
| 409 | `CONFLICT` | Resource conflict (e.g., duplicate) |
| 429 | `RATE_LIMIT_EXCEEDED` | Too many requests |
| 500 | `INTERNAL_ERROR` | Server error |

---

## Rate Limiting

API requests are rate-limited to prevent abuse:

- **Authenticated users**: 1000 requests per hour
- **Unauthenticated users**: 100 requests per hour

Rate limit headers are included in all responses:

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642348800
```

When rate limit is exceeded:

```json
{
  "error": "Rate limit exceeded",
  "code": "RATE_LIMIT_EXCEEDED",
  "retryAfter": 3600
}
```

---

## Pagination

All list endpoints support pagination:

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20, max: 100)

**Response includes:**
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

## Webhooks

Configure webhooks to receive real-time notifications for events.

### Supported Events

- `event.created`
- `ticket.purchased`
- `advancing.submitted`
- `advancing.approved`
- `project.created`
- `task.completed`

### Webhook Payload

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

**For more information or support, contact:** api-support@gvteway-atlvs.com
