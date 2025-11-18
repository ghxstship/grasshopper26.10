# API DOCUMENTATION

> **Three-Platform Ecosystem API Reference**  
> **GVTEWAY + COMPVSS + ATLVS**

---

## 📋 TABLE OF CONTENTS

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Response Format](#response-format)
4. [Error Handling](#error-handling)
5. [Rate Limiting](#rate-limiting)
6. [Pagination](#pagination)
7. [API Endpoints](#api-endpoints)

---

## 🎯 OVERVIEW

The three-platform ecosystem provides a comprehensive REST API for managing events, production workflows, and internal operations.

**Base URL:** `https://api.gvteway.com`  
**API Version:** v1  
**Authentication:** Bearer Token (JWT)

---

## 🔐 AUTHENTICATION

All protected endpoints require authentication via Bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Auth Endpoints

#### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe",
  "role": "CONSUMER" // optional: CONSUMER, EXTERNAL_TEAM, INTERNAL_TEAM
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clx...",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "CONSUMER",
      "createdAt": "2024-01-15T10:30:00Z"
    },
    "message": "Registration successful. Please check your email for verification."
  }
}
```

---

## 📦 RESPONSE FORMAT

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { ... }
  }
}
```

---

## ⚠️ ERROR HANDLING

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 429 | Rate Limit Exceeded |
| 500 | Internal Server Error |

### Error Codes

- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Access denied
- `NOT_FOUND` - Resource not found
- `BAD_REQUEST` - Invalid request data
- `VALIDATION_ERROR` - Request validation failed
- `CONFLICT` - Resource conflict
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `INTERNAL_ERROR` - Server error

---

## 🚦 RATE LIMITING

API requests are rate-limited per IP address:

- **Default:** 100 requests per minute
- **Auth endpoints:** 5 requests per hour
- **Heavy operations:** 10 requests per minute

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

---

## 📄 PAGINATION

List endpoints support pagination via query parameters:

```http
GET /api/events?page=1&limit=20
```

**Parameters:**
- `page` - Page number (default: 1, min: 1)
- `limit` - Items per page (default: 20, min: 1, max: 100)

**Response includes meta:**
```json
{
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

---

## 🔌 API ENDPOINTS

### AUTHENTICATION APIs (8 endpoints)

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | ✅ |
| POST | `/api/auth/login` | User login | ✅ |
| GET | `/api/auth/me` | Get current user | ✅ |
| POST | `/api/auth/logout` | User logout | 🚧 |
| POST | `/api/auth/refresh` | Refresh token | 🚧 |
| POST | `/api/auth/forgot-password` | Request password reset | 🚧 |
| POST | `/api/auth/reset-password` | Reset password | 🚧 |
| POST | `/api/auth/verify-email` | Verify email | 🚧 |

---

### GVTEWAY APIs (45 endpoints)

#### Events (10 endpoints)

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/api/events` | List events with filters | ✅ |
| POST | `/api/events` | Create event | ✅ |
| GET | `/api/events/[id]` | Get event details | ✅ |
| PATCH | `/api/events/[id]` | Update event | ✅ |
| DELETE | `/api/events/[id]` | Delete event | ✅ |
| GET | `/api/events/[id]/tickets` | Get event tickets | 🚧 |
| POST | `/api/events/[id]/tickets` | Create ticket type | 🚧 |
| GET | `/api/events/[id]/artists` | Get event artists | 🚧 |
| POST | `/api/events/[id]/artists` | Add artist to event | 🚧 |
| GET | `/api/events/featured` | Get featured events | 🚧 |

**List Events - Query Parameters:**
```
?organizationId=<id>
&categoryId=<id>
&venueId=<id>
&status=PUBLISHED
&visibility=PUBLIC
&featured=true
&startDateFrom=2024-01-01
&startDateTo=2024-12-31
&search=concert
&page=1
&limit=20
&sortBy=startDate
&sortOrder=asc
```

#### Orders & Tickets (8 endpoints)

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/api/orders` | List user orders | ✅ |
| POST | `/api/orders` | Create order | ✅ |
| GET | `/api/orders/[id]` | Get order details | 🚧 |
| PATCH | `/api/orders/[id]` | Update order status | 🚧 |
| GET | `/api/tickets` | List user tickets | 🚧 |
| GET | `/api/tickets/[id]` | Get ticket details | 🚧 |
| POST | `/api/tickets/[id]/transfer` | Transfer ticket | 🚧 |
| POST | `/api/tickets/validate` | Validate ticket (QR) | 🚧 |

#### Venues (5 endpoints)

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/api/venues` | List venues | ✅ |
| POST | `/api/venues` | Create venue | ✅ |
| GET | `/api/venues/[id]` | Get venue details | ✅ |
| PATCH | `/api/venues/[id]` | Update venue | ✅ |
| DELETE | `/api/venues/[id]` | Delete venue | ✅ |

#### Artists (5 endpoints)

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/api/artists` | List artists | ✅ |
| POST | `/api/artists` | Create artist | ✅ |
| GET | `/api/artists/[id]` | Get artist details | ✅ |
| PATCH | `/api/artists/[id]` | Update artist | ✅ |
| DELETE | `/api/artists/[id]` | Delete artist | ✅ |

#### Marketplace (6 endpoints)

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/api/products` | List products | 🚧 |
| POST | `/api/products` | Create product | 🚧 |
| GET | `/api/products/[id]` | Get product details | 🚧 |
| GET | `/api/cart` | Get user cart | 🚧 |
| POST | `/api/cart/items` | Add to cart | 🚧 |
| DELETE | `/api/cart/items/[id]` | Remove from cart | 🚧 |

#### Social Hub (6 endpoints)

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/api/social/posts` | List posts | 🚧 |
| POST | `/api/social/posts` | Create post | 🚧 |
| POST | `/api/social/posts/[id]/like` | Like post | 🚧 |
| POST | `/api/social/posts/[id]/comment` | Comment on post | 🚧 |
| POST | `/api/social/follow` | Follow user | 🚧 |
| DELETE | `/api/social/follow/[id]` | Unfollow user | 🚧 |

#### Memberships (5 endpoints)

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/api/memberships/tiers` | List tiers | 🚧 |
| POST | `/api/memberships` | Subscribe | 🚧 |
| GET | `/api/memberships/me` | Get my membership | 🚧 |
| PATCH | `/api/memberships/me` | Update membership | 🚧 |
| DELETE | `/api/memberships/me` | Cancel membership | 🚧 |

---

### COMPVSS APIs (40 endpoints)

#### Advancing Requests (10 endpoints)

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/api/compvss/advancing` | List requests | 🚧 |
| POST | `/api/compvss/advancing` | Create request | 🚧 |
| GET | `/api/compvss/advancing/[id]` | Get request | 🚧 |
| PATCH | `/api/compvss/advancing/[id]` | Update request | 🚧 |
| POST | `/api/compvss/advancing/[id]/approve` | Approve request | 🚧 |
| POST | `/api/compvss/advancing/[id]/reject` | Reject request | 🚧 |
| GET | `/api/compvss/advancing/categories` | List categories | 🚧 |
| GET | `/api/compvss/advancing/results` | List results | 🚧 |
| POST | `/api/compvss/advancing/[id]/result` | Submit result | 🚧 |
| GET | `/api/compvss/advancing/analytics` | Get analytics | 🚧 |

#### Day-of-Show (6 endpoints)

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/api/compvss/day-of-show/tasks` | List tasks | 🚧 |
| POST | `/api/compvss/day-of-show/tasks` | Create task | 🚧 |
| PATCH | `/api/compvss/day-of-show/tasks/[id]` | Update task | 🚧 |
| POST | `/api/compvss/day-of-show/check-in` | Check in | 🚧 |
| GET | `/api/compvss/day-of-show/schedule` | Get schedule | 🚧 |
| GET | `/api/compvss/day-of-show/dashboard` | Get dashboard | 🚧 |

#### QR Codes (5 endpoints)

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| POST | `/api/compvss/qr/generate` | Generate QR code | 🚧 |
| POST | `/api/compvss/qr/scan` | Scan QR code | 🚧 |
| GET | `/api/compvss/qr/[id]` | Get QR details | 🚧 |
| GET | `/api/compvss/qr/history` | Scan history | 🚧 |
| GET | `/api/compvss/qr/analytics` | QR analytics | 🚧 |

#### Issue Reports (5 endpoints)

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/api/compvss/issues` | List issues | 🚧 |
| POST | `/api/compvss/issues` | Create issue | 🚧 |
| GET | `/api/compvss/issues/[id]` | Get issue | 🚧 |
| PATCH | `/api/compvss/issues/[id]` | Update issue | 🚧 |
| POST | `/api/compvss/issues/[id]/resolve` | Resolve issue | 🚧 |

#### Expenses (6 endpoints)

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/api/compvss/expenses` | List expenses | 🚧 |
| POST | `/api/compvss/expenses` | Submit expense | 🚧 |
| GET | `/api/compvss/expenses/[id]` | Get expense | 🚧 |
| PATCH | `/api/compvss/expenses/[id]` | Update expense | 🚧 |
| POST | `/api/compvss/expenses/[id]/approve` | Approve expense | 🚧 |
| POST | `/api/compvss/expenses/[id]/reject` | Reject expense | 🚧 |

#### Affiliates (4 endpoints)

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/api/compvss/affiliates/me` | Get profile | 🚧 |
| GET | `/api/compvss/affiliates/links` | List links | 🚧 |
| POST | `/api/compvss/affiliates/links` | Create link | 🚧 |
| GET | `/api/compvss/affiliates/analytics` | Get analytics | 🚧 |

#### Referrals (4 endpoints)

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/api/compvss/referrals` | List referrals | 🚧 |
| POST | `/api/compvss/referrals` | Create referral | 🚧 |
| GET | `/api/compvss/referrals/analytics` | Get analytics | 🚧 |
| GET | `/api/compvss/referrals/leaderboard` | Get leaderboard | 🚧 |

---

### ATLVS APIs (50 endpoints)

#### Projects (9 endpoints)

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/api/atlvs/projects` | List projects | 🚧 |
| POST | `/api/atlvs/projects` | Create project | 🚧 |
| GET | `/api/atlvs/projects/[id]` | Get project | 🚧 |
| PATCH | `/api/atlvs/projects/[id]` | Update project | 🚧 |
| DELETE | `/api/atlvs/projects/[id]` | Delete project | 🚧 |
| GET | `/api/atlvs/projects/[id]/phases` | List phases | 🚧 |
| POST | `/api/atlvs/projects/[id]/phases` | Create phase | 🚧 |
| GET | `/api/atlvs/projects/[id]/milestones` | List milestones | 🚧 |
| POST | `/api/atlvs/projects/[id]/milestones` | Create milestone | 🚧 |

#### Tasks (7 endpoints)

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/api/atlvs/tasks` | List tasks | 🚧 |
| POST | `/api/atlvs/tasks` | Create task | 🚧 |
| GET | `/api/atlvs/tasks/[id]` | Get task | 🚧 |
| PATCH | `/api/atlvs/tasks/[id]` | Update task | 🚧 |
| DELETE | `/api/atlvs/tasks/[id]` | Delete task | 🚧 |
| POST | `/api/atlvs/tasks/[id]/assign` | Assign task | 🚧 |
| POST | `/api/atlvs/tasks/[id]/dependencies` | Add dependency | 🚧 |

#### Teams (6 endpoints)

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/api/atlvs/teams` | List teams | 🚧 |
| POST | `/api/atlvs/teams` | Create team | 🚧 |
| GET | `/api/atlvs/teams/[id]` | Get team | 🚧 |
| POST | `/api/atlvs/teams/[id]/members` | Add member | 🚧 |
| DELETE | `/api/atlvs/teams/[id]/members/[userId]` | Remove member | 🚧 |
| GET | `/api/atlvs/teams/[id]/schedule` | Get schedule | 🚧 |

#### Budgets (7 endpoints)

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/api/atlvs/budgets` | List budgets | 🚧 |
| POST | `/api/atlvs/budgets` | Create budget | 🚧 |
| GET | `/api/atlvs/budgets/[id]` | Get budget | 🚧 |
| PATCH | `/api/atlvs/budgets/[id]` | Update budget | 🚧 |
| GET | `/api/atlvs/budgets/[id]/categories` | List categories | 🚧 |
| POST | `/api/atlvs/budgets/[id]/expenses` | Add expense | 🚧 |
| GET | `/api/atlvs/budgets/analytics` | Get analytics | 🚧 |

#### Assets (7 endpoints)

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/api/atlvs/equipment` | List equipment | 🚧 |
| POST | `/api/atlvs/equipment` | Create equipment | 🚧 |
| GET | `/api/atlvs/equipment/[id]` | Get equipment | 🚧 |
| POST | `/api/atlvs/equipment/[id]/book` | Book equipment | 🚧 |
| POST | `/api/atlvs/equipment/[id]/maintenance` | Log maintenance | 🚧 |
| GET | `/api/atlvs/vehicles` | List vehicles | 🚧 |
| POST | `/api/atlvs/vehicles` | Create vehicle | 🚧 |

#### Documents (6 endpoints)

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/api/atlvs/documents` | List documents | 🚧 |
| POST | `/api/atlvs/documents` | Upload document | 🚧 |
| GET | `/api/atlvs/documents/[id]` | Get document | 🚧 |
| PATCH | `/api/atlvs/documents/[id]` | Update document | 🚧 |
| DELETE | `/api/atlvs/documents/[id]` | Delete document | 🚧 |
| GET | `/api/atlvs/documents/[id]/versions` | List versions | 🚧 |

#### N8N Workflows (8 endpoints)

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/api/atlvs/workflows` | List workflows | 🚧 |
| POST | `/api/atlvs/workflows` | Create workflow | 🚧 |
| GET | `/api/atlvs/workflows/[id]` | Get workflow | 🚧 |
| PATCH | `/api/atlvs/workflows/[id]` | Update workflow | 🚧 |
| POST | `/api/atlvs/workflows/[id]/execute` | Execute workflow | 🚧 |
| GET | `/api/atlvs/workflows/[id]/executions` | List executions | 🚧 |
| GET | `/api/atlvs/workflows/templates` | List templates | 🚧 |
| POST | `/api/atlvs/workflows/from-template` | Create from template | 🚧 |

---

### SHARED/UTILITY APIs (6 endpoints)

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/api/organizations` | List organizations | ✅ |
| POST | `/api/organizations` | Create organization | ✅ |
| GET | `/api/organizations/[id]` | Get organization | ✅ |
| PATCH | `/api/organizations/[id]` | Update organization | ✅ |
| DELETE | `/api/organizations/[id]` | Delete organization | ✅ |
| GET | `/api/notifications` | List notifications | 🚧 |
| PATCH | `/api/notifications/[id]/read` | Mark as read | 🚧 |
| POST | `/api/upload` | Upload file | 🚧 |

---

## 📊 API PROGRESS

**Total Endpoints:** 149  
**Implemented:** 18 (12%)  
**In Progress:** 131 (88%)

### By Platform
- **Auth:** 3/8 (38%)
- **GVTEWAY:** 15/45 (33%)
- **COMPVSS:** 0/40 (0%)
- **ATLVS:** 0/50 (0%)
- **Shared:** 5/6 (83%)

---

**Built with GHXSTSHIP precision ⚓️**
