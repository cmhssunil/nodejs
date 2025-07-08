# CMHS Backend API Documentation

## Base URL
```
http://localhost:5001/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

---

## 1. Authentication Endpoints

### 1.1 User Registration
- **URL:** `POST /auth/register`
- **Headers:** 
  ```
  Content-Type: application/json
  ```
- **Request Body:**
  ```json
  {
    "username": "admin_user",
    "useremail": "admin@cmhs.com",
    "phone": "+1234567890",
    "password": "securePassword123",
    "type": "super_admin"
  }
  ```
- **Response (201):**
  ```json
  {
    "message": "User created successfully",
    "user": {
      "id": 1,
      "username": "admin_user",
      "useremail": "admin@cmhs.com",
      "phone": "+1234567890",
      "type": "super_admin",
      "createdAt": "2025-01-05T12:00:00.000Z",
      "updatedAt": "2025-01-05T12:00:00.000Z"
    }
  }
  ```

### 1.2 User Login
- **URL:** `POST /auth/login`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Request Body:**
  ```json
  {
    "useremail": "admin@cmhs.com",
    "password": "securePassword123"
  }
  ```
- **Response (200):**
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Cookies Set:**
  ```
  refreshToken: <httpOnly_cookie>
  ```

### 1.3 Refresh Token
- **URL:** `POST /auth/refresh-token`
- **Headers:**
  ```
  Cookie: refreshToken=<token>
  ```
- **Request Body:** None
- **Response (200):**
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

### 1.4 User Logout
- **URL:** `POST /auth/logout`
- **Headers:** None required
- **Request Body:** None
- **Response (200):**
  ```json
  {
    "message": "Logged out successfully"
  }
  ```

---

## 2. User Management Endpoints

### 2.1 Get User Profile
- **URL:** `GET /users/profile`
- **Headers:**
  ```
  Authorization: Bearer <access_token>
  ```
- **Request Body:** None
- **Response (200):**
  ```json
  {
    "user": {
      "id": 1,
      "username": "admin_user",
      "useremail": "admin@cmhs.com",
      "phone": "+1234567890",
      "type": "super_admin"
    }
  }
  ```

### 2.2 Update User Profile
- **URL:** `PUT /users/update-profile`
- **Headers:**
  ```
  Authorization: Bearer <access_token>
  Content-Type: application/json
  ```
- **Request Body:**
  ```json
  {
    "username": "updated_username",
    "phone": "+1987654321"
  }
  ```
- **Response (200):**
  ```json
  {
    "message": "Profile updated successfully",
    "user": {
      "id": 1,
      "username": "updated_username",
      "useremail": "admin@cmhs.com",
      "phone": "+1987654321",
      "type": "super_admin",
      "updatedAt": "2025-01-05T12:30:00.000Z"
    }
  }
  ```

---

## 3. Customer Management Endpoints

### 3.1 Create Customer
- **URL:** `POST /customers`
- **Headers:**
  ```
  Authorization: Bearer <access_token>
  Content-Type: application/json
  ```
- **Request Body:**
  ```json
  {
    "fname": "John",
    "lname": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "password": "customerPassword123"
  }
  ```
- **Response (201):**
  ```json
  {
    "id": 1,
    "fname": "John",
    "lname": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "logincount": 0,
    "lastlogindatetime": null,
    "authorized": true,
    "forcepasswordchange": false,
    "createdAt": "2025-01-05T12:00:00.000Z",
    "updatedAt": "2025-01-05T12:00:00.000Z"
  }
  ```

### 3.2 Get All Customers
- **URL:** `GET /customers`
- **Headers:**
  ```
  Authorization: Bearer <access_token>
  ```
- **Request Body:** None
- **Response (200):**
  ```json
  [
    {
      "id": 1,
      "fname": "John",
      "lname": "Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "logincount": 0,
      "lastlogindatetime": null,
      "authorized": true,
      "forcepasswordchange": false,
      "createdAt": "2025-01-05T12:00:00.000Z",
      "updatedAt": "2025-01-05T12:00:00.000Z"
    },
    {
      "id": 2,
      "fname": "Jane",
      "lname": "Smith",
      "email": "jane.smith@example.com",
      "phone": "+1987654321",
      "logincount": 5,
      "lastlogindatetime": "2025-01-05T10:00:00.000Z",
      "authorized": true,
      "forcepasswordchange": false,
      "createdAt": "2025-01-05T11:00:00.000Z",
      "updatedAt": "2025-01-05T11:00:00.000Z"
    }
  ]
  ```

### 3.3 Get Customer by ID
- **URL:** `GET /customers/:id`
- **Headers:**
  ```
  Authorization: Bearer <access_token>
  ```
- **Request Body:** None
- **Response (200):**
  ```json
  {
    "id": 1,
    "fname": "John",
    "lname": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "logincount": 0,
    "lastlogindatetime": null,
    "authorized": true,
    "forcepasswordchange": false,
    "createdAt": "2025-01-05T12:00:00.000Z",
    "updatedAt": "2025-01-05T12:00:00.000Z"
  }
  ```

### 3.4 Update Customer
- **URL:** `PUT /customers/:id`
- **Headers:**
  ```
  Authorization: Bearer <access_token>
  Content-Type: application/json
  ```
- **Request Body:**
  ```json
  {
    "fname": "John",
    "lname": "Updated",
    "email": "john.updated@example.com",
    "phone": "+1234567890",
    "password": "newPassword123"
  }
  ```
- **Response (200):**
  ```json
  {
    "message": "Customer updated successfully",
    "customer": {
      "id": 1,
      "fname": "John",
      "lname": "Updated",
      "email": "john.updated@example.com",
      "phone": "+1234567890",
      "logincount": 0,
      "lastlogindatetime": null,
      "authorized": true,
      "forcepasswordchange": false,
      "updatedAt": "2025-01-05T12:30:00.000Z"
    }
  }
  ```

### 3.5 Delete Customer
- **URL:** `DELETE /customers/:id`
- **Headers:**
  ```
  Authorization: Bearer <access_token>
  ```
- **Request Body:** None
- **Response (200):**
  ```json
  {
    "message": "Customer deleted successfully"
  }
  ```

---

## 4. Group Management Endpoints

### 4.1 Create Group
- **URL:** `POST /groups`
- **Headers:**
  ```
  Authorization: Bearer <access_token>
  Content-Type: application/json
  ```
- **Request Body:**
  ```json
  {
    "groupName": "Premium Customers",
    "description": "High-value customers with premium services",
    "type": "static"
  }
  ```
- **Response (201):**
  ```json
  {
    "message": "Group created successfully",
    "group": {
      "id": 1,
      "groupName": "Premium Customers",
      "description": "High-value customers with premium services",
      "type": "static",
      "createdAt": "2025-01-05T12:00:00.000Z",
      "updatedAt": "2025-01-05T12:00:00.000Z"
    }
  }
  ```

### 4.2 Get All Groups
- **URL:** `GET /groups`
- **Headers:**
  ```
  Authorization: Bearer <access_token>
  ```
- **Request Body:** None
- **Response (200):**
  ```json
  [
    {
      "id": 1,
      "groupName": "Premium Customers",
      "description": "High-value customers with premium services",
      "type": "static",
      "createdAt": "2025-01-05T12:00:00.000Z",
      "updatedAt": "2025-01-05T12:00:00.000Z"
    },
    {
      "id": 2,
      "groupName": "New Customers",
      "description": "Recently registered customers",
      "type": "dynamic",
      "createdAt": "2025-01-05T12:30:00.000Z",
      "updatedAt": "2025-01-05T12:30:00.000Z"
    }
  ]
  ```

### 4.3 Get Group by ID
- **URL:** `GET /groups/:id`
- **Headers:**
  ```
  Authorization: Bearer <access_token>
  ```
- **Request Body:** None
- **Response (200):**
  ```json
  {
    "id": 1,
    "groupName": "Premium Customers",
    "description": "High-value customers with premium services",
    "type": "static",
    "createdAt": "2025-01-05T12:00:00.000Z",
    "updatedAt": "2025-01-05T12:00:00.000Z"
  }
  ```

### 4.4 Update Group
- **URL:** `PUT /groups/:id`
- **Headers:**
  ```
  Authorization: Bearer <access_token>
  Content-Type: application/json
  ```
- **Request Body:**
  ```json
  {
    "groupName": "Updated Premium Customers",
    "description": "Updated description for premium customers",
    "type": "static"
  }
  ```
- **Response (200):**
  ```json
  {
    "message": "Group updated successfully",
    "group": {
      "id": 1,
      "groupName": "Updated Premium Customers",
      "description": "Updated description for premium customers",
      "type": "static",
      "updatedAt": "2025-01-05T12:30:00.000Z"
    }
  }
  ```

### 4.5 Delete Group
- **URL:** `DELETE /groups/:id`
- **Headers:**
  ```
  Authorization: Bearer <access_token>
  ```
- **Request Body:** None
- **Response (200):**
  ```json
  {
    "message": "Group deleted successfully"
  }
  ```

---

## 5. Customer-Group Management Endpoints

### 5.1 Assign Customer to Group
- **URL:** `POST /customergroup`
- **Headers:**
  ```
  Authorization: Bearer <access_token>
  Content-Type: application/json
  ```
- **Request Body:**
  ```json
  {
    "customer_id": 1,
    "group_id": 1
  }
  ```
- **Response (201):**
  ```json
  {
    "message": "Customer assigned to group successfully"
  }
  ```

### 5.2 Get Groups by Customer ID
- **URL:** `GET /customergroup/:customer_id`
- **Headers:**
  ```
  Authorization: Bearer <access_token>
  ```
- **Request Body:** None
- **Response (200):**
  ```json
  [
    {
      "id": 1,
      "groupName": "Premium Customers",
      "description": "High-value customers with premium services",
      "type": "static"
    },
    {
      "id": 2,
      "groupName": "New Customers",
      "description": "Recently registered customers",
      "type": "dynamic"
    }
  ]
  ```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Group name and type are required"
}
```

### 401 Unauthorized
```json
{
  "message": "Unauthorized: No token provided"
}
```
or
```json
{
  "message": "Invalid credentials"
}
```

### 403 Forbidden
```json
{
  "message": "Invalid refresh token"
}
```

### 404 Not Found
```json
{
  "message": "Customer not found"
}
```
or
```json
{
  "message": "Group not found"
}
```
or
```json
{
  "message": "User not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Error creating customer",
  "error": "Database connection failed"
}
```

---

## Data Types

### User Types
- `super_admin` - Full system access
- `sub_admin` - Limited administrative access

### Group Types
- `static` - Manually managed groups
- `dynamic` - Automatically managed groups

### Customer Status
- `authorized` - Boolean indicating if customer can access system
- `forcepasswordchange` - Boolean indicating if password change is required
- `logincount` - Number of successful logins
- `lastlogindatetime` - Timestamp of last login

---

## Notes

1. **Password Security**: All passwords are automatically hashed using bcrypt before storage
2. **Token Expiration**: Access tokens expire in 1 hour, refresh tokens in 7 days
3. **CORS**: Configured for `http://localhost:5173` (frontend)
4. **Database**: MySQL with Sequelize ORM
5. **Authentication**: JWT-based with refresh token mechanism
6. **Cookies**: Refresh tokens stored as HTTP-only cookies 