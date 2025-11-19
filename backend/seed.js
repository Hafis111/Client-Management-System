const dotenv = require('dotenv');
const { sequelize, User } = require('./models');

// Load environment variables
dotenv.config();

// Seed admin user
const seedAdmin = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });

    // Check if admin exists
    const adminExists = await User.findOne({ where: { email: 'admin@example.com' } });
    
    if (adminExists) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });

    console.log('Admin user created successfully');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
    console.log('\nPlease change this password after first login!');

    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Seed sample user with limited permissions
const seedSampleUser = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });

    // Check if user exists
    const userExists = await User.findOne({ where: { email: 'user@example.com' } });
    
    if (userExists) {
      console.log('Sample user already exists');
      process.exit(0);
    }

    // Create sample user with specific permissions
    const user = await User.create({
      name: 'Sample User',
      email: 'user@example.com',
      password: 'user123',
      role: 'user',
      permissions: {
        products: {
          view: true,
          create: true,
          update: false,
          delete: false
        },
        orders: {
          view: true,
          create: true,
          update: true,
          delete: false
        },
        comments: {
          view: true,
          create: true,
          update: true,
          delete: true
        },
        clients: {
          view: true,
          create: true,
          update: true,
          delete: false
        },
        users: {
          view: false,
          create: false,
          update: false,
          delete: false
        }
      }
    });

    console.log('Sample user created successfully');
    console.log('Email: user@example.com');
    console.log('Password: user123');
    console.log('\nPermissions:');
    console.log('- Products: View, Create');
    console.log('- Orders: View, Create, Update');
    console.log('- Comments: Full Access');
    console.log('- Clients: View, Create, Update');
    console.log('- Users: No Access');

    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Run based on command line argument
const command = process.argv[2];

if (command === 'admin') {
  seedAdmin();
} else if (command === 'user') {
  seedSampleUser();
} else if (command === 'all') {
  (async () => {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    
    // Create admin if doesn't exist
    const adminExists = await User.findOne({ where: { email: 'admin@example.com' } });
    if (!adminExists) {
      await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('✓ Admin user created');
    } else {
      console.log('✓ Admin user already exists');
    }

    // Create sample user if doesn't exist
    const userExists = await User.findOne({ where: { email: 'user@example.com' } });
    if (!userExists) {
      await User.create({
        name: 'Sample User',
        email: 'user@example.com',
        password: 'user123',
        role: 'user',
        permissions: {
          products: { view: true, create: true, update: false, delete: false },
          orders: { view: true, create: true, update: true, delete: false },
          comments: { view: true, create: true, update: true, delete: true },
          clients: { view: true, create: true, update: true, delete: false },
          users: { view: false, create: false, update: false, delete: false }
        }
      });
      console.log('✓ Sample user created');
    } else {
      console.log('✓ Sample user already exists');
    }

    console.log('\n=== Login Credentials ===');
    console.log('Admin - admin@example.com : admin123');
    console.log('User  - user@example.com : user123');
    console.log('\nPlease change these passwords after first login!');
    
    await sequelize.close();
    process.exit(0);
  })();
} else {
  console.log('Usage: node seed.js [admin|user|all]');
  console.log('  admin - Create admin user only');
  console.log('  user  - Create sample user only');
  console.log('  all   - Create both admin and sample user');
  process.exit(0);
}
