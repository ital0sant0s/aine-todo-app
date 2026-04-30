# Todo API Contract

## Response Envelopes

- Success: `{ "data": ... }`
- Failure: `{ "error": { "code": "...", "message": "...", "details": [] } }`

## Endpoints

### `POST /api/todos`

Creates a todo.

Request body:

```json
{
  "description": "Buy milk"
}
```

Validation:

- `description` is required
- value is trimmed
- trimmed length must be `1..200`

Success (`201`):

```json
{
  "data": {
    "id": 1,
    "description": "Buy milk",
    "completed": false,
    "createdAt": "2026-04-30T02:00:00.000Z"
  }
}
```

### `GET /api/todos`

Lists todos in `createdAt` descending order (newest first).

Success (`200`):

```json
{
  "data": []
}
```

### `PATCH /api/todos/:id`

Updates completion state for one todo.

Path parameter:

- `id` must be a positive integer

Request body:

```json
{
  "completed": true
}
```

Success (`200`):

```json
{
  "data": {
    "id": 1,
    "description": "Buy milk",
    "completed": true,
    "createdAt": "2026-04-30T02:00:00.000Z"
  }
}
```

### `DELETE /api/todos/:id`

Deletes a todo by id.

Path parameter:

- `id` must be a positive integer

Success (`200`):

```json
{
  "data": {
    "id": 1
  }
}
```

## Error Status Mapping

- Validation failures: `400` + `VALIDATION_ERROR`
- Missing todo: `404` + `NOT_FOUND`
- Unexpected server failure: `500` + `INTERNAL_SERVER_ERROR`
