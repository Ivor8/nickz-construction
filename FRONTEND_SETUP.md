# Frontend Setup Instructions

## 1. Install Dependencies
```bash
npm install
```

## 2. Environment Configuration
Create a `.env` file in the root directory:
```
VITE_API_URL=http://localhost:5000/api
```

## 3. Start the Frontend
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 4. Access Admin Panel
1. Navigate to `http://localhost:5173/login`
2. Login with your admin credentials
3. Access the admin dashboard at `http://localhost:5173/admin`

## What's Changed
- Removed Supabase dependency
- Added new API client (`src/lib/api.ts`)
- Updated authentication to use JWT tokens
- Updated all admin pages to use file upload instead of image URLs
- Modified service and project forms to support file uploads
- Updated all API calls to work with the new backend

## Migration Notes
- All data will be migrated from Supabase to MongoDB
- Images are now uploaded to the backend instead of using URLs
- Authentication now uses JWT instead of Supabase auth
