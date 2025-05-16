@echo off

REM User Service
start cmd /k "cd user-service && npm run start:dev"

REM Book Service
start cmd /k "cd book-service && npm run start:dev"

REM Reading Service
start cmd /k "cd reading-service && npm run start:dev"

REM API Gateway
start cmd /k "cd api-gateway && npm run start:dev"

pause
