# RBB Engine Frontend

Modern React frontend for the RBB Engine educational content generation platform.

## Overview

The RBB Engine Frontend is a comprehensive web application that provides an intuitive interface for generating, managing, and organizing educational content. Built with React 18 and TypeScript, it offers a complete workflow from content generation to download and distribution.

## Key Features

- **AI Content Generation**: Interactive interface for generating educational materials
- **Product Management**: Comprehensive catalog and management system
- **Real-time Job Tracking**: Monitor generation progress with detailed status updates
- **Quality Control Integration**: View AI-generated QC reports and scores
- **Multi-format Support**: Generate worksheets, quizzes, passages, and assessments
- **Curriculum Support**: CBSE (India) and Common Core (US) standards
- **Responsive Design**: Optimized for desktop and mobile devices
- **File Management**: Download generated content as PDFs and ZIP files

## Tech Stack

- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **TanStack Query v5** - Powerful data fetching and caching
- **React Router v6** - Client-side routing
- **Axios** - HTTP client for API communication
- **Vite** - Fast build tool and development server

## Project Structure

```
rb-engine-frontend/
├── src/
│   ├── api/              # API client and endpoints
│   │   ├── client.ts     # Base API client configuration
│   │   ├── dashboard.ts  # Dashboard API calls
│   │   ├── generation.ts # Content generation APIs
│   │   ├── products.ts   # Product management APIs
│   │   ├── standards.ts  # Educational standards APIs
│   │   └── uploadTasks.ts # Upload queue APIs
│   ├── components/       # Reusable UI components
│   │   ├── layout/       # Layout components (Sidebar, Topbar, etc.)
│   │   └── ui/           # Base UI components (Button, Input, etc.)
│   ├── config/           # Configuration files
│   ├── hooks/            # Custom React hooks
│   │   ├── useApi.ts     # Generic API hook
│   │   ├── useDashboard.ts # Dashboard data hooks
│   │   ├── useGeneration.ts # Generation job hooks
│   │   ├── useProducts.ts # Product management hooks
│   │   ├── useStandards.ts # Standards hooks
│   │   └── useUploadTasks.ts # Upload task hooks
│   ├── pages/            # Page components
│   │   ├── Dashboard.tsx # Main dashboard
│   │   ├── Products.tsx  # Product catalog
│   │   ├── ProductDetail.tsx # Individual product view
│   │   ├── QuickGenerate.tsx # Content generation interface
│   │   ├── Jobs.tsx      # Generation job tracking
│   │   ├── Bundles.tsx   # Bundle management
│   │   └── UploadQueue.tsx # Upload task management
│   ├── providers/        # React context providers
│   ├── router/           # Routing configuration
│   ├── styles/           # Design tokens and global styles
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   ├── App.tsx           # Main application component
│   └── index.tsx         # Application entry point
├── public/               # Static assets
├── package.json          # Dependencies and scripts
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite build configuration
```

## Quick Start

### 1. Installation

```bash
# Install dependencies
npm install

# Or using yarn
yarn install
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Configure your environment variables
```

Environment variables:
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

### 3. Development Server

```bash
# Start development server
npm start

# Or using yarn
yarn start
```

The application will be available at http://localhost:3000

### 4. Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## Core Features

### Quick Generate
- **Standard Selection**: Search and select educational standards
- **Product Types**: Choose from 12 different content archetypes
- **Bundle Generation**: Generate complete curriculum bundles
- **Real-time Progress**: Track generation status with live updates

### Product Management
- **Catalog View**: Browse all generated products with filtering
- **Detailed View**: Examine AI outputs, QC reports, and metadata
- **File Downloads**: Download PDFs and ZIP packages
- **Status Tracking**: Monitor product lifecycle states

### Dashboard
- **Analytics**: View generation statistics and trends
- **Recent Activity**: Track latest jobs and products
- **System Health**: Monitor backend connectivity and status

### Job Tracking
- **Progress Monitoring**: Real-time job status updates
- **Error Handling**: Detailed error reporting and recovery
- **History**: Complete audit trail of generation activities

## API Integration

The frontend integrates with the RBB Engine Backend through a comprehensive API client:

### Key Endpoints
- **Content Generation**: `POST /api/generate-product`
- **Product Management**: `GET /api/products`, `GET /api/products/{id}`
- **Standards**: `GET /api/v1/standards`
- **Generation Jobs**: `GET /api/v1/generation-jobs`
- **Dashboard**: `GET /api/dashboard/stats`

### Data Fetching
- **TanStack Query**: Efficient caching and synchronization
- **Error Handling**: Comprehensive error states and retry logic
- **Loading States**: Smooth user experience with loading indicators
- **Optimistic Updates**: Immediate UI feedback for user actions

## Component Architecture

### Layout Components
- **AppLayout**: Main application shell
- **Sidebar**: Navigation and menu system
- **Topbar**: Header with user actions and notifications
- **PageContainer**: Consistent page wrapper

### UI Components
- **Design System**: Consistent styling with Tailwind CSS
- **Accessibility**: WCAG compliant components
- **Responsive**: Mobile-first responsive design
- **Reusable**: Modular component architecture

### Page Components
- **Route-based**: Each major feature has dedicated pages
- **State Management**: Local state with React hooks
- **Data Integration**: Connected to backend APIs
- **Error Boundaries**: Graceful error handling

## Development

### Available Scripts

```bash
# Development
npm start          # Start development server
npm run dev        # Alternative dev command

# Building
npm run build      # Create production build
npm run preview    # Preview production build

# Code Quality
npm run lint       # Run ESLint
npm run lint:fix   # Fix ESLint issues
npm run format     # Format code with Prettier
npm run type-check # Run TypeScript checks

# Testing
npm test           # Run tests
npm run test:coverage # Run tests with coverage
```

### Code Quality Tools

- **ESLint**: Code linting with React and TypeScript rules
- **Prettier**: Code formatting
- **TypeScript**: Static type checking
- **Husky**: Git hooks for quality gates

### Development Guidelines

1. **TypeScript**: All code must be properly typed
2. **Components**: Use functional components with hooks
3. **Styling**: Use Tailwind CSS utility classes
4. **API Calls**: Use custom hooks for data fetching
5. **Error Handling**: Implement proper error boundaries
6. **Accessibility**: Follow WCAG guidelines

## Deployment

### Production Build
```bash
# Create optimized build
npm run build

# The build folder contains the production-ready files
```

### Environment Configuration
- Set `VITE_API_BASE_URL` to your production API endpoint
- Configure any additional environment variables
- Ensure CORS is properly configured on the backend

### Hosting Options
- **Static Hosting**: Netlify, Vercel, AWS S3 + CloudFront
- **Server Hosting**: Nginx, Apache, or Node.js server
- **Container Deployment**: Docker with nginx

## Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile**: iOS Safari, Chrome Mobile
- **Minimum**: ES2020 support required

## Performance

- **Code Splitting**: Automatic route-based code splitting
- **Lazy Loading**: Components loaded on demand
- **Caching**: Efficient API response caching
- **Bundle Size**: Optimized with tree shaking and minification

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass (`npm test`)
6. Run linting and formatting (`npm run lint && npm run format`)
7. Commit your changes (`git commit -m 'Add amazing feature'`)
8. Push to the branch (`git push origin feature/amazing-feature`)
9. Open a Pull Request

## Troubleshooting

### Common Issues

**API Connection Issues**
- Verify `VITE_API_BASE_URL` is correct
- Check backend server is running
- Ensure CORS is configured properly

**Build Issues**
- Clear node_modules and reinstall dependencies
- Check TypeScript errors with `npm run type-check`
- Verify all environment variables are set

**Development Server Issues**
- Check port 3000 is available
- Clear browser cache and cookies
- Restart the development server

## License

This project is proprietary software. All rights reserved.