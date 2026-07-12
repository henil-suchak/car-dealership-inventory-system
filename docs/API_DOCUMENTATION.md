# Car Dealership Inventory System — API Reference

> **Version:** 1.0  
> **Base URL:** `http://localhost:8080`  
> **Content-Type:** `application/json`

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication Guide](#authentication-guide)
3. [Role-Based Access Matrix](#role-based-access-matrix)
4. [Endpoint Reference](#endpoint-reference)
   - [Auth Endpoints](#auth-endpoints)
   - [Vehicle Endpoints](#vehicle-endpoints)
   - [Inventory Endpoints](#inventory-endpoints)
5. [Error Response Reference](#error-response-reference)
6. [Pagination](#pagination)

---

## Overview

The Car Dealership Inventory System is a RESTful API built with Spring Boot for managing vehicle inventory, user authentication, and purchase/restock operations. It provides:

- **JWT-based authentication** with refresh token rotation
- **Role-based access control** (USER and ADMIN roles)
- **Full CRUD** for vehicle inventory management
- **Dynamic search** with JPA Specifications (including **minPrice** and **maxPrice** range filtering)
- **Optimistic locking** for safe concurrent updates
- **Paginated** vehicle listings
- **Digital acquisition flow** — contract signing, escrow simulation, and client dossier tracking

All requests and responses use **JSON** (`application/json`). Authenticated endpoints require a Bearer token in the `Authorization` header.

---

## Authentication Guide

### 1. Register a New Account

Create a new user account by sending a `POST` request to `/api/auth/register`. New accounts are assigned the **USER** role by default.

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

The response includes a JWT access token and a refresh token.

### 2. Log In

Obtain tokens for an existing account:

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

### 3. Use the Bearer Token

Include the JWT in the `Authorization` header for all authenticated requests:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Refresh an Expired Token

JWT access tokens expire after **15 minutes**. When a token expires, use the refresh token to obtain a new token pair without re-authenticating:

```bash
curl -X POST http://localhost:8080/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "d4f5a6b7-8c9d-0e1f-2a3b-4c5d6e7f8a9b"
  }'
```

> [!IMPORTANT]
> Refresh tokens are **rotated** on each use — the old token is deleted and a new one is issued. Always store the latest refresh token from the response.

Refresh tokens expire after **7 days**.

### 5. Log Out

Invalidate all refresh tokens for the authenticated user:

```bash
curl -X POST http://localhost:8080/api/auth/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

---

## Role-Based Access Matrix

| Endpoint                            | Method   | Public | USER | ADMIN |
|-------------------------------------|----------|:------:|:----:|:-----:|
| `/api/auth/register`                | `POST`   | ✅     | ✅   | ✅    |
| `/api/auth/login`                   | `POST`   | ✅     | ✅   | ✅    |
| `/api/auth/refresh`                 | `POST`   | ✅     | ✅   | ✅    |
| `/api/auth/logout`                  | `POST`   | ❌     | ✅   | ✅    |
| `/api/vehicles`                     | `GET`    | ✅     | ✅   | ✅    |
| `/api/vehicles/{id}`                | `GET`    | ✅     | ✅   | ✅    |
| `/api/vehicles/search`             | `GET`    | ✅     | ✅   | ✅    |
| `/api/vehicles`                     | `POST`   | ❌     | ❌   | ✅    |
| `/api/vehicles/{id}`                | `PUT`    | ❌     | ❌   | ✅    |
| `/api/vehicles/{id}`                | `DELETE` | ❌     | ❌   | ✅    |
| `/api/vehicles/{id}/purchase`       | `POST`   | ❌     | ✅   | ✅    |
| `/api/vehicles/{id}/restock`        | `POST`   | ❌     | ❌   | ✅    |

---

## Endpoint Reference

### Auth Endpoints

Base path: `/api/auth`

---

#### POST `/api/auth/register`

Register a new user account with the **USER** role.

**Auth:** None (Public)

**Request Body:**

```json
{
  "username": "jane_smith",
  "email": "jane.smith@example.com",
  "password": "MyP@ssw0rd!"
}
```

| Field      | Type   | Constraints                  |
|------------|--------|------------------------------|
| `username` | string | Required, not blank          |
| `email`    | string | Required, valid email format |
| `password` | string | Required, not blank          |

**Response Body** (`201 Created`):

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqYW5lLnNtaXRoQGV4YW1wbGUuY29tIiwiaWF0IjoxNzIwNzg1NjAwLCJleHAiOjE3MjA3ODY1MDB9.abc123",
  "refreshToken": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

**Status Codes:**

| Status | Description                                  |
|--------|----------------------------------------------|
| `201`  | Account created successfully                 |
| `400`  | Validation error (missing/invalid fields)    |
| `409`  | Email or username already exists             |

---

#### POST `/api/auth/login`

Authenticate an existing user and obtain tokens.

**Auth:** None (Public)

**Request Body:**

```json
{
  "email": "jane.smith@example.com",
  "password": "MyP@ssw0rd!"
}
```

| Field      | Type   | Constraints       |
|------------|--------|-------------------|
| `email`    | string | Required          |
| `password` | string | Required          |

**Response Body** (`200 OK`):

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqYW5lLnNtaXRoQGV4YW1wbGUuY29tIiwiaWF0IjoxNzIwNzg1NjAwLCJleHAiOjE3MjA3ODY1MDB9.xyz789",
  "refreshToken": "f9e8d7c6-b5a4-3210-fedc-ba9876543210"
}
```

**Status Codes:**

| Status | Description                                |
|--------|--------------------------------------------|
| `200`  | Authentication successful                  |
| `401`  | Invalid email or password                  |

---

#### POST `/api/auth/refresh`

Exchange a valid refresh token for a new token pair.

**Auth:** None (Public)

**Request Body:**

```json
{
  "refreshToken": "f9e8d7c6-b5a4-3210-fedc-ba9876543210"
}
```

| Field          | Type   | Constraints |
|----------------|--------|-------------|
| `refreshToken` | string | Required    |

**Response Body** (`200 OK`):

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqYW5lLnNtaXRoQGV4YW1wbGUuY29tIiwiaWF0IjoxNzIwNzg2NTAwLCJleHAiOjE3MjA3ODc0MDB9.def456",
  "refreshToken": "11223344-5566-7788-99aa-bbccddeeff00"
}
```

**Status Codes:**

| Status | Description                                   |
|--------|-----------------------------------------------|
| `200`  | Tokens refreshed successfully                 |
| `401`  | Refresh token is invalid, expired, or revoked |

> [!NOTE]
> Refresh tokens are **rotated** on every use. The provided refresh token is deleted from the database and a brand-new refresh token is issued in the response. Always persist the latest refresh token.

---

#### POST `/api/auth/logout`

Log out the current user by deleting **all** their refresh tokens.

**Auth:** Bearer Token (any authenticated user)

**Request Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Request Body:** None

**Response Body** (`200 OK`):

```json
{
  "message": "Logged out successfully"
}
```

**Status Codes:**

| Status | Description                      |
|--------|----------------------------------|
| `200`  | Logout successful                |
| `401`  | Missing or invalid Bearer token  |

---

### Vehicle Endpoints

Base path: `/api/vehicles`

---

#### GET `/api/vehicles`

Retrieve a paginated list of all vehicles in the inventory.

**Auth:** None (Public)

**Query Parameters:**

| Parameter | Type    | Default        | Description                                              |
|-----------|---------|----------------|----------------------------------------------------------|
| `page`    | integer | `0`            | Zero-based page index                                    |
| `size`    | integer | `20`           | Number of items per page                                 |
| `sort`    | string  | `id,asc`       | Sort field and direction (e.g., `price,desc`)            |

**Example Request:**

```
GET /api/vehicles?page=0&size=5&sort=price,asc
```

**Response Body** (`200 OK`):

```json
{
  "content": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "make": "Honda",
      "model": "Civic",
      "year": 2023,
      "mileage": 15000,
      "vin": "1HGCM82633A000000",
      "trimLevel": "LX",
      "engineType": "2.0L 4-Cylinder",
      "transmission": "CVT",
      "color": "Silver",
      "category": "SEDAN",
      "price": 24950.00,
      "quantityInStock": 8,
      "status": "AVAILABLE"
    },
    {
      "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
      "make": "Toyota",
      "model": "Camry",
      "year": 2024,
      "mileage": 0,
      "vin": "4T1B11HK5RU000000",
      "trimLevel": "XLE",
      "engineType": "2.5L Hybrid",
      "transmission": "eCVT",
      "color": "Midnight Black Metallic",
      "category": "SEDAN",
      "price": 28450.00,
      "quantityInStock": 12,
      "status": "AVAILABLE"
    },
    {
      "id": "a8098c1a-f86e-11da-bd1a-00112444be1e",
      "make": "Ford",
      "model": "Mustang",
      "category": "Sports",
      "price": 42300.00,
      "quantityInStock": 3
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 5,
    "sort": {
      "sorted": true,
      "unsorted": false,
      "empty": false
    },
    "offset": 0,
    "paged": true,
    "unpaged": false
  },
  "totalElements": 3,
  "totalPages": 1,
  "size": 5,
  "number": 0,
  "numberOfElements": 3,
  "first": true,
  "last": true,
  "empty": false,
  "sort": {
    "sorted": true,
    "unsorted": false,
    "empty": false
  }
}
```

**Status Codes:**

| Status | Description                     |
|--------|---------------------------------|
| `200`  | Vehicles retrieved successfully |

---

#### GET `/api/vehicles/{id}`

Retrieve a single vehicle by its UUID.

**Auth:** None (Public)

**Path Parameters:**

| Parameter | Type | Description          |
|-----------|------|----------------------|
| `id`      | UUID | The vehicle's unique identifier |

**Example Request:**

```
GET /api/vehicles/3fa85f64-5717-4562-b3fc-2c963f66afa6
```

**Response Body** (`200 OK`):

```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "make": "Honda",
  "model": "Civic",
  "year": 2023,
  "mileage": 15000,
  "vin": "1HGCM82633A000000",
  "trimLevel": "LX",
  "engineType": "2.0L 4-Cylinder",
  "transmission": "CVT",
  "color": "Silver",
  "category": "SEDAN",
  "price": 24950.00,
  "quantityInStock": 8,
  "status": "AVAILABLE"
}
```

**Status Codes:**

| Status | Description               |
|--------|---------------------------|
| `200`  | Vehicle found             |
| `404`  | Vehicle not found         |

---

#### GET `/api/vehicles/search`

Search for vehicles using dynamic filters. All parameters are optional — only non-null parameters are applied as filter criteria using JPA Specifications.

**Auth:** None (Public)

**Query Parameters:**

| Parameter  | Type   | Description                              |
|------------|--------|------------------------------------------|
| `make`     | string | Filter by manufacturer (e.g., `Toyota`)  |
| `model`    | string | Filter by model name (e.g., `Camry`)     |
| `category` | string | Filter by category (e.g., `SUV`)         |
| `minPrice` | number | Minimum price (inclusive)                |
| `maxPrice` | number | Maximum price (inclusive)                |

**Example Request:**

```
GET /api/vehicles/search?make=Toyota&minPrice=25000&maxPrice=50000
```

**Response Body** (`200 OK`):

```json
[
  {
    "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "make": "Toyota",
    "model": "Camry",
    "category": "Sedan",
    "price": 28450.00,
    "quantityInStock": 12
  },
  {
    "id": "b2c3d4e5-f6a7-8901-bcde-f23456789012",
    "make": "Toyota",
    "model": "RAV4",
    "category": "SUV",
    "price": 34800.00,
    "quantityInStock": 6
  },
  {
    "id": "c3d4e5f6-a7b8-9012-cdef-345678901234",
    "make": "Toyota",
    "model": "Highlander",
    "category": "SUV",
    "price": 42150.00,
    "quantityInStock": 4
  }
]
```

**Status Codes:**

| Status | Description                       |
|--------|-----------------------------------|
| `200`  | Search completed (may be empty)   |

> [!TIP]
> Combine multiple parameters to narrow results. For example, `?make=Toyota&category=SUV&maxPrice=40000` returns only Toyota SUVs priced at or below $40,000.

---

#### POST `/api/vehicles`

Add a new vehicle to the inventory.

**Auth:** Bearer Token (**ADMIN** only)

**Request Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json
```

**Request Body:**

```json
{
  "make": "Chevrolet",
  "model": "Tahoe",
  "year": 2024,
  "mileage": 0,
  "vin": "1GNSKBE09RR000000",
  "trimLevel": "LT",
  "engineType": "5.3L V8",
  "transmission": "10-Speed Automatic",
  "color": "Summit White",
  "category": "SUV",
  "price": 54900.00,
  "quantityInStock": 5,
  "status": "AVAILABLE"
}
```

| Field             | Type   | Constraints                   |
|-------------------|--------|-------------------------------|
| `make`            | string | Required, not blank           |
| `model`           | string | Required, not blank           |
| `year`            | number | Required, min 1886            |
| `mileage`         | number | Required, min 0               |
| `vin`             | string | Required, exactly 17 chars    |
| `trimLevel`       | string | Required, not blank           |
| `engineType`      | string | Required, not blank           |
| `transmission`    | string | Required, not blank           |
| `color`           | string | Required, not blank           |
| `category`        | string | Required, not blank           |
| `price`           | number | Required, must be positive    |
| `quantityInStock` | number | Required, minimum 0           |
| `status`          | string | Required, valid enum value    |

**Response Body** (`201 Created`):

```json
{
  "id": "d4e5f6a7-b8c9-0123-def0-456789012345",
  "make": "Chevrolet",
  "model": "Tahoe",
  "category": "SUV",
  "price": 54900.00,
  "quantityInStock": 5
}
```

**Status Codes:**

| Status | Description                                |
|--------|--------------------------------------------|
| `201`  | Vehicle created successfully               |
| `400`  | Validation error (missing/invalid fields)  |
| `403`  | Forbidden — requires ADMIN role            |

---

#### PUT `/api/vehicles/{id}`

Update an existing vehicle's details.

**Auth:** Bearer Token (**ADMIN** only)

**Path Parameters:**

| Parameter | Type | Description                    |
|-----------|------|--------------------------------|
| `id`      | UUID | The vehicle's unique identifier |

**Request Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json
```

**Request Body:**

```json
{
  "make": "Chevrolet",
  "model": "Tahoe",
  "year": 2024,
  "mileage": 0,
  "vin": "1GNSKBE09RR000000",
  "trimLevel": "LT",
  "engineType": "5.3L V8",
  "transmission": "10-Speed Automatic",
  "color": "Summit White",
  "category": "SUV",
  "price": 56500.00,
  "quantityInStock": 7,
  "status": "AVAILABLE"
}
```

| Field             | Type   | Constraints                   |
|-------------------|--------|-------------------------------|
| `make`            | string | Required, not blank           |
| `model`           | string | Required, not blank           |
| `year`            | number | Required, min 1886            |
| `mileage`         | number | Required, min 0               |
| `vin`             | string | Required, exactly 17 chars    |
| `trimLevel`       | string | Required, not blank           |
| `engineType`      | string | Required, not blank           |
| `transmission`    | string | Required, not blank           |
| `color`           | string | Required, not blank           |
| `category`        | string | Required, not blank           |
| `price`           | number | Required, must be positive    |
| `quantityInStock` | number | Required, minimum 0           |
| `status`          | string | Required, valid enum value    |

**Response Body** (`200 OK`):

```json
{
  "id": "d4e5f6a7-b8c9-0123-def0-456789012345",
  "make": "Chevrolet",
  "model": "Tahoe",
  "year": 2024,
  "mileage": 0,
  "vin": "1GNSKBE09RR000000",
  "trimLevel": "LT",
  "engineType": "5.3L V8",
  "transmission": "10-Speed Automatic",
  "color": "Summit White",
  "category": "SUV",
  "price": 56500.00,
  "quantityInStock": 7,
  "status": "AVAILABLE"
}
```

**Status Codes:**

| Status | Description                                             |
|--------|---------------------------------------------------------|
| `200`  | Vehicle updated successfully                            |
| `400`  | Validation error (missing/invalid fields)               |
| `403`  | Forbidden — requires ADMIN role                         |
| `404`  | Vehicle not found                                       |
| `409`  | Conflict — optimistic lock failure (concurrent update)  |

> [!WARNING]
> A `409 Conflict` response indicates another request modified this vehicle between your read and write. Re-fetch the vehicle and retry the update with the latest data.

---

#### DELETE `/api/vehicles/{id}`

Remove a vehicle from the inventory.

**Auth:** Bearer Token (**ADMIN** only)

**Path Parameters:**

| Parameter | Type | Description                    |
|-----------|------|--------------------------------|
| `id`      | UUID | The vehicle's unique identifier |

**Request Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Request Body:** None

**Response:** `204 No Content` (empty body)

**Status Codes:**

| Status | Description                     |
|--------|---------------------------------|
| `204`  | Vehicle deleted successfully    |
| `403`  | Forbidden — requires ADMIN role |
| `404`  | Vehicle not found               |

---

### Inventory Endpoints

Base path: `/api/vehicles/{id}`

---

#### POST `/api/vehicles/{id}/purchase`

Purchase one unit of a vehicle, decrementing its stock count by 1.

**Auth:** Bearer Token (**USER** or **ADMIN**)

**Path Parameters:**

| Parameter | Type | Description                    |
|-----------|------|--------------------------------|
| `id`      | UUID | The vehicle's unique identifier |

**Request Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Request Body:** None

**Response Body** (`200 OK`):

```json
{
  "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "make": "Toyota",
  "model": "Camry",
  "category": "Sedan",
  "price": 28450.00,
  "quantityInStock": 11
}
```

**Status Codes:**

| Status | Description                                              |
|--------|----------------------------------------------------------|
| `200`  | Purchase successful — stock decremented                  |
| `400`  | Vehicle is out of stock (`quantityInStock` is 0)         |
| `404`  | Vehicle not found                                        |
| `409`  | Conflict — optimistic lock failure (concurrent purchase)  |

> [!NOTE]
> The response returns the updated vehicle with the new `quantityInStock` value.

---

#### POST `/api/vehicles/{id}/restock`

Add units to a vehicle's stock count.

**Auth:** Bearer Token (**ADMIN** only)

**Path Parameters:**

| Parameter | Type | Description                    |
|-----------|------|--------------------------------|
| `id`      | UUID | The vehicle's unique identifier |

**Request Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json
```

**Request Body:**

```json
{
  "quantity": 10
}
```

| Field      | Type   | Constraints            |
|------------|--------|------------------------|
| `quantity`  | number | Required, minimum 1   |

**Response Body** (`200 OK`):

```json
{
  "id": "a8098c1a-f86e-11da-bd1a-00112444be1e",
  "make": "Ford",
  "model": "Mustang",
  "category": "Sports",
  "price": 42300.00,
  "quantityInStock": 13
}
```

**Status Codes:**

| Status | Description                                |
|--------|--------------------------------------------|
| `200`  | Restock successful — stock updated         |
| `400`  | Validation error (quantity must be ≥ 1)    |
| `403`  | Forbidden — requires ADMIN role            |
| `404`  | Vehicle not found                          |

---

## Error Response Reference

### Standard Error Format

All error responses follow a consistent structure:

```json
{
  "error": "Error Type",
  "message": "A human-readable description of what went wrong"
}
```

### Error Examples

**400 — Validation Error:**

```json
{
  "error": "Validation Error",
  "message": "make: must not be blank; price: must be greater than 0"
}
```

**401 — Authentication Error:**

```json
{
  "error": "Authentication Error",
  "message": "Invalid email or password"
}
```

**404 — Resource Not Found:**

```json
{
  "error": "Not Found",
  "message": "Vehicle not found with id: 3fa85f64-5717-4562-b3fc-2c963f66afa6"
}
```

**409 — Conflict:**

```json
{
  "error": "Conflict",
  "message": "This record has been modified by another transaction. Please retry."
}
```

### Complete Error Type Reference

| HTTP Status | Error Type               | Exception Class                             | Typical Cause                                         |
|-------------|--------------------------|---------------------------------------------|-------------------------------------------------------|
| `400`       | Validation Error         | `MethodArgumentNotValidException`           | Request body fails `@Valid` constraints                |
| `400`       | Bad Request              | `IllegalArgumentException`                  | Invalid argument passed to an operation                |
| `400`       | Out of Stock             | `OutOfStockException`                       | Purchase attempted when `quantityInStock` is 0         |
| `401`       | Authentication Error     | `BadCredentialsException`                   | Wrong email or password during login                   |
| `401`       | Invalid Token            | `InvalidTokenException`                     | Refresh token is expired, revoked, or does not exist   |
| `401`       | Malformed Token          | `MalformedJwtException`                     | JWT is structurally invalid or tampered with           |
| `404`       | Not Found                | `ResourceNotFoundException`                 | Entity with the given ID does not exist                |
| `409`       | Conflict                 | `ObjectOptimisticLockingFailureException`   | Concurrent modification detected (stale version)      |
| `409`       | Conflict                 | `DataIntegrityViolationException`           | Duplicate email or username during registration        |

---

## Pagination

The `GET /api/vehicles` endpoint returns a **Spring `Page` object**. This section explains the structure and how to navigate paginated results.

### Request Parameters

| Parameter | Type    | Default  | Description                                                        |
|-----------|---------|----------|--------------------------------------------------------------------|
| `page`    | integer | `0`      | Zero-based page index (first page is `0`)                          |
| `size`    | integer | `20`     | Number of items per page                                           |
| `sort`    | string  | `id,asc` | Sort field and direction — e.g., `price,desc` or `make,asc`       |

### Response Structure

| Field                   | Type    | Description                                          |
|-------------------------|---------|------------------------------------------------------|
| `content`               | array   | Array of `VehicleResponse` objects for the current page |
| `pageable.pageNumber`   | integer | Current page number (zero-based)                     |
| `pageable.pageSize`     | integer | Requested page size                                  |
| `pageable.sort`         | object  | Sort information                                     |
| `pageable.offset`       | integer | Offset of the first element on this page             |
| `totalElements`         | integer | Total number of vehicles across all pages            |
| `totalPages`            | integer | Total number of pages                                |
| `size`                  | integer | Page size                                            |
| `number`                | integer | Current page number (zero-based)                     |
| `numberOfElements`      | integer | Number of elements on the current page               |
| `first`                 | boolean | `true` if this is the first page                     |
| `last`                  | boolean | `true` if this is the last page                      |
| `empty`                 | boolean | `true` if the page has no content                    |

### Pagination Example

Fetching page 2 with 3 items per page, sorted by price descending:

```
GET /api/vehicles?page=1&size=3&sort=price,desc
```

```json
{
  "content": [
    {
      "id": "b2c3d4e5-f6a7-8901-bcde-f23456789012",
      "make": "Toyota",
      "model": "RAV4",
      "category": "SUV",
      "price": 34800.00,
      "quantityInStock": 6
    },
    {
      "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
      "make": "Toyota",
      "model": "Camry",
      "category": "Sedan",
      "price": 28450.00,
      "quantityInStock": 12
    },
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "make": "Honda",
      "model": "Civic",
      "category": "Sedan",
      "price": 24950.00,
      "quantityInStock": 8
    }
  ],
  "pageable": {
    "pageNumber": 1,
    "pageSize": 3,
    "sort": {
      "sorted": true,
      "unsorted": false,
      "empty": false
    },
    "offset": 3,
    "paged": true,
    "unpaged": false
  },
  "totalElements": 9,
  "totalPages": 3,
  "size": 3,
  "number": 1,
  "numberOfElements": 3,
  "first": false,
  "last": false,
  "empty": false,
  "sort": {
    "sorted": true,
    "unsorted": false,
    "empty": false
  }
}
```

### Navigating Pages

To iterate through all pages:

1. Start with `page=0`
2. Check the `last` field — if `false`, increment `page` and request again
3. Stop when `last` is `true`

```
Page 1: GET /api/vehicles?page=0&size=3   →  first=true,  last=false
Page 2: GET /api/vehicles?page=1&size=3   →  first=false, last=false
Page 3: GET /api/vehicles?page=2&size=3   →  first=false, last=true   ← stop
```
