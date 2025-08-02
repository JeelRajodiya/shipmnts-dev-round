@echo off
echo Starting MongoDB using Docker...

REM Check if container exists and start it, otherwise create new one
echo Checking for existing MongoDB container...
docker start mongodb-shipmnts 2>nul
if %errorlevel% equ 0 (
    echo Existing MongoDB container started successfully.
) else (
    echo Container doesn't exist or failed to start. Creating new container...
    
    REM Pull the latest MongoDB image
    docker pull mongo:latest
    
    REM Create a Docker volume for persistent MongoDB data (if it doesn't exist)
    docker volume create mongodb-shipmnts-data 2>nul
    
    REM Run MongoDB container with port mapping and volume mount for data persistence
    docker run -d --name mongodb-shipmnts -p 27017:27017 -v mongodb-shipmnts-data:/data/db -e MONGO_INITDB_DATABASE=shipmnts mongo:latest
)

echo MongoDB is now running on localhost:27017
echo Database: shipmnts
echo Container name: mongodb-shipmnts
echo Data volume: mongodb-shipmnts-data
echo.
echo To stop the container, run: docker stop mongodb-shipmnts
echo To remove the container, run: docker rm mongodb-shipmnts
echo To remove the data volume, run: docker volume rm mongodb-shipmnts-data