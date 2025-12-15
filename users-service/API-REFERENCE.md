# API Reference - Users Service

## Base URL
```
http://localhost:3002/api
```

## Authentication
Todos los endpoints (excepto `/health`) requieren los siguientes headers:

```http
X-User-Id: <uuid>
X-User-Email: <email>
X-User-Role: <ADMIN|CLIENT_ADMIN|USER>
```

---

## Health Check

### Get Service Health
```http
GET /health
```

**Response 200:**
```json
{
  "success": true,
  "service": "users-service",
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## Users

### List All Users
```http
GET /users?page=1&limit=10&status=ACTIVE&role=USER&clientId=<uuid>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `status` (optional): ACTIVE | INACTIVE
- `role` (optional): ADMIN | CLIENT_ADMIN | USER
- `clientId` (optional): Filter by client UUID

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "fullName": "John Doe",
      "role": "USER",
      "status": "ACTIVE",
      "clientId": "660e8400-e29b-41d4-a716-446655440000",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z",
      "client": {
        "id": "660e8400-e29b-41d4-a716-446655440000",
        "name": "Acme Corp"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

### Get User by ID
```http
GET /users/:id
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "fullName": "John Doe",
    "role": "USER",
    "status": "ACTIVE",
    "clientId": "660e8400-e29b-41d4-a716-446655440000",
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  }
}
```

**Response 404:**
```json
{
  "success": false,
  "error": "User not found"
}
```

### Create User
```http
POST /users
```

**Required Role:** ADMIN or CLIENT_ADMIN

**Request Body:**
```json
{
  "email": "jane.smith@example.com",
  "firstName": "Jane",
  "lastName": "Smith",
  "role": "USER",
  "clientId": "660e8400-e29b-41d4-a716-446655440000"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440000",
    "email": "jane.smith@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "fullName": "Jane Smith",
    "role": "USER",
    "status": "ACTIVE",
    "clientId": "660e8400-e29b-41d4-a716-446655440000",
    "createdAt": "2024-01-15T11:00:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

**Response 400:**
```json
{
  "success": false,
  "error": "Validation error",
  "details": [
    {
      "message": "\"email\" must be a valid email",
      "path": ["email"]
    }
  ]
}
```

**Response 409:**
```json
{
  "success": false,
  "error": "User with this email already exists"
}
```

### Update User
```http
PUT /users/:id
```

**Required Role:** ADMIN or CLIENT_ADMIN

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane.doe@example.com"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440000",
    "email": "jane.doe@example.com",
    "firstName": "Jane",
    "lastName": "Doe",
    "fullName": "Jane Doe",
    "role": "USER",
    "status": "ACTIVE",
    "clientId": "660e8400-e29b-41d4-a716-446655440000",
    "createdAt": "2024-01-15T11:00:00.000Z",
    "updatedAt": "2024-01-15T12:00:00.000Z"
  }
}
```

### Deactivate User
```http
DELETE /users/:id
```

**Required Role:** ADMIN

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440000",
    "email": "jane.doe@example.com",
    "status": "INACTIVE"
  }
}
```

### Update User Role
```http
PATCH /users/:id/role
```

**Required Role:** ADMIN

**Request Body:**
```json
{
  "role": "CLIENT_ADMIN"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440000",
    "email": "jane.doe@example.com",
    "role": "CLIENT_ADMIN"
  }
}
```

---

## Clients

### List All Clients
```http
GET /clients?page=1&limit=10&status=ACTIVE
```

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `status` (optional): ACTIVE | INACTIVE

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440000",
      "name": "Acme Corporation",
      "description": "Global technology leader",
      "email": "info@acme.com",
      "phone": "+1234567890",
      "address": "123 Tech Street, Silicon Valley",
      "status": "ACTIVE",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "users": [],
      "projects": []
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  }
}
```

### Get Client by ID
```http
GET /clients/:id
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440000",
    "name": "Acme Corporation",
    "description": "Global technology leader",
    "email": "info@acme.com",
    "phone": "+1234567890",
    "address": "123 Tech Street, Silicon Valley",
    "status": "ACTIVE",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "users": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "email": "john.doe@acme.com",
        "fullName": "John Doe"
      }
    ],
    "projects": [
      {
        "id": "880e8400-e29b-41d4-a716-446655440000",
        "name": "Website Redesign"
      }
    ]
  }
}
```

### Create Client
```http
POST /clients
```

**Required Role:** ADMIN

**Request Body:**
```json
{
  "name": "New Tech Corp",
  "description": "Innovative software solutions",
  "email": "contact@newtech.com",
  "phone": "+1987654321",
  "address": "456 Innovation Drive"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "990e8400-e29b-41d4-a716-446655440000",
    "name": "New Tech Corp",
    "description": "Innovative software solutions",
    "email": "contact@newtech.com",
    "phone": "+1987654321",
    "address": "456 Innovation Drive",
    "status": "ACTIVE",
    "createdAt": "2024-01-15T13:00:00.000Z",
    "updatedAt": "2024-01-15T13:00:00.000Z"
  }
}
```

### Update Client
```http
PUT /clients/:id
```

**Required Role:** ADMIN or CLIENT_ADMIN

**Request Body:**
```json
{
  "name": "New Tech Corporation",
  "phone": "+1987654322"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "990e8400-e29b-41d4-a716-446655440000",
    "name": "New Tech Corporation",
    "phone": "+1987654322",
    "updatedAt": "2024-01-15T14:00:00.000Z"
  }
}
```

### Deactivate Client
```http
DELETE /clients/:id
```

**Required Role:** ADMIN

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "990e8400-e29b-41d4-a716-446655440000",
    "status": "INACTIVE"
  }
}
```

---

## Projects

### Get Projects by Client
```http
GET /clients/:clientId/projects
```

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "880e8400-e29b-41d4-a716-446655440000",
      "name": "Website Redesign",
      "description": "Complete overhaul of company website",
      "status": "ACTIVE",
      "clientId": "660e8400-e29b-41d4-a716-446655440000",
      "startDate": "2024-01-01",
      "endDate": null,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "client": {
        "id": "660e8400-e29b-41d4-a716-446655440000",
        "name": "Acme Corporation"
      }
    }
  ]
}
```

### Get Project by ID
```http
GET /projects/:id
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "880e8400-e29b-41d4-a716-446655440000",
    "name": "Website Redesign",
    "description": "Complete overhaul of company website",
    "status": "ACTIVE",
    "clientId": "660e8400-e29b-41d4-a716-446655440000",
    "startDate": "2024-01-01",
    "endDate": "2024-06-30",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Create Project
```http
POST /projects
```

**Required Role:** ADMIN or CLIENT_ADMIN

**Request Body:**
```json
{
  "name": "Mobile App Development",
  "description": "iOS and Android native apps",
  "clientId": "660e8400-e29b-41d4-a716-446655440000",
  "startDate": "2024-02-01",
  "endDate": "2024-12-31"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "aa0e8400-e29b-41d4-a716-446655440000",
    "name": "Mobile App Development",
    "description": "iOS and Android native apps",
    "status": "ACTIVE",
    "clientId": "660e8400-e29b-41d4-a716-446655440000",
    "startDate": "2024-02-01",
    "endDate": "2024-12-31",
    "createdAt": "2024-01-15T15:00:00.000Z",
    "updatedAt": "2024-01-15T15:00:00.000Z"
  }
}
```

### Update Project
```http
PUT /projects/:id
```

**Required Role:** ADMIN or CLIENT_ADMIN

**Request Body:**
```json
{
  "name": "Mobile App Development - Phase 2",
  "endDate": "2025-03-31",
  "status": "ACTIVE"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "aa0e8400-e29b-41d4-a716-446655440000",
    "name": "Mobile App Development - Phase 2",
    "endDate": "2025-03-31",
    "updatedAt": "2024-01-15T16:00:00.000Z"
  }
}
```

### Archive Project
```http
DELETE /projects/:id
```

**Required Role:** ADMIN or CLIENT_ADMIN

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "aa0e8400-e29b-41d4-a716-446655440000",
    "status": "ARCHIVED"
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Validation error",
  "details": [
    {
      "message": "\"email\" must be a valid email",
      "path": ["email"]
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Unauthorized - Missing authentication headers"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": "Forbidden - Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "User not found"
}
```

### 409 Conflict
```json
{
  "success": false,
  "error": "User with this email already exists"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal server error"
}
```

---

## Rate Limiting

The API is rate limited to **100 requests per 15 minutes** per IP address.

When rate limit is exceeded:
```json
{
  "message": "Too many requests from this IP"
}
```

---

## Pagination

All list endpoints support pagination with these query parameters:

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

Response includes pagination metadata:
```json
{
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```