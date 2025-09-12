# Directus Upsert Item Extension

A Directus endpoint extension that provides filter-based upsert functionality (create or update) for items in any collection.

## Features

- **Filter-Based Upsert**: Create new items or update existing ones based on custom filter criteria
- **Flexible Filtering**: Use any field or combination of fields to determine if an item exists
- **Direct Database Queries**: Efficiently checks for existing records using database queries
- **Full Data Response**: Returns complete item data after upsert operations
- **Type Safety**: Built with TypeScript for better development experience
- **Error Handling**: Comprehensive error handling with meaningful messages
- **Status Codes**: Returns appropriate HTTP status codes (200 for updates, 201 for creates)

## How It Works

The extension uses a filter-based approach to determine whether to create or update items:

1. **Filter Check**: Uses the provided filter criteria to search for existing records
2. **Update or Create**: If a record exists, it updates the record; if not, it creates a new one
3. **Data Return**: Reads back and returns the complete item data after the operation

This approach gives you complete control over the upsert logic by allowing you to specify exactly which fields should be used to determine uniqueness.

## Installation

1. Build the extension:
   ```bash
   npm run build
   ```

2. Copy the built extension to your Directus extensions folder:
   ```bash
   cp -r dist/ /path/to/your/directus/extensions/endpoints/directus-extension-upsert-item/
   ```

3. Restart your Directus instance

## API Usage

### Upsert an Item

**Endpoint:** `POST /upsert/:collection`

**Parameters:**
- `collection` (path parameter): The name of the collection to upsert into

**Request Body:**
```json
{
  "filter": {
    "email": "user@example.com"
  },
  "body": {
    "email": "user@example.com",
    "name": "John Doe",
    "status": "active"
  }
}
```

**Response (Create - 201):**
```json
{
  "success": true,
  "message": "Create Success",
  "code": 201,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "status": "active",
    "date_created": "2024-01-15T10:30:00Z"
  }
}
```

**Response (Update - 200):**
```json
{
  "success": true,
  "message": "Update Success",
  "code": 200,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "status": "active",
    "date_updated": "2024-01-15T11:45:00Z"
  }
}
```

### Request Structure

- **`filter`** (required): Object containing the criteria to search for existing records
- **`body`** (required): Object containing the data to create or update

**Note:** The filter determines whether an item exists, while the body contains the actual data to be saved.

## Examples

### Example 1: Upsert a User by Email

```bash
curl -X POST "http://localhost:8055/upsert/users" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "filter": {
      "email": "john@example.com"
    },
    "body": {
      "email": "john@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "status": "active"
    }
  }'
```

*This will create a new user if no user exists with that email, or update the existing user with that email.*

### Example 2: Upsert a Product by SKU

```bash
curl -X POST "http://localhost:8055/upsert/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "filter": {
      "sku": "PROD-001"
    },
    "body": {
      "sku": "PROD-001",
      "name": "Updated Product Name",
      "price": 29.99,
      "category": "electronics"
    }
  }'
```

*This will create a new product if no product exists with that SKU, or update the existing product with that SKU.*

### Example 3: Upsert with Multiple Filter Criteria

```bash
curl -X POST "http://localhost:8055/upsert/orders" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "filter": {
      "customer_id": 123,
      "order_date": "2024-01-15"
    },
    "body": {
      "customer_id": 123,
      "order_date": "2024-01-15",
      "total_amount": 150.00,
      "status": "completed"
    }
  }'
```

*This will update an order if one exists for customer 123 on 2024-01-15, or create a new order if none exists.*

### Example 4: Upsert with Complex Filter

```bash
curl -X POST "http://localhost:8055/upsert/inventory" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "filter": {
      "warehouse_id": "WH001",
      "product_sku": "ITEM-123"
    },
    "body": {
      "warehouse_id": "WH001",
      "product_sku": "ITEM-123",
      "quantity": 50,
      "last_updated": "2024-01-15T10:30:00Z"
    }
  }'
```

*This will update inventory for a specific product in a specific warehouse, or create a new inventory record if none exists.*

## Error Handling

The extension provides detailed error messages for common issues:

**400 Bad Request:**
- Missing collection parameter
- Missing or empty filter object
- Missing body object
- Collection not found in schema

**Example Error Response:**
```json
{
  "success": false,
  "message": "Missing filter",
  "code": 400
}
```

**500 Internal Server Error:**
- Database connection issues
- Schema loading errors
- Unexpected server errors

## Development

### Build for Development
```bash
npm run dev
```

### Validate Extension
```bash
npm run validate
```

## License

MIT License