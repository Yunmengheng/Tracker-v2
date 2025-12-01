# 🏦 Financial Tracker - Microservices Backend

A complete microservices architecture backend for the Financial Tracker application built with Spring Boot, Spring Cloud, MongoDB, Kafka, Eureka, and API Gateway.

## 📋 Architecture Overview

```
┌─────────────────┐
│  Angular App    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  API Gateway    │ ◄── Single Entry Point (Port 8080)
│  (Zuul/Spring   │
│   Cloud Gateway)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Eureka Server   │ ◄── Service Discovery (Port 8761)
└────────┬────────┘
         │
    ┌────┴────┬──────────────┐
    │         │              │
    ▼         ▼              ▼
┌────────┐ ┌────────┐ ┌─────────────┐
│ Auth   │ │Trans-  │ │ Analytics   │
│Service │ │action  │ │  Service    │
│:8081   │ │Service │ │   :8083     │
│        │ │:8082   │ │             │
└───┬────┘ └───┬────┘ └──────┬──────┘
    │          │              │
    │          │              │
    └──────────┼──────────────┘
               │
          ┌────┴─────┐
          │          │
          ▼          ▼
     ┌────────┐ ┌────────┐
     │MongoDB │ │ Kafka  │
     │:27017  │ │:9092   │
     └────────┘ └────────┘
```

## 🛠️ Tech Stack

- **Spring Boot 3.2.0** - Microservices framework
- **Spring Cloud 2023.0.0** - Cloud-native patterns
- **Spring Cloud Netflix Eureka** - Service discovery
- **Spring Cloud Gateway** - API Gateway
- **MongoDB** - NoSQL database
- **Apache Kafka** - Event streaming
- **JWT** - Authentication & authorization
- **Swagger/OpenAPI** - API documentation
- **Docker & Docker Compose** - Containerization
- **Kubernetes** - Container orchestration
- **Maven** - Build tool

## 🚀 Services

### 1. Eureka Server (Port 8761)
- Service registry and discovery
- Health monitoring
- Load balancing support

### 2. API Gateway (Port 8080)
- Single entry point for all requests
- JWT authentication filter
- Request routing to microservices
- CORS configuration
- Rate limiting capability

### 3. Auth Service (Port 8081)
- User registration & login
- JWT token generation
- Password hashing (BCrypt)
- User profile management
- MongoDB integration

**Endpoints:**
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/profile` - Get user profile
- `PUT /auth/profile` - Update profile

### 4. Transaction Service (Port 8082)
- CRUD operations for transactions
- Transaction categorization
- Date range filtering
- Statistics calculation
- Kafka producer (publishes transaction events)
- MongoDB integration

**Endpoints:**
- `GET /transactions` - Get all transactions
- `GET /transactions/type/{type}` - Filter by type
- `GET /transactions/date-range` - Filter by date
- `GET /transactions/stats` - Get statistics
- `POST /transactions` - Create transaction
- `PUT /transactions/{id}` - Update transaction
- `DELETE /transactions/{id}` - Delete transaction

### 5. Analytics Service (Port 8083)
- Category breakdown analysis
- Trend data generation
- Financial reports
- AI-powered insights
- Kafka consumer (listens to transaction events)
- MongoDB caching

**Endpoints:**
- `GET /analytics/category-breakdown` - Category analysis
- `GET /analytics/trends?days=7` - Trend data
- `GET /analytics/report?period=monthly` - Financial report

## 📦 Prerequisites

- **Java 17** or higher
- **Maven 3.8+**
- **Docker & Docker Compose**
- **MongoDB** (or use Docker)
- **Kafka & Zookeeper** (or use Docker)

## 🔧 Quick Start

### Option 1: Using Docker Compose (Recommended)

1. **Build all services:**
```bash
cd backend

# Build each service
cd eureka-server && mvn clean package && cd ..
cd api-gateway && mvn clean package && cd ..
cd auth-service && mvn clean package && cd ..
cd transaction-service && mvn clean package && cd ..
cd analytics-service && mvn clean package && cd ..
```

2. **Start all services with Docker Compose:**
```bash
docker-compose up -d
```

3. **Check service status:**
```bash
docker-compose ps
```

4. **View logs:**
```bash
docker-compose logs -f [service-name]
```

5. **Stop all services:**
```bash
docker-compose down
```

### Option 2: Local Development

1. **Start MongoDB:**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:7.0
```

2. **Start Kafka & Zookeeper:**
```bash
# Zookeeper
docker run -d -p 2181:2181 --name zookeeper \
  -e ZOOKEEPER_CLIENT_PORT=2181 \
  confluentinc/cp-zookeeper:7.5.0

# Kafka
docker run -d -p 9092:9092 --name kafka \
  --link zookeeper \
  -e KAFKA_ZOOKEEPER_CONNECT=zookeeper:2181 \
  -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092 \
  -e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 \
  confluentinc/cp-kafka:7.5.0
```

3. **Start services in order:**
```bash
# Terminal 1 - Eureka Server
cd eureka-server
mvn spring-boot:run

# Terminal 2 - API Gateway (wait for Eureka)
cd api-gateway
mvn spring-boot:run

# Terminal 3 - Auth Service
cd auth-service
mvn spring-boot:run

# Terminal 4 - Transaction Service
cd transaction-service
mvn spring-boot:run

# Terminal 5 - Analytics Service
cd analytics-service
mvn spring-boot:run
```

## ☸️ Kubernetes Deployment

### Build Docker Images
```bash
# Build and tag images
docker build -t financial-tracker/eureka-server:1.0.0 ./eureka-server
docker build -t financial-tracker/api-gateway:1.0.0 ./api-gateway
docker build -t financial-tracker/auth-service:1.0.0 ./auth-service
docker build -t financial-tracker/transaction-service:1.0.0 ./transaction-service
docker build -t financial-tracker/analytics-service:1.0.0 ./analytics-service
```

### Deploy to Kubernetes
```bash
# Apply configurations
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/mongodb-deployment.yaml
kubectl apply -f k8s/kafka-deployment.yaml
kubectl apply -f k8s/eureka-deployment.yaml
kubectl apply -f k8s/api-gateway-deployment.yaml
kubectl apply -f k8s/auth-service-deployment.yaml
kubectl apply -f k8s/transaction-service-deployment.yaml
kubectl apply -f k8s/analytics-service-deployment.yaml

# Check pod status
kubectl get pods
kubectl get services

# Get API Gateway URL
kubectl get service api-gateway
```

## 📚 API Documentation

Each service has Swagger UI available:

- **Auth Service:** http://localhost:8081/swagger-ui.html
- **Transaction Service:** http://localhost:8082/swagger-ui.html
- **Analytics Service:** http://localhost:8083/swagger-ui.html
- **Eureka Dashboard:** http://localhost:8761

## 🔐 Authentication Flow

1. User registers via `POST /api/auth/register`
2. User logs in via `POST /api/auth/login` → Receives JWT token
3. Include token in requests: `Authorization: Bearer <token>`
4. API Gateway validates token and forwards to services
5. Services receive user info via `X-User-Id` and `X-User-Email` headers

## 📊 Kafka Topics

- **transaction-events** - Published by Transaction Service, consumed by Analytics Service
  - Event types: `CREATED`, `UPDATED`, `DELETED`
  - Payload: Transaction details (id, userId, type, category, amount, date)

## 🗄️ MongoDB Collections

- **users** - User accounts (Auth Service)
- **transactions** - Financial transactions (Transaction Service)
- **analytics_cache** - Cached analytics data (Analytics Service)

## 🛠️ Development

### Build a Single Service
```bash
cd [service-name]
mvn clean package
```

### Run Tests
```bash
mvn test
```

### Build Docker Image
```bash
docker build -t financial-tracker/[service-name]:1.0.0 .
```

## 📝 Environment Variables

### Auth Service
- `SPRING_DATA_MONGODB_URI` - MongoDB connection string
- `EUREKA_CLIENT_SERVICEURL_DEFAULTZONE` - Eureka server URL
- `JWT_SECRET` - Secret key for JWT signing
- `JWT_EXPIRATION` - Token expiration time (milliseconds)

### Transaction Service
- `SPRING_DATA_MONGODB_URI` - MongoDB connection string
- `SPRING_KAFKA_BOOTSTRAP_SERVERS` - Kafka brokers
- `EUREKA_CLIENT_SERVICEURL_DEFAULTZONE` - Eureka server URL

### Analytics Service
- `SPRING_DATA_MONGODB_URI` - MongoDB connection string
- `SPRING_KAFKA_BOOTSTRAP_SERVERS` - Kafka brokers
- `EUREKA_CLIENT_SERVICEURL_DEFAULTZONE` - Eureka server URL

## 🔍 Monitoring & Health Checks

- **Eureka Dashboard:** http://localhost:8761
- **Health Endpoints:** `http://localhost:[port]/actuator/health`
- **Service Registry:** Check registered services in Eureka

## 🐛 Troubleshooting

### Services not registering with Eureka
- Ensure Eureka Server is running first
- Check `eureka.client.serviceUrl.defaultZone` in application.yml
- Wait 30-60 seconds for registration

### Kafka connection issues
- Ensure Kafka and Zookeeper are running
- Check `KAFKA_BOOTSTRAP_SERVERS` configuration
- Verify Kafka topics are created: `docker exec -it kafka kafka-topics --list --bootstrap-server localhost:9092`

### MongoDB connection failed
- Ensure MongoDB is running
- Check connection string in environment variables
- Test connection: `mongosh mongodb://localhost:27017`

### JWT token errors
- Ensure `JWT_SECRET` is the same across all services
- Check token is included in `Authorization` header
- Verify token hasn't expired

## 📈 Scaling

### Horizontal Scaling
```bash
# Docker Compose
docker-compose up -d --scale transaction-service=3

# Kubernetes
kubectl scale deployment transaction-service --replicas=3
```

### Load Balancing
- Eureka provides client-side load balancing
- API Gateway routes to available instances
- Kubernetes Service provides load balancing

## 🎯 Next Steps

1. Add Spring Boot Actuator for metrics
2. Implement Circuit Breaker (Resilience4j)
3. Add distributed tracing (Sleuth + Zipkin)
4. Implement API rate limiting
5. Add Redis for caching
6. Set up centralized logging (ELK Stack)
7. Implement health checks and readiness probes
8. Add API versioning
9. Implement database migrations (Liquibase)
10. Add comprehensive integration tests

## 📄 License

MIT License

---

**Built with ❤️ using Spring Boot & Spring Cloud**
