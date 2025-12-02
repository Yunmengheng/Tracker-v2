# Docker Compose Usage

## Start all services
```bash
docker-compose up -d
```

## View logs
```bash
docker-compose logs -f
```

## Stop all services
```bash
docker-compose down
```

## Rebuild after code changes
```bash
docker-compose up -d --build
```

## Services
- MongoDB: localhost:27017
- Backend API: localhost:3000
- Frontend: Run separately with `npm start` (localhost:4200)

## Clean up (including volumes)
```bash
docker-compose down -v
```
