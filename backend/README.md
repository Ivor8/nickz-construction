# Backend Setup Instructions

## 1. Install Dependencies
```bash
cd backend
npm install
```

## 2. Environment Configuration
1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update the `.env` file with your MongoDB Atlas connection string:
```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
FRONTEND_URL=http://localhost:5173
```

## 3. Start the Backend Server
```bash
npm run dev
```

The server will run on `http://localhost:5000`

## 4. Create First Admin User
After starting the server, you can create the first admin user by:
1. Using the API endpoint: `POST /api/auth/create`
2. Or manually inserting into MongoDB

## API Endpoints
- Auth: `/api/auth/*`
- Services: `/api/services/*`
- Projects: `/api/projects/*`
- Reviews: `/api/reviews/*`
- Contacts: `/api/contacts/*`
- Quotes: `/api/quotes/*`
- Settings: `/api/settings/*`

## File Upload
- Service images are uploaded to `/uploads/services/`
- Project images are uploaded to `/uploads/projects/`
- Files are accessible via `http://localhost:5000/uploads/`
