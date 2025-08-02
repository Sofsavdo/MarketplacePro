# AFFILIMART Development Environment Setup Script for Windows
# This script automates the setup of the entire development environment

param(
    [switch]$SkipDocker,
    [switch]$SkipTests,
    [switch]$Help
)

if ($Help) {
    Write-Host @"
AFFILIMART Development Environment Setup Script

Usage: .\setup.ps1 [options]

Options:
    -SkipDocker    Skip Docker setup and image building
    -SkipTests     Skip running tests after setup
    -Help          Show this help message

Examples:
    .\setup.ps1                    # Full setup
    .\setup.ps1 -SkipDocker        # Setup without Docker
    .\setup.ps1 -SkipTests         # Setup without running tests
"@
    exit 0
}

# Colors for output
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"
$Blue = "Blue"
$Cyan = "Cyan"

function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

function Write-Success {
    param([string]$Message)
    Write-ColorOutput "✓ $Message" $Green
}

function Write-Error {
    param([string]$Message)
    Write-ColorOutput "✗ $Message" $Red
}

function Write-Warning {
    param([string]$Message)
    Write-ColorOutput "⚠ $Message" $Yellow
}

function Write-Info {
    param([string]$Message)
    Write-ColorOutput "ℹ $Message" $Blue
}

function Write-Step {
    param([string]$Message)
    Write-ColorOutput "`n🔧 $Message" $Cyan
}

# Check requirements
function Check-Requirements {
    Write-Step "Checking system requirements..."
    
    $requirements = @{
        "Node.js" = "node"
        "npm" = "npm"
        "Git" = "git"
    }
    
    if (-not $SkipDocker) {
        $requirements["Docker"] = "docker"
        $requirements["Docker Compose"] = "docker-compose"
    }
    
    $missing = @()
    
    foreach ($req in $requirements.GetEnumerator()) {
        try {
            $null = Get-Command $req.Value -ErrorAction Stop
            Write-Success "$($req.Key) is installed"
        }
        catch {
            Write-Error "$($req.Key) is not installed or not in PATH"
            $missing += $req.Key
        }
    }
    
    if ($missing.Count -gt 0) {
        Write-Error "Missing requirements: $($missing -join ', ')"
        Write-Info "Please install the missing requirements and run this script again."
        exit 1
    }
    
    # Check Node.js version
    $nodeVersion = node --version
    Write-Info "Node.js version: $nodeVersion"
    
    # Check npm version
    $npmVersion = npm --version
    Write-Info "npm version: $npmVersion"
    
    if (-not $SkipDocker) {
        # Check Docker version
        $dockerVersion = docker --version
        Write-Info "Docker version: $dockerVersion"
        
        # Check Docker Compose version
        $composeVersion = docker-compose --version
        Write-Info "Docker Compose version: $composeVersion"
    }
}

# Setup environment files
function Setup-Environment {
    Write-Step "Setting up environment files..."
    
    $envFiles = @(
        @{ Source = "env.example"; Destination = ".env" },
        @{ Source = "backend/env.example"; Destination = "backend/.env" },
        @{ Source = "frontend/env.example"; Destination = "frontend/.env" }
    )
    
    foreach ($envFile in $envFiles) {
        if (Test-Path $envFile.Source) {
            if (-not (Test-Path $envFile.Destination)) {
                Copy-Item $envFile.Source $envFile.Destination
                Write-Success "Created $($envFile.Destination)"
            } else {
                Write-Warning "$($envFile.Destination) already exists, skipping..."
            }
        } else {
            Write-Warning "$($envFile.Source) not found, skipping..."
        }
    }
}

# Install dependencies
function Install-Dependencies {
    Write-Step "Installing dependencies..."
    
    # Root dependencies
    Write-Info "Installing root dependencies..."
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Root dependencies installed"
    } else {
        Write-Error "Failed to install root dependencies"
        exit 1
    }
    
    # Backend dependencies
    Write-Info "Installing backend dependencies..."
    Set-Location backend
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Backend dependencies installed"
    } else {
        Write-Error "Failed to install backend dependencies"
        exit 1
    }
    Set-Location ..
    
    # Frontend dependencies
    Write-Info "Installing frontend dependencies..."
    Set-Location frontend
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Frontend dependencies installed"
    } else {
        Write-Error "Failed to install frontend dependencies"
        exit 1
    }
    Set-Location ..
}

# Setup Git hooks
function Setup-GitHooks {
    Write-Step "Setting up Git hooks..."
    
    try {
        npm run prepare
        Write-Success "Git hooks configured"
    }
    catch {
        Write-Warning "Failed to setup Git hooks: $($_.Exception.Message)"
    }
}

# Setup database
function Setup-Database {
    if ($SkipDocker) {
        Write-Warning "Skipping database setup (Docker disabled)"
        return
    }
    
    Write-Step "Setting up database..."
    
    # Start database services
    Write-Info "Starting database services..."
    docker-compose up -d postgres redis mongodb elasticsearch
    
    # Wait for services to be ready
    Write-Info "Waiting for database services to be ready..."
    Start-Sleep -Seconds 10
    
    # Run migrations
    Write-Info "Running database migrations..."
    Set-Location backend
    npm run migrate
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Database migrations completed"
    } else {
        Write-Error "Failed to run database migrations"
    }
    
    # Run seeds
    Write-Info "Running database seeds..."
    npm run seed
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Database seeds completed"
    } else {
        Write-Error "Failed to run database seeds"
    }
    Set-Location ..
}

# Build Docker images
function Build-DockerImages {
    if ($SkipDocker) {
        Write-Warning "Skipping Docker image building (Docker disabled)"
        return
    }
    
    Write-Step "Building Docker images..."
    
    # Build backend image
    Write-Info "Building backend Docker image..."
    docker-compose build backend
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Backend Docker image built"
    } else {
        Write-Error "Failed to build backend Docker image"
    }
    
    # Build frontend image
    Write-Info "Building frontend Docker image..."
    docker-compose build frontend
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Frontend Docker image built"
    } else {
        Write-Error "Failed to build frontend Docker image"
    }
}

# Start development environment
function Start-Development {
    Write-Step "Starting development environment..."
    
    if ($SkipDocker) {
        Write-Info "Starting services without Docker..."
        
        # Start backend
        Write-Info "Starting backend server..."
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev" -WindowStyle Normal
        
        # Start frontend
        Write-Info "Starting frontend server..."
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev" -WindowStyle Normal
        
        Write-Success "Development servers started in separate windows"
    } else {
        Write-Info "Starting all services with Docker Compose..."
        docker-compose up -d
        
        if ($LASTEXITCODE -eq 0) {
            Write-Success "All services started successfully"
        } else {
            Write-Error "Failed to start services"
        }
    }
}

# Run tests
function Run-Tests {
    if ($SkipTests) {
        Write-Warning "Skipping tests (--skip-tests flag used)"
        return
    }
    
    Write-Step "Running tests..."
    
    # Backend tests
    Write-Info "Running backend tests..."
    Set-Location backend
    npm test
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Backend tests passed"
    } else {
        Write-Error "Backend tests failed"
    }
    Set-Location ..
    
    # Frontend tests
    Write-Info "Running frontend tests..."
    Set-Location frontend
    npm test
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Frontend tests passed"
    } else {
        Write-Error "Frontend tests failed"
    }
    Set-Location ..
}

# Show final instructions
function Show-FinalInstructions {
    Write-Step "Setup completed successfully!"
    
    Write-ColorOutput @"

🎉 AFFILIMART Development Environment Setup Complete!

Next Steps:
"@ $Green
    
    if ($SkipDocker) {
        Write-ColorOutput @"
1. Backend server should be running on: http://localhost:3001
2. Frontend server should be running on: http://localhost:3000
3. API documentation: http://localhost:3001/api/docs
"@ $Blue
    } else {
        Write-ColorOutput @"
1. Frontend: http://localhost:3000
2. Backend API: http://localhost:3001
3. API Documentation: http://localhost:3001/api/docs
4. Adminer (Database): http://localhost:8080
5. Redis Commander: http://localhost:8081
6. Elasticsearch Head: http://localhost:8082
7. MailHog (Email): http://localhost:8025
8. MinIO Console: http://localhost:9001
9. Prometheus: http://localhost:9090
10. Grafana: http://localhost:3002

Useful Commands:
- View logs: docker-compose logs -f [service-name]
- Stop services: docker-compose down
- Restart services: docker-compose restart
- Update services: docker-compose pull && docker-compose up -d
"@ $Blue
    }
    
    Write-ColorOutput @"

Development Commands:
- Backend dev: cd backend && npm run dev
- Frontend dev: cd frontend && npm run dev
- Run tests: npm test (in respective directories)
- Lint code: npm run lint (in respective directories)
- Build for production: npm run build (in respective directories)

Documentation:
- README.md: Project overview and setup instructions
- docs/: Detailed documentation
- API docs: http://localhost:3001/api/docs

Happy coding! 🚀
"@ $Cyan
}

# Main execution
try {
    Write-ColorOutput "🚀 AFFILIMART Development Environment Setup" $Cyan
    Write-ColorOutput "=============================================" $Cyan
    
    Check-Requirements
    Setup-Environment
    Install-Dependencies
    Setup-GitHooks
    Setup-Database
    Build-DockerImages
    Start-Development
    Run-Tests
    Show-FinalInstructions
    
    Write-ColorOutput "`n✅ Setup completed successfully!" $Green
}
catch {
    Write-Error "Setup failed: $($_.Exception.Message)"
    exit 1
} 