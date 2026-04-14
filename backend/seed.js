const mongoose = require('mongoose');
const User = require('./models/User');
const config = require('./config/config');

const seed = async () => {
  try {
    await mongoose.connect(config.mongodb.uri);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users.');

    const defaultUser = new User({
      name: 'Dr. Mercy Akinyi',
      email: 'staff.kakamega@health.go.ke',
      password: 'password123',
      role: 'DOCTOR',
      facilityName: 'Kakamega County General Hospital (Level 5)'
    });

    await defaultUser.save();
    console.log('Default user created successfully: staff.kakamega@health.go.ke / password123');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seed();
