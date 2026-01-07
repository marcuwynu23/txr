
import mongoose, { Document, Model, Schema } from 'mongoose';

export enum UserRole {
  ADMIN = 'admin',
  ORGANIZER = 'organizer',
  ATTENDEE = 'attendee',
}

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false }, // Optional because seeded users might not have it yet
    role: { 
        type: String, 
        enum: Object.values(UserRole), 
        default: UserRole.ATTENDEE 
    },
  },
  { timestamps: true }
);

// Prevent compiled model overwrite in hot reload
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
