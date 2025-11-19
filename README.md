# Client Management System

A comprehensive full-stack client management system with advanced role-based access control built with React, Redux, Node.js, Express, and PostgreSQL.

## 🚀 Features

### Core Functionality

- **Products Management**: Full CRUD operations for managing products with stock tracking
- **Orders Management**: Create orders for clients with dual payment method support (Cash & Card)
- **Clients Management**: Complete client information management system
- **Comments System**: Add comments related to clients, orders, products, or general notes
- **User Management**: Create and manage users with granular permissions

### Advanced Authorization System

- **Role-Based Access**: Admin and User roles
- **Granular Permissions**: Each user can have different permissions per resource:
  - View, Create, Update, Delete permissions for each feature
  - Admins have all permissions by default
  - Users have customizable permission sets

### Technical Features

- JWT-based authentication
- RESTful API architecture
- Redux state management
- Responsive UI with Ant Design
- TailwindCSS for styling
- PostgreSQL with Sequelize ORM for data persistence
- JSONB support for complex objects
- Transaction support for data integrity
- Input validation and error handling

## 📋 Prerequisites

Before running this application, ensure you have the following installed:

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd client-management-system
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 4. Configure Environment Variables

#### Backend (.env)

Create a `.env` file in the `backend` directory:

```env
PORT=5000
# PostgreSQL Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=client_management
DB_USER=postgres
DB_PASSWORD=your_password_here
# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

#### Frontend (.env)

Create a `.env` file in the `frontend` directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 5. Setup PostgreSQL

Make sure PostgreSQL is installed and running:

```bash
# macOS (with Homebrew)
brew install postgresql@15
brew services start postgresql@15

# Linux
sudo apt install postgresql
sudo systemctl start postgresql

# Windows - Download from https://www.postgresql.org/download/windows/
```

Create the database:

```bash
psql postgres -c "CREATE DATABASE client_management;"
```

### 6. Seed Initial Data

```bash
cd backend
npm run seed
```

This creates:

- Admin: admin@example.com / admin123
- Sample User: user@example.com / user123

## 🚀 Running the Application

### Development Mode

#### Start Backend Server

```bash
cd backend
npm run dev
# Server will run on http://localhost:5000
```

#### Start Frontend Application

```bash
cd frontend
npm start
# Application will open on http://localhost:3000
```

### Production Mode

#### Build Frontend

```bash
cd frontend
npm run build
```

#### Start Backend

```bash
cd backend
npm start
```

## 👤 Default Login Credentials

Use these credentials to login (created by seed script):

**Admin Account** (Full Permissions):

- Email: `admin@example.com`
- Password: `admin123`

**Sample User Account** (Limited Permissions):

- Email: `user@example.com`
- Password: `user123`
- Permissions:
  - Products: View, Create
  - Orders: View, Create, Update
  - Comments: Full Access
  - Clients: View, Create, Update
  - Users: No Access

⚠️ **Important**: Change these passwords in production!

## 📚 API Documentation

### Authentication Endpoints

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user",
  "permissions": {
    "products": { "view": true, "create": true, "update": false, "delete": false },
    "orders": { "view": true, "create": true, "update": true, "delete": false }
  }
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User

```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Products Endpoints

```http
GET    /api/products          # Get all products
GET    /api/products/:id      # Get single product
POST   /api/products          # Create product
PUT    /api/products/:id      # Update product
DELETE /api/products/:id      # Delete product
```

### Clients Endpoints

```http
GET    /api/clients           # Get all clients
GET    /api/clients/:id       # Get single client
POST   /api/clients           # Create client
PUT    /api/clients/:id       # Update client
DELETE /api/clients/:id       # Delete client
```

### Orders Endpoints

```http
GET    /api/orders            # Get all orders
GET    /api/orders/:id        # Get single order
POST   /api/orders            # Create order
PUT    /api/orders/:id        # Update order
DELETE /api/orders/:id        # Delete order
```

### Comments Endpoints

```http
GET    /api/comments          # Get all comments
GET    /api/comments/:id      # Get single comment
POST   /api/comments          # Create comment
PUT    /api/comments/:id      # Update comment
DELETE /api/comments/:id      # Delete comment
```

### Users Endpoints

```http
GET    /api/users             # Get all users
GET    /api/users/:id         # Get single user
POST   /api/users             # Create user
PUT    /api/users/:id         # Update user
DELETE /api/users/:id         # Delete user
```

## 🔐 Permission System

The system has a granular permission structure:

### Resources

- products
- orders
- clients
- comments
- users

### Actions per Resource

- view
- create
- update
- delete

### Example Permission Object

```json
{
  "products": {
    "view": true,
    "create": true,
    "update": false,
    "delete": false
  },
  "orders": {
    "view": true,
    "create": true,
    "update": true,
    "delete": false
  }
}
```

## 📦 Project Structure

```
client-management-system/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── client.controller.js
│   │   ├── comment.controller.js
│   │   ├── order.controller.js
│   │   ├── product.controller.js
│   │   └── user.controller.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validator.js
│   ├── models/
│   │   ├── Client.js
│   │   ├── Comment.js
│   │   ├── Order.js
│   │   ├── Product.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── client.routes.js
│   │   ├── comment.routes.js
│   │   ├── order.routes.js
│   │   ├── product.routes.js
│   │   └── user.routes.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout/
│   │   │   │   └── MainLayout.js
│   │   │   └── PrivateRoute.js
│   │   ├── pages/
│   │   │   ├── Clients.js
│   │   │   ├── Comments.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Login.js
│   │   │   ├── Orders.js
│   │   │   ├── Products.js
│   │   │   └── Users.js
│   │   ├── store/
│   │   │   ├── slices/
│   │   │   │   ├── authSlice.js
│   │   │   │   ├── clientSlice.js
│   │   │   │   ├── commentSlice.js
│   │   │   │   ├── orderSlice.js
│   │   │   │   ├── productSlice.js
│   │   │   │   └── userSlice.js
│   │   │   └── index.js
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── index.css
│   │   └── index.js
│   ├── .env
│   ├── package.json
│   ├── postcss.config.js
│   └── tailwind.config.js
└── README.md
```

## 🧪 Testing

You can test the API using tools like:

- Postman
- Insomnia
- cURL
- Thunder Client (VS Code extension)

## 🔧 Technologies Used

### Backend

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **PostgreSQL** - Relational database
- **Sequelize** - ORM for PostgreSQL
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

### Frontend

- **React** - UI library
- **Redux Toolkit** - State management
- **React Router** - Routing
- **Ant Design** - UI component library
- **Tailwind CSS** - Utility-first CSS
- **Axios** - HTTP client

## 📝 Key Features Implementation

### Dual Payment Method for Orders

Orders can be paid using multiple payment methods simultaneously:

```json
{
  "paymentMethods": [
    { "method": "cash", "amount": 50.0 },
    { "method": "card", "amount": 50.0 }
  ]
}
```

The system validates that the total of all payment methods equals the order total.

### Permission-Based UI

The interface dynamically shows/hides features based on user permissions:

- Menu items are filtered based on permissions
- Action buttons (Create, Edit, Delete) appear only if user has permission
- Users see only features they have access to

### Automatic Stock Management

When orders are created, product stock is automatically decremented.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🐛 Troubleshooting

### MongoDB Connection Issues

- Ensure MongoDB is running
- Check the `MONGODB_URI` in your `.env` file
- Verify MongoDB port (default: 27017)

### Frontend Can't Connect to Backend

- Ensure backend is running on port 5000
- Check `REACT_APP_API_URL` in frontend `.env`
- Verify CORS is enabled in backend

### Permission Denied Errors

- Check user permissions in the database
- Verify JWT token is valid and not expired
- Ensure proper authorization headers are sent

## 📞 Support

For issues and questions, please create an issue in the repository.

---

**Built with ❤️ for client management needs**
