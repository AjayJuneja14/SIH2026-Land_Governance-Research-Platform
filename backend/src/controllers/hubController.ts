import { Request, Response } from 'express';
import prisma from '../services/prisma';

export const getAllHubs = async (req: Request, res: Response): Promise<void> => {
  try {
    const hubs = await prisma.hub.findMany({
      include: {
        _count: {
          select: {
            produce: true,
            orders: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    res.json({ success: true, count: hubs.length, data: hubs });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getHubById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const hub = await prisma.hub.findUnique({
      where: { id },
      include: {
        produce: {
          where: { status: 'AVAILABLE' },
          include: {
            farmer: {
              select: { name: true, phone: true, location: true },
            },
          },
        },
      },
    });

    if (!hub) {
      res.status(404).json({ success: false, message: 'Hub not found' });
      return;
    }

    res.json({ success: true, data: hub });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createHub = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, location, lat, lng, contactNumber } = req.body;

    if (!name || !location || lat === undefined || lng === undefined) {
      res.status(400).json({ success: false, message: 'Name, location, lat, and lng are required.' });
      return;
    }

    const hub = await prisma.hub.create({
      data: {
        name,
        location,
        lat: parseFloat(String(lat)),
        lng: parseFloat(String(lng)),
        contactNumber,
      },
    });

    res.status(201).json({ success: true, message: 'Hub created successfully', data: hub });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
