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

    const users = [
      {
        name: 'Dr. Mercy Akinyi',
        email: 'doctor.mercy@health.go.ke',
        password: 'password123',
        role: 'DOCTOR',
        facilityName: 'Kakamega County General Hospital (Level 5)'
      },
      {
        name: 'Nurse Faith Atieno',
        email: 'nurse.faith@health.go.ke',
        password: 'password123',
        role: 'NURSE',
        facilityName: 'Lumakanda Sub-County Hospital'
      },
      {
        name: 'Admin Ruth Wafula',
        email: 'admin.ruth@health.go.ke',
        password: 'password123',
        role: 'ADMIN',
        facilityName: 'Kakamega County General Hospital (Level 5)'
      },
      {
        name: 'EMT Joseph Shikuku',
        email: 'emt.joseph@health.go.ke',
        password: 'password123',
        role: 'AMBULANCE',
        facilityName: 'Mumias Level 4 Hospital'
      },
      // Keep the original email for backward compatibility with my previous message if needed
      {
        name: 'Dr. Brian Ochieng',
        email: 'staff.kakamega@health.go.ke',
        password: 'password123',
        role: 'DOCTOR',
        facilityName: 'Kakamega County General Hospital (Level 5)'
      }
    ];

    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      console.log(`Created ${userData.role}: ${userData.email}`);
    }

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seed();
