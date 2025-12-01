#!/bin/bash

# Build script for all microservices

echo "🏗️  Building Financial Tracker Microservices..."
echo "================================================"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to build a service
build_service() {
    local service_name=$1
    echo ""
    echo "📦 Building $service_name..."
    cd $service_name
    
    if mvn clean package -DskipTests; then
        echo -e "${GREEN}✅ $service_name built successfully${NC}"
    else
        echo -e "${RED}❌ Failed to build $service_name${NC}"
        exit 1
    fi
    
    cd ..
}

# Build all services
build_service "eureka-server"
build_service "api-gateway"
build_service "auth-service"
build_service "transaction-service"
build_service "analytics-service"

echo ""
echo "================================================"
echo -e "${GREEN}✅ All services built successfully!${NC}"
echo ""
echo "Next steps:"
echo "1. Run: docker-compose up -d"
echo "2. Or start services individually with: cd [service-name] && mvn spring-boot:run"
echo ""
