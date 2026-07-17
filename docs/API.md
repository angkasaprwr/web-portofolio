# API Documentation

Interactive Swagger UI: `GET /api/docs`  
OpenAPI JSON: `GET /api/docs.json`

## Base URL

```
http://localhost:5000/api/v1
```

## Auth

### Login

```http
POST /auth/login
Content-Type: application/json

{ "email": "admin@sukma.dev", "password": "Admin@123456" }
```

Response includes `accessToken`. Refresh token is set as HttpOnly cookie `refreshToken`.

Use header for protected routes:

```
Authorization: Bearer <accessToken>
```

### Refresh

```http
POST /auth/refresh
```

### Logout

```http
POST /auth/logout
```

## Public endpoints

| Method | Path | Query |
|--------|------|-------|
| GET | `/about` | |
| GET | `/skills` | `category`, `search`, `featured`, `page`, `limit`, `all` |
| GET | `/projects` | `category`, `search`, `featured`, `sort`, `page`, `limit`, `all` |
| GET | `/projects/categories` | |
| GET | `/projects/slug/:slug` | |
| GET | `/experiences` | `type`, `category`, `search`, `sort`, `page`, `limit`, `all` |
| GET | `/experiences/categories` | |
| GET | `/certificates` | |
| GET | `/social-links` | |
| GET | `/cv` | |
| GET | `/settings` | |

## Admin endpoints (JWT)

CRUD for `/about`, `/skills`, `/projects`, `/experiences`, `/certificates`, `/social-links`, `/cv`, `/settings/:key`, plus `/dashboard` and `/upload/:folder`.

## Standard response

```json
{
  "success": true,
  "message": "Success",
  "data": {},
  "meta": { "page": 1, "limit": 10, "total": 8, "totalPages": 1 }
}
```

## Errors

```json
{
  "success": false,
  "message": "Validasi gagal",
  "errors": [{ "field": "email", "message": "Email tidak valid" }]
}
```
