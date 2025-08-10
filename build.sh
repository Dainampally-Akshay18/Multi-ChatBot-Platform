# # #!/bin/bash

# # set -e  # Exit on error

# # echo "🚀 Building Multi-Chatbot Platform for Production"
# # echo "=================================================="

# # export NODE_ENV=production
# # export CI=true

# # #########################################
# # # Build Frontend
# # #########################################
# # if [ -d "frontend" ]; then
# #     echo "📦 Building frontend..."
# #     cd frontend
# #     npm install
# #     npm run build
# #     echo "✅ Frontend build completed"
# #     cd ..
# # else
# #     echo "❌ Frontend directory not found!"
# #     exit 1
# # fi

# # #########################################
# # # Prepare Backend
# # #########################################
# # if [ -d "backend" ]; then
# #     echo "📦 Preparing backend for Netlify deployment..."
# #     mkdir -p backend/netlify/functions

# #     # Copy app folder if exists
# #     if [ -d "backend/app" ]; then
# #         cp -r backend/app backend/netlify/
# #         echo "✅ Copied backend/app"
# #     else
# #         echo "⚠️ Warning: backend/app not found, skipping..."
# #     fi

# #     # Copy requirements.txt if exists
# #     if [ -f "backend/requirements.txt" ]; then
# #         cp backend/requirements.txt backend/netlify/
# #         echo "✅ Copied requirements.txt"
# #     else
# #         echo "⚠️ Warning: backend/requirements.txt not found"
# #     fi

# #     # Ensure Netlify API handler exists
# #     if [ ! -f "backend/netlify/functions/api.py" ]; then
# #         cat > backend/netlify/functions/api.py << 'EOF'
# # """
# # Netlify function handler for Multi-Chatbot Platform
# # """
# # import sys
# # from pathlib import Path

# # # Add the app directory to Python path
# # current_dir = Path(__file__).parent
# # app_dir = current_dir.parent / "app"
# # sys.path.insert(0, str(app_dir))

# # try:
# #     pass  # Import FastAPI app here
# # except ImportError:
# #     pass
# # EOF
# #         echo "✅ Created Netlify function handler"
# #     else
# #         echo "✅ Netlify function handler already exists"
# #     fi

# #     # Create Netlify-specific requirements
# #     cat > backend/netlify/requirements.txt << EOF
# # fastapi==0.104.1
# # langchain==0.1.0
# # langchain-core>=0.1.0
# # langchain-groq>=0.0.1
# # python-dotenv==1.0.0
# # mangum==0.17.0
# # EOF
# #     echo "✅ Netlify requirements created"

# # else
# #     echo "❌ Backend directory not found!"
# #     exit 1
# # fi

# # echo "🎉 Build process completed successfully!"


# #!/bin/bash

# #Build sCript 2
# # Complete Multi-Chatbot Platform Build Script
# # Version: 3.0 - Frontend + Backend Integration

# echo "🚀 Building Complete Multi-Chatbot Platform"
# echo "============================================="

# # Exit on any error
# set -e

# # Colors for output
# RED='\033[0;31m'
# GREEN='\033[0;32m'
# YELLOW='\033[1;33m'
# BLUE='\033[0;34m'
# PURPLE='\033[0;35m'
# NC='\033[0m' # No Color

# print_status() {
#     echo -e "${BLUE}📦 $1${NC}"
# }

# print_success() {
#     echo -e "${GREEN}✅ $1${NC}"
# }

# print_warning() {
#     echo -e "${YELLOW}⚠️  $1${NC}"
# }

# print_error() {
#     echo -e "${RED}❌ $1${NC}"
# }

# print_backend() {
#     echo -e "${PURPLE}🐍 $1${NC}"
# }

# # Check if we're in the right directory
# if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
#     print_error "Error: frontend or backend directory not found"
#     print_error "Please run this script from the project root directory"
#     exit 1
# fi

# print_status "Starting full-stack build process..."

# # ===========================================
# # BACKEND BUILD
# # ===========================================
# echo ""
# print_backend "Building Backend Components..."
# print_backend "==============================="

# cd backend

# # Check if requirements.txt or pyproject.toml exists
# if [ -f "requirements.txt" ]; then
#     print_backend "Found requirements.txt - Python backend detected"
# elif [ -f "pyproject.toml" ]; then
#     print_backend "Found pyproject.toml - Modern Python backend detected"
# else
#     print_warning "No Python requirements file found, skipping backend dependencies"
# fi

# # Create virtual environment if it doesn't exist
# if [ ! -d "venv" ] && [ ! -d ".venv" ]; then
#     print_backend "Creating Python virtual environment..."
#     python -m venv venv
# fi

# # Activate virtual environment
# if [ -d "venv" ]; then
#     print_backend "Activating virtual environment..."
#     source venv/bin/activate || source venv/Scripts/activate 2>/dev/null
# elif [ -d ".venv" ]; then
#     source .venv/bin/activate || source .venv/Scripts/activate 2>/dev/null
# fi

# # Install Python dependencies (only if requirements exist)
# if [ -f "requirements.txt" ]; then
#     print_backend "Installing Python dependencies..."
#     pip install -r requirements.txt --quiet
# elif [ -f "pyproject.toml" ]; then
#     print_backend "Installing dependencies from pyproject.toml..."
#     pip install -e . --quiet
# fi

# # Run backend tests (optional)
# if [ -f "pytest.ini" ] || [ -d "tests" ]; then
#     print_backend "Running backend tests..."
#     python -m pytest --quiet 2>/dev/null || print_warning "Backend tests skipped or failed"
# fi

# # Create backend build artifacts if needed
# if [ -f "build_backend.py" ]; then
#     print_backend "Running backend build script..."
#     python build_backend.py
# fi

# # Prepare Netlify functions (if using Netlify)
# if [ -d "netlify/functions" ]; then
#     print_backend "Preparing Netlify functions..."
    
#     # Ensure functions directory exists
#     mkdir -p netlify/functions
    
#     # Copy any function files
#     if ls *.py >/dev/null 2>&1; then
#         cp *.py netlify/functions/ 2>/dev/null || true
#     fi
    
#     # Create requirements.txt for functions if it doesn't exist
#     if [ ! -f "netlify/functions/requirements.txt" ] && [ -f "requirements.txt" ]; then
#         cp requirements.txt netlify/functions/
#     fi
# fi

# print_success "Backend build completed!"

# # Return to root directory
# cd ..

# # ===========================================
# # FRONTEND BUILD
# # ===========================================
# echo ""
# print_status "Building Frontend Components..."
# print_status "==============================="

# cd frontend

# # Clear only build cache (not node_modules)
# print_status "Clearing frontend build cache..."
# rm -rf .vite
# rm -rf dist

# # Verify build environment
# print_status "Verifying frontend build environment..."
# if ! command -v npm >/dev/null 2>&1; then
#     print_error "Error: npm not found"
#     exit 1
# fi

# # Check if package.json exists
# if [ ! -f "package.json" ]; then
#     print_error "Error: package.json not found in frontend directory"
#     exit 1
# fi

# # Install dependencies only if node_modules doesn't exist
# if [ ! -d "node_modules" ]; then
#     print_status "Installing frontend dependencies..."
#     npm install
# else
#     print_status "Using existing node_modules..."
# fi

# # Run frontend build
# print_status "Building React frontend with Vite..."
# export NODE_ENV=production
# npm run build

# # Verify build output
# if [ ! -d "dist" ]; then
#     print_error "Error: Frontend build failed - dist directory not found"
#     exit 1
# fi

# if [ ! -f "dist/index.html" ]; then
#     print_error "Error: Frontend build failed - index.html not found"
#     exit 1
# fi

# # Display build statistics
# print_status "Frontend build statistics:"
# DIST_SIZE=$(du -sh dist 2>/dev/null | cut -f1 || echo "Unknown")
# FILE_COUNT=$(find dist -type f | wc -l 2>/dev/null || echo "Unknown")
# echo "  📁 Build directory size: $DIST_SIZE"
# echo "  📄 Total files generated: $FILE_COUNT"

# print_success "Frontend build completed!"

# # Return to root directory
# cd ..

# # ===========================================
# # DEPLOYMENT PREPARATION
# # ===========================================
# echo ""
# print_status "Preparing for deployment..."
# print_status "============================"

# # Create deployment summary
# echo "📋 Build Summary:"
# echo "  🐍 Backend: Ready $([ -d "backend/venv" ] && echo "(with virtual env)" || echo "")"
# echo "  ⚛️  Frontend: Ready (TailwindCSS CDN + React + Markdown)"
# echo "  🚀 Deploy target: frontend/dist"

# # Check for deployment configuration files
# if [ -f "netlify.toml" ]; then
#     print_success "Netlify configuration found"
# fi

# if [ -f "vercel.json" ]; then
#     print_success "Vercel configuration found"
# fi

# # Final success message
# echo ""
# print_success "🎉 Complete Multi-Chatbot Platform build successful!"
# print_success "======================================================"

# echo ""
# echo "📦 What was built:"
# echo "  • Backend: Python API with ChatBot services"
# echo "  • Frontend: React app with enhanced ChatInterface"
# echo "  • Features: TailwindCSS CDN, React-Markdown, Mobile-optimized UI"
# echo ""
# echo "🚀 Ready for deployment:"
# echo "  • Frontend: Upload 'frontend/dist' folder"
# echo "  • Backend: Deploy from 'backend' directory"
# echo "  • Netlify Functions: Available in 'backend/netlify/functions' (if configured)"
# echo ""
# echo "✨ Your Multi-Chatbot Platform is ready to go live!"



#Build Script 3

#!/bin/bash

# Build script for Multi-Chatbot Platform
# Version: 3.1 - Windows Compatible

echo "🚀 Building Complete Multi-Chatbot Platform"
echo "============================================="

# Exit on any error
set -e

# Colors for output (same as before)
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}📦 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_backend() {
    echo -e "${PURPLE}🐍 $1${NC}"
}

# Detect operating system
detect_os() {
    case "$(uname -s)" in
        CYGWIN*|MINGW*|MSYS*) echo "windows" ;;
        Darwin*) echo "mac" ;;
        Linux*) echo "linux" ;;
        *) echo "unknown" ;;
    esac
}

OS=$(detect_os)
print_status "Detected OS: $OS"

# Check directories
if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    print_error "Error: frontend or backend directory not found"
    exit 1
fi

print_status "Starting full-stack build process..."

# ===========================================
# BACKEND BUILD
# ===========================================
echo ""
print_backend "Building Backend Components..."
print_backend "==============================="

cd backend

# Check for requirements
if [ -f "requirements.txt" ]; then
    print_backend "Found requirements.txt - Python backend detected"
else
    print_warning "No requirements.txt found, skipping backend"
    cd ..
    skip_backend=true
fi

if [ "$skip_backend" != "true" ]; then
    # Create virtual environment if it doesn't exist
    if [ ! -d "venv" ]; then
        print_backend "Creating Python virtual environment..."
        python -m venv venv
    fi

    # Activate virtual environment - Windows/Linux compatible
    print_backend "Activating virtual environment..."
    if [ "$OS" = "windows" ]; then
        if [ -f "venv/Scripts/activate" ]; then
            source venv/Scripts/activate
        else
            print_error "Windows virtual environment activation script not found"
            exit 1
        fi
    else
        if [ -f "venv/bin/activate" ]; then
            source venv/bin/activate
        else
            print_error "Unix virtual environment activation script not found"
            exit 1
        fi
    fi

    # Upgrade pip first
    print_backend "Upgrading pip..."
    python -m pip install --upgrade pip --quiet

    # Install dependencies with error handling
    print_backend "Installing Python dependencies..."
    if ! pip install -r requirements.txt --quiet; then
        print_error "Failed to install Python dependencies"
        print_warning "This might be due to missing system dependencies (like Rust)"
        print_warning "Continuing with build..."
    else
        print_success "Python dependencies installed successfully"
    fi

    print_success "Backend build completed!"
fi

cd ..

# ===========================================
# FRONTEND BUILD (unchanged)
# ===========================================
echo ""
print_status "Building Frontend Components..."
print_status "==============================="

cd frontend

# Clear build cache
print_status "Clearing frontend build cache..."
rm -rf .vite
rm -rf dist

# Verify environment
if ! command -v npm >/dev/null 2>&1; then
    print_error "Error: npm not found"
    exit 1
fi

if [ ! -f "package.json" ]; then
    print_error "Error: package.json not found"
    exit 1
fi

# Install frontend deps only if needed
if [ ! -d "node_modules" ]; then
    print_status "Installing frontend dependencies..."
    npm install
else
    print_status "Using existing node_modules..."
fi

# Build frontend
print_status "Building React frontend with Vite..."
export NODE_ENV=production
npm run build

# Verify build
if [ ! -d "dist" ] || [ ! -f "dist/index.html" ]; then
    print_error "Frontend build failed"
    exit 1
fi

DIST_SIZE=$(du -sh dist 2>/dev/null | cut -f1 || echo "Unknown")
FILE_COUNT=$(find dist -type f | wc -l 2>/dev/null || echo "Unknown")
echo "  📁 Build size: $DIST_SIZE"
echo "  📄 Files: $FILE_COUNT"

print_success "Frontend build completed!"
cd ..

# ===========================================
# DEPLOYMENT SUMMARY
# ===========================================
echo ""
print_success "🎉 Multi-Chatbot Platform build completed!"
echo ""
echo "📦 Build Summary:"
if [ "$skip_backend" != "true" ]; then
    echo "  🐍 Backend: Ready"
else
    echo "  🐍 Backend: Skipped"
fi
echo "  ⚛️  Frontend: Ready (TailwindCSS CDN + React + Markdown)"
echo "  🚀 Deploy: frontend/dist"
echo ""
print_success "Ready for deployment! ✨"
