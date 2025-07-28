# SAP HANA Cloud Setup Guide for Circlo.in

## Prerequisites

1. **SAP BTP Trial Account**
   - Sign up at: https://www.sap.com/products/technology-platform/trial.html
   - Activate your trial account

2. **SAP HANA Cloud Instance**
   - Create a new SAP HANA Cloud instance in your BTP trial
   - Note down the connection details

## Step 1: Get SAP HANA Cloud Credentials

### From SAP BTP Cockpit:
1. Log into your SAP BTP trial account
2. Navigate to **SAP HANA Cloud**
3. Create a new instance or use existing one
4. Click on your instance to get connection details

### Required Information:
- **Host**: Your HANA instance hostname (e.g., `abc123.hana.trial-us10.hanacloud.ondemand.com`)
- **Port**: Usually `443` for SSL connections
- **User**: Your database user (e.g., `DBADMIN`)
- **Password**: Your database password

## Step 2: Configure Environment Variables

Create/update the `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL for CORS
FRONTEND_URL=http://localhost:5174

# SAP HANA Cloud Configuration
HANA_HOST=your-hana-host.hana.trial-us10.hanacloud.ondemand.com
HANA_PORT=443
HANA_USER=DBADMIN
HANA_PASSWORD=your-hana-password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security
BCRYPT_ROUNDS=12
```

## Step 3: Create Database Tables

Run the table creation script:

```bash
npm run table
```

This will create all necessary tables:
- Users
- Items
- Bookings
- Reviews
- Chats
- Photos

## Step 4: Test Database Connection

Test the connection:

```bash
curl http://localhost:5000/test-hana
```

Expected response:
```json
{
  "status": "Database Connection Successful",
  "hanaUser": "DBADMIN",
  "timestamp": "2025-07-28T04:10:05.289Z"
}
```

## Step 5: Insert Sample Data

After tables are created, you can insert sample data using the API endpoints:

### Register a test user:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "phone": "+919876543210"
  }'
```

### Create a test item:
```bash
curl -X POST http://localhost:5000/api/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Test Camera",
    "description": "A test camera for development",
    "category": "Electronics",
    "price": 50,
    "price_unit": "day",
    "location": "Test Location"
  }'
```

## Troubleshooting

### Common Issues:

1. **Connection Failed**
   - Check if HANA instance is running
   - Verify credentials in .env file
   - Ensure firewall allows port 443

2. **Authentication Error**
   - Verify username and password
   - Check if user has proper permissions

3. **SSL Certificate Issues**
   - SAP HANA Cloud requires SSL
   - Port should be 443

### Test Commands:

```bash
# Test basic connection
curl http://localhost:5000/

# Test database connection
curl http://localhost:5000/test-hana

# Test API endpoints
curl http://localhost:5000/api/items
curl http://localhost:5000/api/health
```

## Security Notes

1. **Never commit .env file** to version control
2. **Use strong JWT secrets** in production
3. **Enable SSL** for all connections
4. **Implement proper authentication** and authorization
5. **Use environment-specific configurations**

## Production Deployment

For production deployment:

1. Use production SAP HANA Cloud instance
2. Set up proper SSL certificates
3. Configure environment variables securely
4. Implement proper logging and monitoring
5. Set up backup and recovery procedures

## Support

- SAP HANA Cloud Documentation: https://help.sap.com/docs/SAP_HANA_CLOUD
- SAP BTP Trial: https://www.sap.com/products/technology-platform/trial.html
- SAP Community: https://community.sap.com/ 