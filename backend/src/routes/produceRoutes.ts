import { Router } from 'express';
import {
  getAllProduce,
  getProduceById,
  createProduce,
  updateProduce,
  deleteProduce,
} from '../controllers/produceController';
import { authenticate, requireRole } from '../middlewares/authMiddleware';

const router = Router();

// Public browse routes
router.get('/', getAllProduce);
router.get('/:id', getProduceById);

// Protected routes for Farmers & Admin
router.post('/', authenticate, requireRole(['FARMER', 'ADMIN']), createProduce);
router.put('/:id', authenticate, requireRole(['FARMER', 'ADMIN']), updateProduce);
router.delete('/:id', authenticate, requireRole(['FARMER', 'ADMIN']), deleteProduce);

export default router;
