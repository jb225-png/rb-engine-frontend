# rb-engine-frontend
RBB Engine Frontend (React + Tailwind)

## Features
- Product management and catalog
- Bundle creation and management
- Quick generation tools
- Upload queue processing
- Responsive design with Tailwind CSS

## Tech Stack
- React 18 with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- TanStack Query for data fetching
- Axios for API calls

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Update `.env` with your API URL:
```
REACT_APP_API_URL=http://localhost:8000/api
```

4. Start development server:
```bash
npm start
```

## Available Scripts

- `npm start` - Run development server
- `npm build` - Build for production
- `npm test` - Run tests

## Project Structure

```
src/
├── api/          # API client configuration
├── components/   # Reusable UI components
├── hooks/        # Custom React hooks
├── pages/        # Page components
├── router/       # Routing configuration
└── styles/       # Design tokens and styles
```