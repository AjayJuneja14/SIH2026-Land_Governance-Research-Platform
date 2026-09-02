import { Router } from 'express';
import {
  createOrder,
  getBuyerOrders,
  getFarmerOrders,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController';
import { authenticate, requireRole } from '../middlewares/authMiddleware';

const router = Router();

// Place order (Buyer/Admin)
router.post('/', authenticate, requireRole(['BUYER', 'ADMIN']), createOrder);

// Get my orders as a Buyer
router.get('/my-orders', authenticate, getBuyerOrders);

// Get incoming orders for Farmer
router.get('/farmer-orders', authenticate, requireRole(['FARMER', 'ADMIN']), getFarmerOrders);

// Get all orders (Admin only)
router.get('/all', authenticate, requireRole(['ADMIN']), getAllOrders);

// Update order status (Farmer, Buyer, or Admin)
router.patch('/:id/status', authenticate, updateOrderStatus);

export default router;
