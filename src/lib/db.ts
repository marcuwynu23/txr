
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';


const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
interface MongooseCache {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
}

declare global {
    // eslint-disable-next-line no-var
    var mongoose: MongooseCache;
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function seedDatabase() {
  try {
    // Dynamic import to avoid circular dependencies if any
    const User = (await import('@/models/User')).default;
    
    const count = await User.countDocuments();
    if (count === 0) {
      console.log('🌱 Seeding default accounts...');
      
      const hashedAdminPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        name: 'System Admin',
        email: 'admin@example.com',
        password: hashedAdminPassword,
        role: 'admin'
      });

      const hashedUserPassword = await bcrypt.hash('user123', 10);
      await User.create({
        name: 'Default User',
        email: 'user@example.com',
        password: hashedUserPassword,
        role: 'attendee'
      });
      
      console.log('✅ Default accounts created:');
      console.log('   Admin: admin@example.com / admin123');
      console.log('   User:  user@example.com / user123');
    }
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then(async (mongoose) => {
      const conn = mongoose.connection;
      // Seed on first connection
      await seedDatabase();
      return conn;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
