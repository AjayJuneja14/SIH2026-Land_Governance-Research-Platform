import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../services/prisma';
import { AuthRequest } from '../middlewares/authMiddleware';

const JWT_SECRET = process.env.JWT_SECRET || 'kisanconnect_super_secret_jwt_key_2026';
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '7d') as jwt.SignOptions['expiresIn'];

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, phone, email, password, role, location, language } = req.body;

    if (!name || !phone || !password || !location) {
      res.status(400).json({ success: false, message: 'Name, phone, password, and location are required.' });
      return;
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { phone },
          ...(email ? [{ email }] : [])
        ]
      }
    });

    if (existingUser) {
      res.status(409).json({ success: false, message: 'A user with this phone or email already exists.' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const validRole = role && ['FARMER', 'BUYER', 'ADMIN'].includes(role) ? role : 'BUYER';

    const user = await prisma.user.create({
      data: {
        name,
        phone,
        email: email || null,
        password: passwordHash,
        role: validRole,
        location,
        language: language || 'en',
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        role: true,
        location: true,
        language: true,
        createdAt: true,
      },
    });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { user, token },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      res.status(400).json({ success: false, message: 'Phone/email and password are required.' });
      return;
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { phone: identifier },
          { email: identifier },
        ],
      },
    });

    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid credentials. Incorrect password.' });
      return;
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          name: user.name,
          phone: user.phone,
          email: user.email,
          role: user.role,
          location: user.location,
          language: user.language,
          createdAt: user.createdAt,
        },
        token,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Login failed' });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }
    res.json({ success: true, data: { user: req.user } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDemoAccounts = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        role: true,
        location: true,
        language: true,
      },
      orderBy: { role: 'asc' },
    });

    res.json({ success: true, data: users });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
