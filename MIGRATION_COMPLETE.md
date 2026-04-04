# Nickz Construction - Complete Migration Guide

## Overview
This project has been successfully migrated from Supabase to Node.js/Express/MongoDB with file upload capabilities.

## Backend Structure
```
backend/
├── models/           # MongoDB models
│   ├── Service.js
│   ├── Project.js
│   ├── Review.js
│   ├── Contact.js
│   ├── QuoteRequest.js
│   ├── AdminProfile.js
│   └── SiteSetting.js
├── routes/           # API routes
│   ├── auth.js
│   ├── services.js
│   ├── projects.js
│   ├── reviews.js
│   ├── contacts.js
│   ├── quotes.js
│   └── settings.js
├── middleware/       # Express middleware
│   ├── auth.js
│   └── upload.js
├── uploads/          # File upload directories
│   ├── services/
│   └── projects/
├── server.js         # Main server file
├── package.json
└── .env.example
```

## Key Changes
1. **Database**: PostgreSQL (Supabase) → MongoDB Atlas
2. **Authentication**: Supabase Auth → JWT tokens
3. **File Storage**: Image URLs → Local file upload with Multer
4. **API**: Supabase client → REST API endpoints
5. **Backend**: BaaS → Custom Node.js/Express server

## Setup Instructions

### Backend Setup
1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment:
```bash
cp .env.example .env
```

4. Update `.env` with your MongoDB Atlas connection string:
```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
FRONTEND_URL=http://localhost:5173
```

5. Start the backend server:
```bash
npm run dev
```

### Frontend Setup
1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```
VITE_API_URL=http://localhost:5000/api
```

3. Start the frontend:
```bash
npm run dev
```

## Features Implemented
- ✅ Complete CRUD operations for services and projects
- ✅ File upload for service and project images
- ✅ JWT-based authentication system
- ✅ Admin dashboard with all management features
- ✅ Contact form and quote request handling
- ✅ Review management system
- ✅ Site settings management
- ✅ Proper error handling and validation
- ✅ Organized folder structure

## API Endpoints
- `POST /api/auth/login` - Admin login
- `GET /api/services` - Get all services (public)
- `POST /api/services` - Create service (admin)
- `PUT /api/services/:id` - Update service (admin)
- `DELETE /api/services/:id` - Delete service (admin)
- `GET /api/projects` - Get all projects (public)
- `POST /api/projects` - Create project (admin)
- `PUT /api/projects/:id` - Update project (admin)
- `DELETE /api/projects/:id` - Delete project (admin)
- And more for reviews, contacts, quotes, and settings

## File Upload
- Services: Single image upload
- Projects: Multiple image uploads
- Files are stored in `backend/uploads/` directory
- Files are accessible via `/uploads/` endpoint

## Security Features
- JWT token authentication
- Password hashing with bcrypt
- Request validation
- File type validation
- CORS configuration
- Helmet.js security headers

## Migration Notes
- All Supabase dependencies have been removed
- Frontend now uses custom API client
- Authentication flow updated for JWT
- File upload replaces image URL inputs
- Database models created for MongoDB

## Next Steps
1. Set up your MongoDB Atlas cluster
2. Configure environment variables
3. Create initial admin user
4. Test all functionality
5. Deploy to production

The migration is complete and the application is ready to use with the new backend!
