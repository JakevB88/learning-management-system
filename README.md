# Learning Management System

Final project for Full Stack Front End Development.

Built using Django, Django REST Framework (DRF), JWT Authentication, React and SQLite.

## Tech Stack

- Python
- Django
- Django REST Framework
- Simple JWT
- SQLite
- JavaScript
- React
- Redux

## Run the Project

### Clone repository
```bash
git clone https://github.com/JakevB88/learning-management-system.git
```

### Install requirements
```
pip install -r requirements.txt
```

### Run database migrations
```bash
python manage.py migrate
```
### Start development server
```bash
python manage.py runserver
```
### Create superuser
```bash
python manage.py createsuperuser
```
Follow the prompts to create an admin account.

You can then obtain a JWT token using the administrator credentials via:

```http
POST /api/token/
```
---

# Consuming the API
# Authentication

## Obtain JWT Token

### Endpoint

```http
POST /api/token/
```

### Request Body

```json
{
    "username": "admin",
    "password": "admin"
}
```

### Success Response

```json
{
    "access": "jwt-token",
    "refresh": "refresh-token"
}
```

### Authentication Header

```http
Authorization: Bearer <access_token>
```

---

# User Endpoints

## Get Current Profile

```http
GET /api/users/profile/
```

Permissions:
- Authenticated Users

---

## Get All Users

```http
GET /api/users/
```

Permissions:
- Admin
- Teacher

---

## Get User By ID

```http
GET /api/users/{user_id}/
```

Permissions:
- Admin
- Teacher

Example:

```http
GET /api/users/1/
```

---

## Create Student Account

```http
POST /api/users/create/
```

Permissions:
- Public

Request Body:

```json
{
    "username": "student1",
    "password": "password",
    "first_name": "John",
    "last_name": "Smith",
    "email": "john@example.com"
}
```

---

## Create Staff Account

```http
POST /api/users/create-staff/
```

Permissions:
- Admin

Request Body:

```json
{
    "username": "teacher1",
    "password": "password",
    "first_name": "John",
    "last_name": "Smith",
    "email": "john@example.com",
    "role": "teacher"
}
```

Allowed roles:

```json
[
    "teacher",
    "admin"
]
```

---

## Update User

```http
PATCH /api/users/{user_id}/update/
```

Permissions:
- Account Owner
- Admin

Example:

```http
PATCH /api/users/2/update/
```

---

## Delete User

```http
DELETE /api/users/{user_id}/remove/
```

Permissions:
- Admin

Example:

```http
DELETE /api/users/2/remove/
```

---

# Course Endpoints

## Get All Courses

```http
GET /api/courses/
```

Permissions:
- Public

---

## Get Course By ID

```http
GET /api/courses/{course_id}/
```

Permissions:
- Public

Example:

```http
GET /api/courses/1/
```

---

## Create Course

```http
POST /api/courses/create/
```

Permissions:
- Teacher
- Admin

Request Body:

```json
{
    "title": "Python Fundamentals",
    "description": "Introduction to Python"
}
```

---

## Update Course

```http
PATCH /api/courses/{course_id}/update/
```

Permissions:
- Course Owner
- Admin

Example:

```http
PATCH /api/courses/1/update/
```

---

## Delete Course

```http
DELETE /api/courses/{course_id}/remove/
```

Permissions:
- Course Owner
- Admin

Example:

```http
DELETE /api/courses/1/remove/
```

---

# Course Registration

## Register For Course

```http
PUT /api/courses/{course_id}/register/
```

Permissions:
- Student

Example:

```http
PUT /api/courses/1/register/
```

---

## Deregister From Course

```http
PUT /api/courses/{course_id}/deregister/
```

Permissions:
- Student

Example:

```http
PUT /api/courses/1/deregister/
```

---

## Admin Deregister Student From Course

```http
PUT /api/courses/{course_id}/deregister-admin/
```

Permissions:
- Admin

Request Body:

```json
{
    "student_id": 2
}
```

Example:

```http
PUT /api/courses/1/deregister-admin/
```

---

# ✅ Permissions Summary

| Endpoint | Admin | Teacher | Student |
|-----------|-----------|-----------|-----------|
| View Courses | ✅ | ✅ | ✅ |
| View Single Course | ✅ | ✅ | ✅ |
| Create Course | ✅ | ✅ | ❌ |
| Update Own Course | ✅ | ✅ | ❌ |
| Delete Own Course | ✅ | ✅ | ❌ |
| View Users | ✅ | ✅ | ❌ |
| Create Student Account | ✅ | ✅ | ✅ |
| Create Staff Account | ✅ | ❌ | ❌ |
| Update Own Profile | ✅ | ✅ | ✅ |
| Delete User | ✅ | ❌ | ❌ |
| Register For Course | ❌ | ❌ | ✅ |
| Deregister From Course | ❌ | ❌ | ✅ |
| Deregister Any Student | ✅ | ❌ | ❌ |