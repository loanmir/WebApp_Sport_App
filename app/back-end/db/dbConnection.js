const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // 'mongo' is the service name defined in docker-compose.yml
    // 'sports_db' is the database you created in Compass
    const dbURI = 'mongodb://mongo:27017/sports_db';
    
    await mongoose.connect(dbURI);
    
    console.log('MongoDB Connected successfully!');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;