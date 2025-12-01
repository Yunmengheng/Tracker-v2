# 🚀 Complete Deployment Guide - Financial Tracker

## Architecture Overview

Your Financial Tracker application now has a complete microservices backend:

```
Angular Frontend (localhost:4200)
         ↓
API Gateway (localhost:8080) ← Single Entry Point
         ↓
    Eureka Server (localhost:8761) ← Service Discovery
         ↓
  ┌──────┴──────┬──────────────┐
  │             │              │
Auth Service  Transaction   Analytics
  (8081)       Service       Service
                (8082)        (8083)
  │             │              │
  └─────────────┼──────────────┘
                │
           ┌────┴─────┐
           │          │
       MongoDB     Kafka
       (27017)     (9092)
```

## 🎯 Quick Start (Easiest Method)

### Prerequisites
- **Docker Desktop** installed and running
- **Node.js 18+** and **npm**
- **Java 17** (for local development)
- **Maven 3.8+** (for building)

### Step 1: Build Backend Services

**Windows:**
```powershell
cd backend
.\build-all.bat
```

**Linux/Mac:**
```bash
cd backend
chmod +x build-all.sh
./build-all.sh
```

### Step 2: Start All Services with Docker Compose

```bash
cd backend
docker-compose up -d
```

This will start:
- MongoDB (port 27017)
- Zookeeper (port 2181)
- Kafka (port 9092)
- Eureka Server (port 8761)
- API Gateway (port 8080)
- Auth Service (port 8081)
- Transaction Service (port 8082)
- Analytics Service (port 8083)

### Step 3: Verify Services

Check all containers are running:
```bash
docker-compose ps
```

Check Eureka Dashboard:
```
http://localhost:8761
```

You should see all 3 services registered (AUTH-SERVICE, TRANSACTION-SERVICE, ANALYTICS-SERVICE).

### Step 4: Start Angular Frontend

```bash
cd ..  # Back to root directory
npm start
```

Frontend will be available at: `http://localhost:4200`

## ✅ Testing the Complete System

### 1. Register a New User

1. Go to http://localhost:4200
2. Click "Create one" (register link)
3. Fill in registration form
4. Submit

**What happens:**
- Angular sends POST to `http://localhost:8080/api/auth/register`
- API Gateway routes to Auth Service
- Auth Service creates user in MongoDB
- JWT token is returned
- User is logged in automatically

### 2. Create a Transaction

1. After login, go to Dashboard
2. Click "+ Add Transaction"
3. Fill in transaction details
4. Submit

**What happens:**
- Angular sends POST to `http://localhost:8080/api/transactions`
- API Gateway validates JWT token
- Transaction Service saves to MongoDB
- Kafka event is published to `transaction-events` topic
- Analytics Service consumes the event
- Dashboard updates with new transaction

### 3. View Analytics

1. Click "Reports" in sidebar
2. View category breakdown
3. View trend charts

**What happens:**
- Angular sends GET to `http://localhost:8080/api/analytics/*`
- Analytics Service processes data
- Returns insights and visualizations

## 📊 API Documentation

### Swagger UI for Each Service

- **Auth Service:** http://localhost:8081/swagger-ui.html
- **Transaction Service:** http://localhost:8082/swagger-ui.html
- **Analytics Service:** http://localhost:8083/swagger-ui.html

### Key Endpoints via API Gateway

All requests go through `http://localhost:8080/api`

#### Authentication (No JWT required)
```bash
# Register
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "currency": "USD"
}

# Login
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Transactions (JWT required)
```bash
# Get all transactions
GET http://localhost:8080/api/transactions
Authorization: Bearer <your-jwt-token>

# Create transaction
POST http://localhost:8080/api/transactions
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "type": "EXPENSE",
  "category": "Food",
  "amount": 50.00,
  "date": "2025-11-29",
  "description": "Lunch",
  "notes": "Restaurant"
}

# Update transaction
PUT http://localhost:8080/api/transactions/{id}
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "type": "EXPENSE",
  "category": "Food",
  "amount": 55.00,
  "date": "2025-11-29",
  "description": "Lunch (updated)",
  "notes": "Restaurant with tip"
}

# Delete transaction
DELETE http://localhost:8080/api/transactions/{id}
Authorization: Bearer <your-jwt-token>

# Get statistics
GET http://localhost:8080/api/transactions/stats
Authorization: Bearer <your-jwt-token>
```

#### Analytics (JWT required)
```bash
# Category breakdown
GET http://localhost:8080/api/analytics/category-breakdown
Authorization: Bearer <your-jwt-token>

# Trend data (7 days)
GET http://localhost:8080/api/analytics/trends?days=7
Authorization: Bearer <your-jwt-token>

# Financial report
GET http://localhost:8080/api/analytics/report?period=monthly
Authorization: Bearer <your-jwt-token>
```

## 🐛 Troubleshooting

### Issue: Services not showing in Eureka

**Solution:**
1. Wait 60 seconds after starting (registration takes time)
2. Check logs: `docker-compose logs eureka-server`
3. Check logs: `docker-compose logs auth-service`
4. Restart services: `docker-compose restart`

### Issue: 401 Unauthorized errors

**Solution:**
1. Check if JWT token is in localStorage
2. Open browser DevTools → Application → Local Storage
3. Look for `auth_token`
4. Try logging out and logging in again

### Issue: Kafka connection errors

**Solution:**
```bash
# Restart Kafka and dependent services
docker-compose restart kafka
docker-compose restart transaction-service
docker-compose restart analytics-service
```

### Issue: MongoDB connection refused

**Solution:**
```bash
# Check MongoDB is running
docker-compose logs mongodb

# Restart MongoDB
docker-compose restart mongodb

# Restart all services that depend on MongoDB
docker-compose restart auth-service transaction-service analytics-service
```

### Issue: CORS errors in browser

**Solution:**
- API Gateway already has CORS configured for `http://localhost:4200`
- If you changed the Angular port, update `api-gateway/src/main/resources/application.yml`:
```yaml
spring:
  cloud:
    gateway:
      globalcors:
        cors-configurations:
          '[/**]':
            allowed-origins: "http://localhost:YOUR_PORT"
```

## 📈 Monitoring

### View Kafka Topics
```bash
docker exec -it financial-tracker-kafka kafka-topics --list --bootstrap-server localhost:9092
```

### View Kafka Messages
```bash
docker exec -it financial-tracker-kafka kafka-console-consumer \
  --bootstrap-server localhost:9092 \
  --topic transaction-events \
  --from-beginning
```

### View MongoDB Data
```bash
# Connect to MongoDB
docker exec -it financial-tracker-mongodb mongosh

# In mongosh:
use financial-tracker
db.users.find().pretty()
db.transactions.find().pretty()
```

### Service Logs
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f auth-service
docker-compose logs -f transaction-service
docker-compose logs -f analytics-service
```

## 🔄 Development Workflow

### Making Changes to Backend

1. Make code changes
2. Rebuild the service:
```bash
cd backend/[service-name]
mvn clean package
```
3. Restart the service:
```bash
cd ..
docker-compose up -d --build [service-name]
```

### Making Changes to Frontend

Angular has hot-reload enabled. Just save your changes and the browser will auto-refresh.

## 🛑 Stopping Everything

```bash
# Stop all services
cd backend
docker-compose down

# Stop and remove volumes (WARNING: Deletes all data)
docker-compose down -v
```

## ☸️ Kubernetes Deployment (Advanced)

### Build Docker Images
```bash
cd backend

docker build -t financial-tracker/eureka-server:1.0.0 ./eureka-server
docker build -t financial-tracker/api-gateway:1.0.0 ./api-gateway
docker build -t financial-tracker/auth-service:1.0.0 ./auth-service
docker build -t financial-tracker/transaction-service:1.0.0 ./transaction-service
docker build -t financial-tracker/analytics-service:1.0.0 ./analytics-service
```

### Deploy to Kubernetes
```bash
# Apply all configurations
kubectl apply -f k8s/

# Check deployment status
kubectl get pods
kubectl get services

# Get API Gateway external IP
kubectl get service api-gateway

# View logs
kubectl logs -f deployment/auth-service
```

### Access Services in K8s
```bash
# Port forward API Gateway
kubectl port-forward service/api-gateway 8080:8080

# Port forward Eureka
kubectl port-forward service/eureka-server 8761:8761
```

## 🎉 Success Checklist

✅ All Docker containers running (`docker-compose ps`)  
✅ Eureka shows 3 registered services (http://localhost:8761)  
✅ Can access Swagger UIs for all services  
✅ Angular app loads (http://localhost:4200)  
✅ Can register and login  
✅ Can create/edit/delete transactions  
✅ Dashboard shows data and charts  
✅ Kafka messages visible in topic  
✅ MongoDB contains users and transactions  

## 📚 Next Steps

1. **Production Deployment:**
   - Set up production MongoDB cluster
   - Configure production Kafka cluster
   - Add SSL/TLS certificates
   - Set up domain names and DNS

2. **Monitoring & Logging:**
   - Add Prometheus & Grafana
   - Set up ELK Stack (Elasticsearch, Logstash, Kibana)
   - Add distributed tracing (Jaeger/Zipkin)

3. **Security Enhancements:**
   - Add rate limiting
   - Implement refresh tokens
   - Add 2FA authentication
   - Set up API key management

4. **Performance:**
   - Add Redis caching
   - Implement database indexing
   - Set up CDN for frontend
   - Add load testing

## 🆘 Getting Help

If you encounter issues:

1. Check service logs: `docker-compose logs [service-name]`
2. Check Eureka dashboard: http://localhost:8761
3. Test endpoints directly using Swagger UI
4. Check MongoDB data: `docker exec -it financial-tracker-mongodb mongosh`
5. Verify Kafka topics: `docker exec -it financial-tracker-kafka kafka-topics --list --bootstrap-server localhost:9092`

---

**🎯 Your complete Financial Tracker with Microservices is now ready!**
