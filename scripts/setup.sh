#!/bin/bash

# AFFILIMART Project Setup Script
# This script sets up the entire development environment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check system requirements
check_requirements() {
    print_status "Checking system requirements..."
    
    local missing_deps=()
    
    # Check Node.js
    if ! command_exists node; then
        missing_deps+=("Node.js")
    else
        NODE_VERSION=$(node --version)
        print_success "Node.js found: $NODE_VERSION"
    fi
    
    # Check npm
    if ! command_exists npm; then
        missing_deps+=("npm")
    else
        NPM_VERSION=$(npm --version)
        print_success "npm found: $NPM_VERSION"
    fi
    
    # Check Docker
    if ! command_exists docker; then
        missing_deps+=("Docker")
    else
        DOCKER_VERSION=$(docker --version)
        print_success "Docker found: $DOCKER_VERSION"
    fi
    
    # Check Docker Compose
    if ! command_exists docker-compose; then
        missing_deps+=("Docker Compose")
    else
        COMPOSE_VERSION=$(docker-compose --version)
        print_success "Docker Compose found: $COMPOSE_VERSION"
    fi
    
    # Check Git
    if ! command_exists git; then
        missing_deps+=("Git")
    else
        GIT_VERSION=$(git --version)
        print_success "Git found: $GIT_VERSION"
    fi
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        print_error "Missing dependencies: ${missing_deps[*]}"
        print_status "Please install the missing dependencies and run this script again."
        exit 1
    fi
    
    print_success "All system requirements met!"
}

# Function to create environment files
setup_environment() {
    print_status "Setting up environment files..."
    
    # Copy .env.example to .env if it doesn't exist
    if [ ! -f .env ]; then
        cp .env.example .env
        print_success "Created .env file from .env.example"
    else
        print_warning ".env file already exists, skipping..."
    fi
    
    # Create backend .env
    if [ ! -f backend/.env ]; then
        cp backend/.env.example backend/.env 2>/dev/null || cp .env.example backend/.env
        print_success "Created backend/.env file"
    else
        print_warning "backend/.env file already exists, skipping..."
    fi
    
    # Create frontend .env.local
    if [ ! -f frontend/.env.local ]; then
        cp frontend/.env.example frontend/.env.local 2>/dev/null || echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > frontend/.env.local
        print_success "Created frontend/.env.local file"
    else
        print_warning "frontend/.env.local file already exists, skipping..."
    fi
}

# Function to install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Install root dependencies
    print_status "Installing root dependencies..."
    npm install
    
    # Install backend dependencies
    print_status "Installing backend dependencies..."
    cd backend
    npm install
    cd ..
    
    # Install frontend dependencies
    print_status "Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
    
    print_success "All dependencies installed successfully!"
}

# Function to setup database
setup_database() {
    print_status "Setting up database..."
    
    # Start database services
    print_status "Starting database services..."
    docker-compose up -d postgres redis mongodb elasticsearch
    
    # Wait for databases to be ready
    print_status "Waiting for databases to be ready..."
    sleep 10
    
    # Run database migrations
    print_status "Running database migrations..."
    cd backend
    npm run db:migrate
    cd ..
    
    # Run database seeds
    print_status "Running database seeds..."
    cd backend
    npm run db:seed
    cd ..
    
    print_success "Database setup completed!"
}

# Function to build Docker images
build_docker_images() {
    print_status "Building Docker images..."
    
    # Build backend image
    print_status "Building backend Docker image..."
    docker-compose build backend
    
    # Build frontend image
    print_status "Building frontend Docker image..."
    docker-compose build frontend
    
    print_success "Docker images built successfully!"
}

# Function to start development environment
start_development() {
    print_status "Starting development environment..."
    
    # Start all services
    docker-compose up -d
    
    print_success "Development environment started!"
    print_status "Services available at:"
    echo "  - Frontend: http://localhost:3000"
    echo "  - Backend API: http://localhost:8000"
    echo "  - Database Admin: http://localhost:8080"
    echo "  - Redis Commander: http://localhost:8081"
    echo "  - Elasticsearch Head: http://localhost:9100"
    echo "  - Grafana: http://localhost:3001"
    echo "  - Prometheus: http://localhost:9090"
    echo "  - Mailhog: http://localhost:8025"
    echo "  - MinIO Console: http://localhost:9001"
}

# Function to setup Git hooks
setup_git_hooks() {
    print_status "Setting up Git hooks..."
    
    # Install husky
    npm run prepare
    
    print_success "Git hooks setup completed!"
}

# Function to run initial tests
run_tests() {
    print_status "Running initial tests..."
    
    # Run backend tests
    print_status "Running backend tests..."
    cd backend
    npm test
    cd ..
    
    # Run frontend tests
    print_status "Running frontend tests..."
    cd frontend
    npm test
    cd ..
    
    print_success "All tests passed!"
}

# Function to display final instructions
show_final_instructions() {
    echo ""
    echo "🎉 AFFILIMART setup completed successfully!"
    echo ""
    echo "📋 Next steps:"
    echo "  1. Update environment variables in .env files if needed"
    echo "  2. Start development servers: npm run dev"
    echo "  3. Access the application at http://localhost:3000"
    echo ""
    echo "🔧 Development commands:"
    echo "  - npm run dev          # Start all development servers"
    echo "  - npm run build        # Build all applications"
    echo "  - npm run test         # Run all tests"
    echo "  - npm run lint         # Run linting"
    echo "  - docker-compose up    # Start all services"
    echo "  - docker-compose down  # Stop all services"
    echo ""
    echo "📚 Documentation:"
    echo "  - README.md            # Project overview"
    echo "  - docs/                # Detailed documentation"
    echo ""
    echo "🚀 Happy coding!"
}

# Main setup function
main() {
    echo "🚀 AFFILIMART Project Setup"
    echo "=========================="
    echo ""
    
    # Check system requirements
    check_requirements
    
    # Setup environment files
    setup_environment
    
    # Install dependencies
    install_dependencies
    
    # Setup Git hooks
    setup_git_hooks
    
    # Setup database
    setup_database
    
    # Build Docker images
    build_docker_images
    
    # Start development environment
    start_development
    
    # Run initial tests
    run_tests
    
    # Show final instructions
    show_final_instructions
}

# Handle script arguments
case "${1:-}" in
    --help|-h)
        echo "Usage: $0 [OPTION]"
        echo ""
        echo "Options:"
        echo "  --help, -h     Show this help message"
        echo "  --skip-docker  Skip Docker setup"
        echo "  --skip-tests   Skip running tests"
        echo ""
        echo "This script sets up the complete AFFILIMART development environment."
        exit 0
        ;;
    --skip-docker)
        print_warning "Skipping Docker setup..."
        SKIP_DOCKER=true
        ;;
    --skip-tests)
        print_warning "Skipping tests..."
        SKIP_TESTS=true
        ;;
    "")
        # No arguments, run full setup
        ;;
    *)
        print_error "Unknown option: $1"
        echo "Use --help for usage information."
        exit 1
        ;;
esac

# Run main setup
main 