# 🏦 Financial Tracker - Complete Full-Stack Application

## 📋 Project Overview

A modern, production-ready financial management system built with **Angular 21** frontend and **Spring Boot microservices** backend. The application features a beautiful user interface, real-time data synchronization, and a scalable microservices architecture.

## ✨ Key Features

### Frontend (Angular 21)
- ✅ **Modern UI/UX** - Clean, gradient-based design with smooth animations
- ✅ **User Authentication** - Secure login/registration with JWT
- ✅ **Transaction Management** - Full CRUD operations for income/expenses
- ✅ **Budget Planning** - Create and track budgets with visual progress
- ✅ **Interactive Dashboard** - Real-time charts using Chart.js
- ✅ **Category Management** - 15+ pre-configured categories with icons
- ✅ **Reports & Analytics** - Detailed financial insights
- ✅ **Notifications** - Real-time budget alerts and activity logging
- ✅ **Data Export** - Export to CSV functionality
- ✅ **Responsive Design** - Mobile-first, works on all devices

### Backend (Spring Boot Microservices)
- ✅ **Microservices Architecture** - 5 independent, scalable services
- ✅ **Service Discovery** - Eureka Server for dynamic service registration
- ✅ **API Gateway** - Single entry point with JWT authentication
- ✅ **MongoDB Integration** - NoSQL database for flexible data storage
- ✅ **Kafka Integration** - Asynchronous event streaming
- ✅ **RESTful APIs** - Well-documented with Swagger/OpenAPI
- ✅ **JWT Security** - Token-based authentication & authorization
- ✅ **Docker Support** - Containerized deployment
- ✅ **Kubernetes Ready** - Production-grade orchestration configs
- ✅ **Real-time Updates** - Event-driven architecture

## 🏗️ Architecture

### System Architecture
```
┌─────────────────────────────────────┐
│       Angular Frontend (4200)       │
│   - Dashboard with Charts           │
│   - Transaction Management          │
│   - Budget Tracking                 │
│   - User Authentication             │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│    API Gateway (8080)                │
│   - JWT Authentication Filter       │
│   - Request Routing                 │
│   - CORS Configuration              │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│    Eureka Server (8761)              │
│   - Service Discovery               │
│   - Health Monitoring               │
│   - Load Balancing                  │
└──────────────┬──────────────────────┘
               │
    ┌──────────┼──────────┐
    │          │          │
    ▼          ▼          ▼
┌────────┐ ┌────────┐ ┌────────┐
│ Auth   │ │Trans-  │ │Analytics│
│Service │ │action  │ │Service │
│ (8081) │ │Service │ │ (8083) │
│        │ │ (8082) │ │        │
│MongoDB │ │MongoDB │ │MongoDB │
│        │ │ Kafka  │ │ Kafka  │
└────────┘ └────────┘ └────────┘
```

### Technology Stack

**Frontend:**
- Angular 21 (Standalone Components)
- TypeScript 5.9
- RxJS Observables & Signals
- Chart.js & ng2-charts
- Angular Material & CDK
- Custom CSS with modern design patterns

**Backend:**
- Spring Boot 3.2.0
- Spring Cloud 2023.0.0
- Spring Cloud Gateway
- Netflix Eureka
- MongoDB 7.0
- Apache Kafka 7.5.0
- JWT Authentication (JJWT 0.11.5)
- Swagger/OpenAPI 3.0
- Maven

**DevOps:**
- Docker & Docker Compose
- Kubernetes
- Zookeeper

## 📁 Project Structure

```
tracker-vs/
├── src/                          # Angular Frontend
│   ├── app/
│   │   ├── components/
│   │   │   ├── auth/            # Login & Registration
│   │   │   ├── dashboard/        # Main Dashboard
│   │   │   ├── transactions/     # Transaction Management
│   │   │   ├── budgets/          # Budget Planning
│   │   │   └── layout/           # Header, Sidebar, Layout
│   │   ├── models/               # TypeScript Interfaces
│   │   ├── services/             # API Services
│   │   ├── interceptors/         # HTTP Interceptors
│   │   └── guards/               # Route Guards
│   └── styles.css                # Global Styles
│
├── backend/                      # Spring Boot Backend
│   ├── eureka-server/            # Service Discovery (8761)
│   │   ├── src/
│   │   ├── pom.xml
│   │   └── Dockerfile
│   │
│   ├── api-gateway/              # API Gateway (8080)
│   │   ├── src/
│   │   │   └── main/java/com/financialtracker/gateway/
│   │   │       ├── ApiGatewayApplication.java
│   │   │       └── filter/JwtAuthenticationFilter.java
│   │   ├── pom.xml
│   │   └── Dockerfile
│   │
│   ├── auth-service/             # Authentication (8081)
│   │   ├── src/main/java/com/financialtracker/auth/
│   │   │   ├── controller/      # REST Controllers
│   │   │   ├── service/         # Business Logic
│   │   │   ├── repository/      # MongoDB Repositories
│   │   │   ├── model/           # Domain Models
│   │   │   └── dto/             # Data Transfer Objects
│   │   ├── pom.xml
│   │   └── Dockerfile
│   │
│   ├── transaction-service/      # Transactions (8082)
│   │   ├── src/main/java/com/financialtracker/transaction/
│   │   │   ├── controller/
│   │   │   ├── service/
│   │   │   ├── repository/
│   │   │   ├── model/
│   │   │   ├── dto/
│   │   │   └── kafka/           # Kafka Producer
│   │   ├── pom.xml
│   │   └── Dockerfile
│   │
│   ├── analytics-service/        # Analytics (8083)
│   │   ├── src/main/java/com/financialtracker/analytics/
│   │   │   ├── controller/
│   │   │   ├── service/
│   │   │   ├── repository/
│   │   │   ├── model/
│   │   │   ├── dto/
│   │   │   └── kafka/           # Kafka Consumer
│   │   ├── pom.xml
│   │   └── Dockerfile
│   │
│   ├── k8s/                      # Kubernetes Configurations
│   │   ├── configmap.yaml
│   │   ├── mongodb-deployment.yaml
│   │   ├── kafka-deployment.yaml
│   │   ├── eureka-deployment.yaml
│   │   ├── api-gateway-deployment.yaml
│   │   ├── auth-service-deployment.yaml
│   │   ├── transaction-service-deployment.yaml
│   │   └── analytics-service-deployment.yaml
│   │
│   ├── docker-compose.yml        # Docker Compose Configuration
│   ├── build-all.bat             # Build Script (Windows)
│   ├── build-all.sh              # Build Script (Linux/Mac)
│   └── README.md                 # Backend Documentation
│
├── start-backend.bat             # Quick Start (Windows)
├── start-backend.sh              # Quick Start (Linux/Mac)
├── DEPLOYMENT_GUIDE.md           # Complete Deployment Guide
├── README.md                     # Project Documentation
└── package.json                  # Node Dependencies
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Java 17
- Maven 3.8+
- Docker Desktop

### 1. Start Backend (Easiest Way)

**Windows:**
```bash
.\start-backend.bat
```

**Linux/Mac:**
```bash
chmod +x start-backend.sh
./start-backend.sh
```

This will:
- Build all Spring Boot services
- Start MongoDB, Kafka, Zookeeper
- Start all microservices in Docker containers
- Display service URLs

### 2. Start Frontend

```bash
npm install
npm start
```

Frontend: http://localhost:4200

### 3. Verify Everything is Running

- **Frontend:** http://localhost:4200
- **Eureka Dashboard:** http://localhost:8761
- **API Gateway:** http://localhost:8080
- **Swagger Docs:**
  - Auth: http://localhost:8081/swagger-ui.html
  - Transactions: http://localhost:8082/swagger-ui.html
  - Analytics: http://localhost:8083/swagger-ui.html

## 📊 API Endpoints

### Authentication (Public)
```
POST /api/auth/register - Register new user
POST /api/auth/login    - Login user
```

### User Profile (Protected)
```
GET  /api/auth/profile  - Get user profile
PUT  /api/auth/profile  - Update profile
```

### Transactions (Protected)
```
GET    /api/transactions              - Get all transactions
GET    /api/transactions/type/{type}  - Filter by type
GET    /api/transactions/stats        - Get statistics
POST   /api/transactions              - Create transaction
PUT    /api/transactions/{id}         - Update transaction
DELETE /api/transactions/{id}         - Delete transaction
```

### Analytics (Protected)
```
GET /api/analytics/category-breakdown - Category analysis
GET /api/analytics/trends?days=7      - Trend data
GET /api/analytics/report?period=monthly - Financial report
```

## 🔒 Security

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - BCrypt encryption
- **API Gateway Filter** - Validates all requests
- **CORS Configuration** - Controlled access
- **HTTP-Only Cookies** - Token storage (optional)

## 🐳 Docker Deployment

```bash
# Start all services
cd backend
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

## ☸️ Kubernetes Deployment

```bash
# Build images
docker build -t financial-tracker/eureka-server:1.0.0 ./backend/eureka-server
docker build -t financial-tracker/api-gateway:1.0.0 ./backend/api-gateway
docker build -t financial-tracker/auth-service:1.0.0 ./backend/auth-service
docker build -t financial-tracker/transaction-service:1.0.0 ./backend/transaction-service
docker build -t financial-tracker/analytics-service:1.0.0 ./backend/analytics-service

# Deploy to K8s
kubectl apply -f backend/k8s/

# Check status
kubectl get pods
kubectl get services
```

## 📈 Monitoring

### Eureka Dashboard
- View all registered services
- Check health status
- Monitor instances

### Kafka Topics
```bash
# List topics
docker exec -it financial-tracker-kafka kafka-topics --list --bootstrap-server localhost:9092

# View messages
docker exec -it financial-tracker-kafka kafka-console-consumer \
  --bootstrap-server localhost:9092 \
  --topic transaction-events \
  --from-beginning
```

### MongoDB
```bash
# Connect
docker exec -it financial-tracker-mongodb mongosh

# View data
use financial-tracker
db.users.find().pretty()
db.transactions.find().pretty()
```

## 🧪 Testing

### Manual Testing
1. Register a new user
2. Login with credentials
3. Create transactions
4. View dashboard updates
5. Check analytics
6. Export data to CSV

### API Testing with Swagger
- Use Swagger UI for each service
- Test all endpoints
- View request/response schemas

## 🎯 Features Implemented

### ✅ Frontend Features
- [x] User authentication (login/register)
- [x] Dashboard with statistics cards
- [x] Chart.js visualizations (line & doughnut charts)
- [x] Transaction CRUD with modal forms
- [x] Budget management with progress tracking
- [x] Category system with icons and colors
- [x] Notifications dropdown
- [x] Sidebar navigation
- [x] Responsive design
- [x] CSV export functionality
- [x] HTTP interceptor for JWT

### ✅ Backend Features
- [x] Eureka service discovery
- [x] API Gateway with routing
- [x] JWT authentication filter
- [x] User registration & login
- [x] Transaction CRUD operations
- [x] MongoDB integration
- [x] Kafka event streaming
- [x] Category breakdown analytics
- [x] Trend analysis
- [x] Financial reports
- [x] Swagger API documentation
- [x] Docker containerization
- [x] Kubernetes configurations

## 🔮 Future Enhancements

- [ ] Budget alerts via email/SMS
- [ ] Recurring transactions
- [ ] Multi-currency support
- [ ] Financial goals tracking
- [ ] AI-powered insights
- [ ] Mobile app (React Native)
- [ ] Bank account integration
- [ ] Receipt scanning (OCR)
- [ ] Social features (shared budgets)
- [ ] Advanced reporting (PDF export)
- [ ] Two-factor authentication
- [ ] Role-based access control
- [ ] Audit logging
- [ ] Rate limiting
- [ ] Circuit breaker pattern
- [ ] Distributed tracing
- [ ] Centralized logging (ELK)
- [ ] Monitoring (Prometheus + Grafana)

## 📄 Documentation

- **DEPLOYMENT_GUIDE.md** - Complete deployment instructions
- **backend/README.md** - Backend architecture details
- **README.md** (frontend root) - Frontend documentation

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

- **Your Name** - Full-Stack Development

## 🙏 Acknowledgments

- Spring Boot & Spring Cloud community
- Angular team
- Chart.js maintainers
- MongoDB team
- Apache Kafka community

---

**Built with ❤️ using Angular 21 & Spring Boot Microservices**

🌟 **Star this repo if you find it helpful!**
