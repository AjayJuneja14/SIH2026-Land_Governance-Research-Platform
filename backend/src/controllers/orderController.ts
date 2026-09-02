import { Request, Response } from 'express';
import prisma from '../services/prisma';
import { AuthRequest } from '../middlewares/authMiddleware';

export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { produceId, quantity, deliveryAddress, hubId, paymentStatus, notes } = req.body;

    if (!produceId || !quantity || !deliveryAddress) {
      res.status(400).json({ success: false, message: 'produceId, quantity, and deliveryAddress are required.' });
      return;
    }

    const orderQty = parseFloat(String(quantity));
    if (orderQty <= 0) {
      res.status(400).json({ success: false, message: 'Quantity must be greater than 0.' });
      return;
    }

    const produce = await prisma.produce.findUnique({
      where: { id: produceId },
      include: { farmer: true },
    });

    if (!produce) {
      res.status(404).json({ success: false, message: 'Produce not found.' });
      return;
    }

    if (produce.status === 'SOLD' || produce.quantity < orderQty) {
      res.status(400).json({
        success: false,
        message: `Insufficient stock. Only ${produce.quantity} ${produce.unit} available.`,
      });
      return;
    }

    const unitPrice = produce.pricePerUnit;
    const totalPrice = unitPrice * orderQty;

    const result = await prisma.$transaction(async (tx) => {
      const remainingQty = produce.quantity - orderQty;
      const newStatus = remainingQty <= 0 ? 'SOLD' : 'AVAILABLE';

      await tx.produce.update({
        where: { id: produceId },
        data: {
          quantity: remainingQty,
          status: newStatus,
        },
      });

      const order = await tx.order.create({
        data: {
          buyerId: req.user!.id,
          produceId,
          quantity: orderQty,
          unitPrice,
          totalPrice,
          deliveryAddress,
          hubId: hubId || produce.hubId || null,
          status: 'PENDING',
          paymentStatus: paymentStatus || 'PENDING',
          notes,
        },
        include: {
          produce: {
            include: {
              farmer: {
                select: {
                  id: true,
                  name: true,
                  phone: true,
                  location: true,
                },
              },
            },
          },
          buyer: {
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

      return order;
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to place order' });
  }
};

export const getBuyerOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const orders = await prisma.order.findMany({
      where: { buyerId: req.user.id },
      include: {
        produce: {
          include: {
            farmer: {
              select: {
                id: true,
                name: true,
                phone: true,
                location: true,
              },
            },
          },
        },
        hub: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, count: orders.length, data: orders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFarmerOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const orders = await prisma.order.findMany({
      where: {
        produce: {
          farmerId: req.user.id,
        },
      },
      include: {
        produce: true,
        buyer: {
          select: {
            id: true,
            name: true,
            phone: true,
            location: true,
          },
        },
        hub: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, count: orders.length, data: orders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.query;
    const where: any = {};
    if (status) {
      where.status = String(status);
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        produce: {
          include: {
            farmer: {
              select: {
                id: true,
                name: true,
                phone: true,
                location: true,
              },
            },
          },
        },
        buyer: {
          select: {
            id: true,
            name: true,
            phone: true,
            location: true,
          },
        },
        hub: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, count: orders.length, data: orders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    const order = await prisma.order.findUnique({
      where: { id },
      include: { produce: true },
    });

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    const isFarmer = order.produce.farmerId === req.user.id;
    const isBuyer = order.buyerId === req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    if (!isFarmer && !isBuyer && !isAdmin) {
      res.status(403).json({ success: false, message: 'Not authorized to update this order' });
      return;
    }

    const updated = await prisma.order.update({
      where: { id },
      data: {
        ...(status && { status: String(status) }),
        ...(paymentStatus && { paymentStatus: String(paymentStatus) }),
      },
      include: {
        produce: {
          include: {
            farmer: {
              select: {
                id: true,
                name: true,
                phone: true,
                location: true,
              },
            },
          },
        },
        buyer: {
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
      message: 'Order status updated successfully',
      data: updated,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to update order status' });
  }
};
