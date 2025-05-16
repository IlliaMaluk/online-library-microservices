@echo off

REM Frontend
start cmd /k "cd online-library-front && npm run dev"

REM Backend Microservices
start cmd /k "cd online-library-microservices && Start.bat"

pause
