# Docker Setup for TXR App

This document explains how to run the TXR application using Docker and Docker Compose.

## Prerequisites

- Docker installed on your system
- Docker Compose installed on your system

## Quick Start

1. **Clone the repository and navigate to the project directory**

   ```bash
   cd txr
   ```

2. **Build and start the services**

   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Application: http://localhost:3000
   - MongoDB: localhost:27017

## Environment Variables

The docker-compose.yml includes default environment variables. For production, you should:

1. Create a `.env` file in the project root
2. Override the default values with secure ones:

```env
MONGODB_URI=mongodb://admin:your-secure-password@mongodb:27017/txr?authSource=admin
JWT_SECRET=your-super-secure-jwt-secret-key
SESSION_COOKIE_NAME=txr_session
ADMIN_EMAIL=your-admin@email.com
ADMIN_PASSWORD=your-secure-admin-password
ADMIN_NAME=Your Admin Name
```

## Docker Commands

### Start services in background

```bash
docker-compose up -d
```

### Stop services

```bash
docker-compose down
```

### View logs

```bash
docker-compose logs -f app
docker-compose logs -f mongodb
```

### Rebuild the application

```bash
docker-compose up --build app
```

### Reset database (removes all data)

```bash
docker-compose down -v
docker-compose up --build
```

## Database Access

### Connect to MongoDB container

```bash
docker exec -it txr-mongodb mongosh -u admin -p password123 --authenticationDatabase admin
```

### Use the txr database

```javascript
use txr
show collections
```

## Troubleshooting

### Application won't start

1. Check if MongoDB is ready: `docker-compose logs mongodb`
2. Ensure port 3000 is not in use by another application
3. Check application logs: `docker-compose logs app`

### Database connection issues

1. Verify MongoDB container is running: `docker ps`
2. Check MongoDB logs: `docker-compose logs mongodb`
3. Ensure the MONGODB_URI environment variable is correct

### Performance issues

1. Allocate more memory to Docker if needed
2. Check system resources: `docker stats`

## Production Deployment

For production deployment:

1. **Update environment variables** with secure values
2. **Use Docker secrets** for sensitive data
3. **Set up proper networking** and reverse proxy
4. **Configure backup strategy** for MongoDB data
5. **Monitor logs and metrics**

## File Structure

- `Dockerfile` - Multi-stage build for the Next.js application
- `docker-compose.yml` - Orchestrates app and database services
- `mongo-init.js` - MongoDB initialization script
- `.dockerignore` - Files to exclude from Docker build context
