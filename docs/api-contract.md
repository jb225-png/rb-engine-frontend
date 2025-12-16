# API Contract - RBB Engine Frontend

This document outlines the expected API endpoints and data structures for the RBB Engine frontend application.

## Base URL
```
https://api.rbbengine.com/v1
```

## Authentication
All requests require Bearer token authentication:
```
Authorization: Bearer <token>
```

## Error Format
All errors follow this structure:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "standardCode",
      "reason": "Required field missing"
    }
  }
}
```

## Endpoints

### Products

#### GET /products
Get list of products
```json
// Response
{
  "data": [
    {
      "id": "prod_123",
      "name": "Math Course - Grade 3",
      "type": "course",
      "status": "published",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

#### POST /products
Create new product
```json
// Request
{
  "name": "New Course",
  "type": "course",
  "description": "Course description"
}

// Response
{
  "data": {
    "id": "prod_124",
    "name": "New Course",
    "type": "course",
    "status": "draft",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Generation Jobs

#### POST /generation-jobs
Create generation job
```json
// Request
{
  "standardCode": "CCSS.MATH.CONTENT.3.OA.A.1",
  "fullBundle": true,
  "selectedProducts": ["course", "module", "lesson"]
}

// Response
{
  "data": {
    "id": "job_456",
    "standardCode": "CCSS.MATH.CONTENT.3.OA.A.1",
    "status": "pending",
    "productsCount": 12,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### GET /generation-jobs
Get generation history
```json
// Response
{
  "data": [
    {
      "id": "job_456",
      "standardCode": "CCSS.MATH.CONTENT.3.OA.A.1",
      "status": "success",
      "productsCount": 12,
      "createdAt": "2024-01-15T10:30:00Z",
      "completedAt": "2024-01-15T10:35:00Z"
    }
  ]
}
```

### Upload Queue

#### GET /upload-queue
Get upload queue items
```json
// Response
{
  "data": [
    {
      "id": "upload_789",
      "name": "Course Materials.zip",
      "type": "course_materials",
      "status": "processing",
      "progress": 75,
      "addedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "stats": {
    "pending": 5,
    "processing": 2,
    "completed": 10,
    "failed": 1
  }
}
```

#### POST /upload-queue
Add item to upload queue
```json
// Request (multipart/form-data)
{
  "file": "<file>",
  "type": "course_materials",
  "metadata": {
    "productId": "prod_123"
  }
}

// Response
{
  "data": {
    "id": "upload_790",
    "name": "Course Materials.zip",
    "status": "pending",
    "addedAt": "2024-01-15T10:30:00Z"
  }
}
```

### Bundles

#### GET /bundles
Get bundles list
```json
// Response
{
  "data": [
    {
      "id": "bundle_101",
      "name": "Grade 3 Math Complete",
      "description": "Complete math curriculum for grade 3",
      "productIds": ["prod_123", "prod_124"],
      "status": "active",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

## Status Values

### Product Status
- `draft` - Product is being created
- `review` - Product is under review
- `published` - Product is live
- `archived` - Product is no longer active

### Generation Job Status
- `pending` - Job is queued
- `generating` - Job is being processed
- `success` - Job completed successfully
- `error` - Job failed

### Upload Status
- `pending` - Upload is queued
- `processing` - Upload is being processed
- `completed` - Upload finished successfully
- `failed` - Upload failed

## Rate Limits
- 100 requests per minute per user
- 1000 requests per hour per user

## Pagination
All list endpoints support pagination:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)
- `sort` - Sort field (default: createdAt)
- `order` - Sort order: asc/desc (default: desc)