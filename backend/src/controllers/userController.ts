import { Request, Response } from 'express';
import prisma from '../services/prisma';
import { AuthRequest } from '../middlewares/authMiddleware';

export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { role } = req.query;
    const where: any = {};
    if (role && ['FARMER', 'BUYER', 'ADMIN'].includes(String(role))) {
      where.role = String(role);
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        role: true,
        location: true,
        language: true,
        createdAt: true,
        _count: {
          select: {
            produce: true,
            orders: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, count: users.length, data: users });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        role: true,
        location: true,
        language: true,
        createdAt: true,
        produce: {
          where: { status: 'AVAILABLE' },
          take: 6,
        },
      },
    });

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.json({ success: true, data: user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { name, email, location, language } = req.body;

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(name && { name }),
        ...(email !== undefined && { email: email || null }),
        ...(location && { location }),
        ...(language && { language }),
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        role: true,
        location: true,
        language: true,
        updatedAt: true,
      },
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updated,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to update profile' });
  }
};
