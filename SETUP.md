# Quick Setup Guide

## Prerequisites Check
- ✓ Node.js installed (v14+)
- ✓ PostgreSQL installed and running (v12+)
- ✓ npm package manager

## Setup Steps

### 1. Install & Start PostgreSQL

#### macOS
```bash
brew install postgresql@15
brew services start postgresql@15
```

#### Linux
```bash
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

#### Windows
Download from https://www.postgresql.org/download/windows/

#### Docker (Alternative)
```bash
docker run --name postgres-dev \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=client_management \
  -p 5432:5432 \
  -d postgres:15
```

### 2. Create Database
```bash
# Connect to PostgreSQL
psql postgres  # or: psql -U postgres

# Create database
CREATE DATABASE client_management;

# Exit
\q
```

### 3. Configure Environment
Update `/backend/.env` with your PostgreSQL credentials:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=client_management
DB_USER=postgres
DB_PASSWORD=your_password_here
```

### 4. Install Dependencies
Dependencies are already installed! If you need to reinstall:
```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

### 5. Create Admin User
```bash
cd backend
npm run seed
```

This creates:
- **Admin**: admin@example.com / admin123
- **Sample User**: user@example.com / user123

### 6. Start the Application

#### Option A: Use VS Code Tasks (Recommended)
1. Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
2. Type "Run Task"
3. Select "Start Full Application"

This will start both backend and frontend servers automatically!

#### Option B: Manual Start
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm start
```

### 5. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

### 6. Login
Use these credentials:
- **Admin**: admin@example.com / admin123 (Full access)
- **User**: user@example.com / user123 (Limited permissions)

## Testing the System

### 1. Login as Admin
- Full access to all features
- Can create users with custom permissions
- Can manage all resources

### 2. Test Permission System
- Login as sample user
- Notice limited menu options based on permissions
- Try to access restricted features (should be disabled)

### 3. Create an Order with Dual Payment
- Go to Orders
- Click "Create Order"
- Select a client
- Add products
- Add two payment methods (e.g., $50 cash + $50 card)
- Submit order

### 4. Test CRUD Operations
Try all operations on:
- Products
- Clients
- Orders
- Comments
- Users (admin only)

## Project Structure
```
/Users/hafis/tests/
├── .github/
│   └── copilot-instructions.md
├── .vscode/
│   └── tasks.json
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── package.json
│   ├── seed.js
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   ├── .env
│   ├── package.json
│   ├── postcss.config.js
│   └── tailwind.config.js
└── README.md
```

## Troubleshooting

### PostgreSQL Not Running
```bash
# Check if PostgreSQL is running
psql postgres -c "SELECT version();"

# If not, start it:
# macOS
brew services start postgresql@15

# Linux
sudo systemctl start postgresql

# Windows
# Start from Services panel or pgAdmin
```

### Database Connection Error
```bash
# Verify database exists
psql -U postgres -c "\l" | grep client_management

# Create if missing
psql -U postgres -c "CREATE DATABASE client_management;"
```

### Authentication Failed
- Check credentials in `/backend/.env`
- Ensure `DB_PASSWORD` matches your PostgreSQL password
- Try: `psql -U postgres` to verify your password works

### Port Already in Use
If port 5000 or 3000 is busy:
- Change `PORT` in backend/.env
- Update `REACT_APP_API_URL` in frontend/.env

### Can't Login
- Make sure you ran `npm run seed`
- Check backend logs for errors
- Verify PostgreSQL is running and database exists

### Permission Errors
- Login as admin to modify user permissions
- Check network tab in browser DevTools for API errors

## Next Steps

1. **Change Default Passwords** - Update admin and user passwords
2. **Customize Permissions** - Create users with different permission sets
3. **Add Data** - Create products, clients, and orders
4. **Explore Features** - Test all CRUD operations and the dual payment system

## Support

For issues:
1. Check browser console for frontend errors
2. Check backend terminal for API errors
3. Review MongoDB logs
4. Refer to README.md for detailed documentation

---

**You're all set! Start by logging in as admin and exploring the system.** 🚀
