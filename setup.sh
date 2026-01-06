#!/bin/bash

echo "🚀 AI-Guardian Setup Script"
echo "================================================"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check Docker
echo -e "${BLUE}Checking Docker installation...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}Docker not found. Please install Docker first.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker is installed${NC}"

# Check Docker Compose
echo -e "${BLUE}Checking Docker Compose... ${NC}"
if ! command -v docker-compose &> /dev/null; then
    echo -e "${YELLOW}Docker Compose not found. Please install Docker Compose.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker Compose is installed${NC}"

# Clone/setup backend requirements
echo -e "${BLUE}Setting up backend... ${NC}"
pip install -r backend/requirements.txt

# Setup frontend
echo -e "${BLUE}Setting up frontend...${NC}"
cd frontend
npm install
cd ..

# Build and run Docker containers
echo -e "${BLUE}Building Docker images...${NC}"
docker-compose build

echo ""
echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}✓ Setup completed successfully!${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""
echo -e "${BLUE}To start the application:${NC}"
echo -e "${YELLOW}docker-compose up${NC}"
echo ""
echo -e "${BLUE}Then open your browser: ${NC}"
echo -e "${YELLOW}Frontend: http://localhost:3000${NC}"
echo -e "${YELLOW}Backend API: http://localhost:8000${NC}"
echo -e "${YELLOW}API Docs: http://localhost:8000/docs${NC}"
