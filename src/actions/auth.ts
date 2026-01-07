
'use server'

import dbConnect from '@/lib/db'
import { createSession, deleteSession } from '@/lib/session'
import User from '@/models/User'
import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['admin', 'attendee']).default('attendee'), // Simplified roles
})

export async function login(prevState: any, formData: FormData) {
  const result = loginSchema.safeParse(Object.fromEntries(formData))

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors }
  }

  const { email, password } = result.data

  await dbConnect()
  
  // Find User
  const user = await User.findOne({ email })
  
  if (!user) {
      return { errors: { email: ['Invalid credentials'] } }
  }

  // Verify Password
  const isValid = await bcrypt.compare(password, user.password || '');

  if (!isValid) {
      return { errors: { email: ['Invalid credentials'] } }
  }

  await createSession(user._id.toString(), user.role)

  if (user.role === 'admin') {
      redirect('/admin')
  } else {
      redirect('/tickets')
  }
}

export async function register(prevState: any, formData: FormData) {
    const data = Object.fromEntries(formData);
    // Combine names if separate inputs
    if (data['first-name'] && data['last-name']) {
        data.name = `${data['first-name']} ${data['last-name']}`;
    }
    
    const result = registerSchema.safeParse(data);

    if (!result.success) {
        return { errors: result.error.flatten().fieldErrors }
    }

    const { email, password, name } = result.data

    await dbConnect()
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return { errors: { email: ['User already exists'] } }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Initial role logic: First user is admin? Or just manual flag?
    // Let's assume everyone registered here is an 'attendee' by default, 
    // unless they specifically are created via an admin seed.
    // However, the prompt asked for "2 type of account".
    // We will default to 'attendee'.
    
    const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        role: 'attendee'
    });

    await createSession(newUser._id.toString(), newUser.role);
    
    redirect('/tickets');
}

export async function logout() {
  await deleteSession()
}

export async function getUserProfile() {
    const session = await (await import('@/lib/session')).getSession();
    if (!session?.userId) return null;

    await dbConnect();
    const user = await User.findById(session.userId).select('-password').lean();
    if (!user) return null;

    return {
        ...user,
        _id: (user as any)._id.toString()
    };
}

export async function updateProfile(prevState: any, formData: FormData) {
    const session = await (await import('@/lib/session')).getSession();
    if (!session?.userId) return { error: 'Unauthorized' };

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    await dbConnect();
    
    const updateData: any = { name, email };
    
    if (password && password.length >= 6) {
        updateData.password = await bcrypt.hash(password, 10);
    }

    try {
        await User.findByIdAndUpdate(session.userId, updateData);
        return { success: 'Profile updated successfully' };
    } catch (err: any) {
        return { error: err.message || 'Failed to update profile' };
    }
}
