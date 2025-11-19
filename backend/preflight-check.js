#!/usr/bin/env node

/**
 * Pre-flight check script for PostgreSQL migration
 * Run this before starting the application
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const checks = {
  passed: [],
  failed: [],
  warnings: []
};

console.log('🔍 Running pre-flight checks for PostgreSQL migration...\n');

// Check 1: Node.js version
console.log('1️⃣  Checking Node.js version...');
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
if (majorVersion >= 14) {
  checks.passed.push(`Node.js ${nodeVersion} (✓)`);
  console.log(`   ✓ Node.js ${nodeVersion}\n`);
} else {
  checks.failed.push(`Node.js version too old (${nodeVersion}). Need v14+`);
  console.log(`   ✗ Node.js ${nodeVersion} - Need v14+\n`);
}

// Check 2: Dependencies installed
console.log('2️⃣  Checking dependencies...');
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (fs.existsSync(nodeModulesPath)) {
  const hasSequelize = fs.existsSync(path.join(nodeModulesPath, 'sequelize'));
  const hasPg = fs.existsSync(path.join(nodeModulesPath, 'pg'));
  
  if (hasSequelize && hasPg) {
    checks.passed.push('PostgreSQL dependencies installed (✓)');
    console.log('   ✓ Sequelize and pg packages found\n');
  } else {
    checks.failed.push('Missing PostgreSQL dependencies. Run: npm install');
    console.log('   ✗ Missing dependencies. Run: npm install\n');
  }
} else {
  checks.failed.push('node_modules not found. Run: npm install');
  console.log('   ✗ node_modules not found. Run: npm install\n');
}

// Check 3: Environment variables
console.log('3️⃣  Checking environment configuration...');
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  const hasDbHost = envContent.includes('DB_HOST=');
  const hasDbName = envContent.includes('DB_NAME=');
  const hasDbUser = envContent.includes('DB_USER=');
  const hasDbPassword = envContent.includes('DB_PASSWORD=');
  
  if (hasDbHost && hasDbName && hasDbUser && hasDbPassword) {
    checks.passed.push('Environment variables configured (✓)');
    console.log('   ✓ PostgreSQL environment variables found\n');
    
    if (envContent.includes('DB_PASSWORD=postgres')) {
      checks.warnings.push('Using default password. Update DB_PASSWORD in .env');
      console.log('   ⚠️  Using default password. Update for production!\n');
    }
  } else {
    checks.failed.push('Missing PostgreSQL environment variables in .env');
    console.log('   ✗ Missing PostgreSQL configuration in .env\n');
  }
} else {
  checks.failed.push('.env file not found');
  console.log('   ✗ .env file not found\n');
}

// Check 4: Model files
console.log('4️⃣  Checking Sequelize model files...');
const modelsPath = path.join(__dirname, 'models');
const requiredModels = ['User.js', 'Client.js', 'Product.js', 'Order.js', 'Comment.js', 'index.js'];
let allModelsExist = true;

requiredModels.forEach(model => {
  if (!fs.existsSync(path.join(modelsPath, model))) {
    allModelsExist = false;
    checks.failed.push(`Missing model file: models/${model}`);
  }
});

if (allModelsExist) {
  checks.passed.push('All Sequelize model files present (✓)');
  console.log('   ✓ All Sequelize models found\n');
} else {
  console.log('   ✗ Missing model files\n');
}

// Check 5: PostgreSQL connection (async)
console.log('5️⃣  Testing PostgreSQL connection...');
exec('psql --version', (error, stdout, stderr) => {
  if (error) {
    checks.warnings.push('PostgreSQL client (psql) not found. Install PostgreSQL first.');
    console.log('   ⚠️  PostgreSQL client not found. Is PostgreSQL installed?\n');
  } else {
    checks.passed.push('PostgreSQL client installed (✓)');
    console.log(`   ✓ PostgreSQL client found: ${stdout.trim()}\n`);
  }
  
  // Check 6: Test database connection
  console.log('6️⃣  Testing database connection...');
  
  // Load environment variables
  require('dotenv').config();
  
  const { sequelize } = require('./models');
  
  sequelize.authenticate()
    .then(() => {
      checks.passed.push('Database connection successful (✓)');
      console.log('   ✓ Successfully connected to PostgreSQL\n');
      
      // Check if tables exist
      return sequelize.query("SELECT tablename FROM pg_tables WHERE schemaname='public'");
    })
    .then(([results]) => {
      if (results.length === 0) {
        checks.warnings.push('No tables found. Run seed script after first start.');
        console.log('   ⚠️  No tables found yet. Will be created on first run.\n');
      } else {
        checks.passed.push(`Database has ${results.length} tables (✓)`);
        console.log(`   ✓ Found ${results.length} tables in database\n`);
      }
      
      return sequelize.close();
    })
    .catch(err => {
      checks.failed.push(`Database connection failed: ${err.message}`);
      console.log(`   ✗ Connection failed: ${err.message}\n`);
      console.log('   💡 Tips:');
      console.log('      - Ensure PostgreSQL is running');
      console.log('      - Create database: psql postgres -c "CREATE DATABASE client_management;"');
      console.log('      - Check credentials in .env file\n');
    })
    .finally(() => {
      printSummary();
    });
});

function printSummary() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 SUMMARY');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  if (checks.passed.length > 0) {
    console.log('✅ PASSED CHECKS:');
    checks.passed.forEach(check => console.log(`   ${check}`));
    console.log('');
  }
  
  if (checks.warnings.length > 0) {
    console.log('⚠️  WARNINGS:');
    checks.warnings.forEach(warning => console.log(`   ${warning}`));
    console.log('');
  }
  
  if (checks.failed.length > 0) {
    console.log('❌ FAILED CHECKS:');
    checks.failed.forEach(failure => console.log(`   ${failure}`));
    console.log('');
  }
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  if (checks.failed.length === 0) {
    console.log('🎉 All critical checks passed!');
    console.log('');
    console.log('📝 NEXT STEPS:');
    console.log('   1. Run: npm run seed (to create admin user)');
    console.log('   2. Run: npm run dev (to start backend server)');
    console.log('   3. In another terminal: cd ../frontend && npm start');
    console.log('   4. Login at http://localhost:3000 with admin@example.com / admin123');
    console.log('');
  } else {
    console.log('⚠️  Some checks failed. Please fix the issues above before starting the server.');
    console.log('');
    console.log('📖 Need help? Check:');
    console.log('   - MIGRATION_COMPLETE.md');
    console.log('   - POSTGRESQL_MIGRATION.md');
    console.log('   - SETUP.md');
    console.log('');
  }
  
  process.exit(checks.failed.length > 0 ? 1 : 0);
}
