# Client Management System - Quick Reference

## 🚀 Quick Start Commands

### First Time Setup

```bash
# 1. Start MongoDB
brew services start mongodb-community

# 2. Seed database with users
cd backend && npm run seed

# 3. Start application (choose one):

# Option A: VS Code Task
# Cmd+Shift+P → "Run Task" → "Start Full Application"

# Option B: Manual
# Terminal 1:
cd backend && npm run dev

# Terminal 2:
cd frontend && npm start
```

### Access

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api

## 🔑 Login Credentials

| Role  | Email             | Password | Access Level                                                                                                         |
| ----- | ----------------- | -------- | -------------------------------------------------------------------------------------------------------------------- |
| Admin | admin@example.com | admin123 | Full access to all features                                                                                          |
| User  | user@example.com  | user123  | Limited permissions (Products: View/Create, Orders: View/Create/Update, Comments: Full, Clients: View/Create/Update) |

## 📋 Features Checklist

### ✅ Implemented Features

- [x] **Products Management**: Full CRUD operations
- [x] **Orders Management**: Dual payment methods (Cash + Card)
- [x] **Clients Management**: Full CRUD operations
- [x] **Comments System**: Full CRUD operations
- [x] **User Management**: Create users with custom permissions
- [x] **Authentication**: JWT-based login/logout
- [x] **Authorization**: Granular permission system
- [x] **Stock Management**: Automatic inventory updates
- [x] **REST API**: Clean RESTful architecture
- [x] **Responsive UI**: Ant Design + Tailwind CSS
- [x] **State Management**: Redux Toolkit

## 🎯 Test Scenarios

### 1. Test Admin Access

- Login as admin
- Access all menu items
- Create a new user with custom permissions
- Perform CRUD on all resources

### 2. Test Limited User Permissions

- Login as sample user
- Notice restricted menu (no Users section)
- Try to delete a product (button should not appear)
- Create an order successfully

### 3. Test Dual Payment Order

1. Go to Orders → Create Order
2. Select a client
3. Add product(s)
4. Add two payment methods:
   - Method 1: Cash - $30
   - Method 2: Card - $20
5. Verify total matches (must equal $50)
6. Submit order

### 4. Test Permission System

1. Login as admin
2. Go to Users
3. Create new user with specific permissions:
   - Products: View only
   - Orders: View + Create
   - Comments: Full access
4. Logout and login with new user
5. Verify UI reflects permissions

## 📊 API Endpoints Summary

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Resources (All require authentication + permissions)

- `/api/products` - Products CRUD
- `/api/orders` - Orders CRUD
- `/api/clients` - Clients CRUD
- `/api/comments` - Comments CRUD
- `/api/users` - Users CRUD (Admin/Permission required)

## 🛠️ Development Commands

### Backend

```bash
cd backend
npm run dev        # Start with nodemon
npm run seed       # Create admin + sample user
npm run seed:admin # Create admin only
npm run seed:user  # Create sample user only
```

### Frontend

```bash
cd frontend
npm start          # Start development server
npm run build      # Build for production
```

## 🔍 Troubleshooting

| Problem                | Solution                                                           |
| ---------------------- | ------------------------------------------------------------------ |
| Can't login            | Run `npm run seed` in backend folder                               |
| MongoDB error          | Ensure MongoDB is running: `brew services start mongodb-community` |
| Port in use            | Change PORT in backend/.env                                        |
| Permission denied      | Login as admin and update user permissions                         |
| Frontend can't connect | Check backend is running on port 5000                              |

## 📁 Project Structure

```
tests/
├── backend/          # Node.js/Express API
│   ├── models/       # MongoDB schemas
│   ├── controllers/  # Business logic
│   ├── routes/       # API routes
│   ├── middleware/   # Auth & validation
│   └── seed.js       # Database seeding
├── frontend/         # React application
│   ├── src/
│   │   ├── pages/    # Page components
│   │   ├── store/    # Redux setup
│   │   ├── components/ # Reusable components
│   │   └── utils/    # API client
│   └── public/
└── .vscode/
    └── tasks.json    # VS Code tasks
```

## 🎨 Tech Stack

**Frontend**: React • Redux Toolkit • Ant Design • Tailwind CSS • Axios

**Backend**: Node.js • Express • MongoDB • Mongoose • JWT • bcrypt

## 📝 Notes

- Default passwords should be changed after first login
- Admin role automatically has all permissions
- Order payment methods total must equal order total
- Stock is automatically decremented when orders are created
- Permissions are granular: view, create, update, delete per resource

---

**Need help?** Check README.md or SETUP.md for detailed documentation.
