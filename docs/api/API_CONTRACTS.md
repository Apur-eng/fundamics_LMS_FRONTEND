# API Service Layer & Contracts Specification

## 1. Overview
The Fundemics LMS frontend utilizes a centralized HTTP client (`src/services/api/apiClient.ts`) to communicate with the upcoming **FastAPI** backend. 

All endpoints return a standardized JSON envelope:

```typescript
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  timestamp: string;
}
```

---

## 2. Authentication Contracts

### `POST /v1/auth/login`
- **Request Body**:
  ```json
  {
    "identifier": "FND-2025-1042",
    "password": "password123",
    "selectedRole": "STUDENT"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "token": "mock-fnd-jwt-student-1727500000000",
      "user": {
        "id": "usr-std-001",
        "name": "Aryan Srivastava",
        "email": "aryan.srivastava@student.fundamics.in",
        "phone": "9876543210",
        "role": "STUDENT",
        "branchId": "br-triveni",
        "branchName": "Triveni Nagar (Flagship Campus)",
        "classOrDept": "Class XII (ISC Science)",
        "admissionNo": "FND-2025-1042"
      }
    },
    "message": "Authentication successful",
    "timestamp": "2026-09-28T11:15:00.000Z"
  }
  ```

### `POST /v1/auth/forgot-password`
- **Request Body**:
  ```json
  {
    "identifier": "9876543210"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "message": "Verification code sent to registered contact"
    },
    "timestamp": "2026-09-28T11:15:00.000Z"
  }
  ```

### `POST /v1/auth/verify-otp`
- **Request Body**:
  ```json
  {
    "identifier": "9876543210",
    "otp": "123456"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "verified": true
    },
    "timestamp": "2026-09-28T11:15:00.000Z"
  }
  ```

---

## 3. Dashboard Endpoints

### `GET /v1/dashboard/student`
Returns active attendance rate, today's schedule with live session status, recent assessment scores, and institutional circulars.

### `GET /v1/dashboard/teacher`
Returns faculty teaching metrics, active batch roster for the current day, mark attendance action states, and priority grading tasks.

### `GET /v1/dashboard/admin`
Returns central operational metrics across Triveni Nagar, Faizullaganj, and Aliganj branches, along with the recent system activity audit trail.
