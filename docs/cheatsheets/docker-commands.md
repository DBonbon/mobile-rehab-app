# Docker Commands Reference

## Basic Operations

### Container Management
```bash
# Run Containers
docker run -d -p 8080:80 image_name        # Run detached with port mapping
docker run -it image_name bash             # Run interactive with bash
docker run --name my-container image_name  # Run with specific name

# Container Operations
docker ps                                  # List running containers
docker ps -a                               # List all containers
docker stop container_id                   # Stop container
docker start container_id                  # Start stopped container
docker restart container_id                # Restart container
docker rm container_id                     # Remove container
docker rm -f container_id                  # Force remove running container

# Container Information
docker logs container_id                   # View logs
docker logs -f container_id                # Follow logs
docker inspect container_id                # View container details
```

### Image Management
```bash
# Image Operations
docker images                             # List images
docker pull image_name                    # Pull image from registry
docker push image_name                    # Push to registry
docker rmi image_id                       # Remove image
docker build -t image_name .              # Build image from Dockerfile

# Image Cleanup
docker image prune                        # Remove unused images
docker image prune -a                     # Remove all unused images
```

## Docker Compose

### Basic Compose Commands
```bash
# Service Management
docker-compose up                         # Start services
docker-compose up -d                      # Start in detached mode
docker-compose down                       # Stop and remove containers
docker-compose down -v                    # Include volumes in removal
docker-compose restart                    # Restart services

# Service Information
docker-compose ps                         # List containers
docker-compose logs                       # View logs
docker-compose logs -f service_name       # Follow service logs

# Building Services
docker-compose build                      # Build all services
docker-compose build service_name         # Build specific service
```

## Network Management
```bash
# Network Operations
docker network ls                         # List networks
docker network create network_name        # Create network
docker network rm network_name            # Remove network
docker network inspect network_name       # Inspect network

# Container Networking
docker network connect network_name container_id    # Connect container to network
docker network disconnect network_name container_id # Disconnect from network
```

## Volume Management
```bash
# Volume Operations
docker volume ls                          # List volumes
docker volume create volume_name          # Create volume
docker volume rm volume_name              # Remove volume
docker volume prune                       # Remove unused volumes

# Volume Usage
docker run -v volume_name:/path image_name    # Use named volume
docker run -v $(pwd):/path image_name         # Bind mount current directory
```

## System Management
```bash
# System Information
docker info                               # System-wide information
docker version                            # Docker version info
docker system df                          # Disk usage

# Cleanup Operations
docker system prune                       # Remove unused data
docker system prune -a                    # Remove all unused data
docker system prune -a --volumes          # Include volumes in cleanup
```

## Common Docker Patterns

### Development Workflow
```bash
# Start Development Environment
docker-compose -f docker-compose.dev.yml up -d

# View Logs
docker-compose logs -f

# Rebuild and Restart Service
docker-compose up -d --build service_name

# Stop Environment
docker-compose down
```

### Debugging
```bash
# Access Container Shell
docker exec -it container_id bash

# Copy Files
docker cp container_id:/src/path ./local/path  # From container
docker cp ./local/path container_id:/src/path  # To container

# View Container Processes
docker top container_id
```

## Dockerfile Best Practices

1. Use multi-stage builds
```dockerfile
# Build stage
FROM node:14 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
```

2. Layer optimization
```dockerfile
# Good practice
COPY package*.json ./
RUN npm install
COPY . .

# Instead of
COPY . .
RUN npm install
```

## Common Issues and Solutions

### Container Won't Start
1. Check logs: `docker logs container_id`
2. Verify port availability: `docker port container_id`
3. Check network: `docker network inspect network_name`

### Image Won't Build
1. Check Dockerfile syntax
2. Verify build context
3. Review .dockerignore file

### Container Performance
1. Check resource usage: `docker stats`
2. Review logs for issues
3. Inspect configuration

## Tips and Tricks

1. Use `.dockerignore` file to exclude unnecessary files
2. Set resource limits for containers
3. Use named volumes for persistent data
4. Implement health checks
5. Tag images meaningfully
6. Use environment variables for configuration

## Environment Variables
```bash
# Set in docker run
docker run -e VARIABLE=value image_name

# Using env file
docker run --env-file .env image_name
```

## Security Best Practices

1. Use specific tags instead of 'latest'
2. Don't run containers as root
3. Scan images for vulnerabilities
4. Limit container capabilities
5. Use secrets management

## Updating This Guide
- Add new commands as you use them
- Document project-specific Docker configurations
- Keep examples relevant to your workflows
- Include troubleshooting steps for common issues