import { Request, Response } from 'express';
import prisma from '../services/prisma';
import { AuthRequest } from '../middlewares/authMiddleware';

export const getAllProduce = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      search,
      category,
      location,
      minPrice,
      maxPrice,
      qualityGrade,
      status,
      farmerId,
      hubId,
      sortBy,
    } = req.query;

    const where: any = {};

    if (status && status !== 'ALL') {
      where.status = String(status);
    } else if (!status) {
      where.status = 'AVAILABLE';
    }

    if (category && category !== 'ALL') {
      where.category = {
        equals: String(category),
      };
    }

    if (farmerId) {
      where.farmerId = String(farmerId);
    }

    if (hubId) {
      where.hubId = String(hubId);
    }

    if (qualityGrade && qualityGrade !== 'ALL') {
      where.qualityGrade = {
        contains: String(qualityGrade),
      };
    }

    if (minPrice || maxPrice) {
      where.pricePerUnit = {};
      if (minPrice) where.pricePerUnit.gte = parseFloat(String(minPrice));
      if (maxPrice) where.pricePerUnit.lte = parseFloat(String(maxPrice));
    }

    if (search) {
      const q = String(search).trim();
      where.OR = [
        { name: { contains: q } },
        { description: { contains: q } },
        { category: { contains: q } },
        { farmer: { name: { contains: q } } },
        { farmer: { location: { contains: q } } },
      ];
    }

    if (location) {
      where.farmer = {
        ...(where.farmer || {}),
        location: { contains: String(location) },
      };
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'price_asc') orderBy = { pricePerUnit: 'asc' };
    if (sortBy === 'price_desc') orderBy = { pricePerUnit: 'desc' };
    if (sortBy === 'harvest_recent') orderBy = { harvestDate: 'desc' };

    const produceList = await prisma.produce.findMany({
      where,
      include: {
        farmer: {
          select: {
            id: true,
            name: true,
            phone: true,
            location: true,
            language: true,
          },
        },
        hub: true,
      },
      orderBy,
    });

    res.json({
      success: true,
      count: produceList.length,
      data: produceList,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch produce' });
  }
};

export const getProduceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const item = await prisma.produce.findUnique({
      where: { id },
      include: {
        farmer: {
          select: {
            id: true,
            name: true,
            phone: true,
            location: true,
            language: true,
          },
        },
        hub: true,
      },
    });

    if (!item) {
      res.status(404).json({ success: false, message: 'Produce item not found' });
      return;
    }

    res.json({ success: true, data: item });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createProduce = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const {
      name,
      category,
      quantity,
      unit,
      pricePerUnit,
      qualityGrade,
      harvestDate,
      imageUrl,
      description,
      hubId,
    } = req.body;

    if (!name || !category || quantity === undefined || !unit || pricePerUnit === undefined || !qualityGrade) {
      res.status(400).json({ success: false, message: 'Name, category, quantity, unit, pricePerUnit, and qualityGrade are required.' });
      return;
    }

    const newProduce = await prisma.produce.create({
      data: {
        farmerId: req.user.id,
        name,
        category,
        quantity: parseFloat(String(quantity)),
        unit,
        pricePerUnit: parseFloat(String(pricePerUnit)),
        qualityGrade,
        harvestDate: harvestDate ? new Date(harvestDate) : new Date(),
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80',
        description,
        hubId: hubId || null,
        status: 'AVAILABLE',
      },
      include: {
        farmer: {
          select: {
            id: true,
            name: true,
            phone: true,
            location: true,
          },
        },
        hub: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Produce listing created successfully',
      data: newProduce,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to create produce listing' });
  }
};

export const updateProduce = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const existing = await prisma.produce.findUnique({ where: { id } });

    if (!existing) {
      res.status(404).json({ success: false, message: 'Produce not found' });
      return;
    }

    if (existing.farmerId !== req.user.id && req.user.role !== 'ADMIN') {
      res.status(403).json({ success: false, message: 'Forbidden: You can only edit your own produce listings.' });
      return;
    }

    const {
      name,
      category,
      quantity,
      unit,
      pricePerUnit,
      qualityGrade,
      harvestDate,
      imageUrl,
      status,
      description,
      hubId,
    } = req.body;

    const updated = await prisma.produce.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(category !== undefined && { category }),
        ...(quantity !== undefined && { quantity: parseFloat(String(quantity)) }),
        ...(unit !== undefined && { unit }),
        ...(pricePerUnit !== undefined && { pricePerUnit: parseFloat(String(pricePerUnit)) }),
        ...(qualityGrade !== undefined && { qualityGrade }),
        ...(harvestDate !== undefined && { harvestDate: new Date(harvestDate) }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(status !== undefined && { status }),
        ...(description !== undefined && { description }),
        ...(hubId !== undefined && { hubId: hubId || null }),
      },
      include: {
        farmer: {
          select: {
            id: true,
            name: true,
            phone: true,
            location: true,
          },
        },
        hub: true,
      },
    });

    res.json({
      success: true,
      message: 'Produce listing updated successfully',
      data: updated,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to update produce listing' });
  }
};

export const deleteProduce = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const existing = await prisma.produce.findUnique({ where: { id } });

    if (!existing) {
      res.status(404).json({ success: false, message: 'Produce not found' });
      return;
    }

    if (existing.farmerId !== req.user.id && req.user.role !== 'ADMIN') {
      res.status(403).json({ success: false, message: 'Forbidden: You can only delete your own produce listings.' });
      return;
    }

    await prisma.produce.delete({ where: { id } });

    res.json({
      success: true,
      message: 'Produce listing deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to delete produce listing' });
  }
};
