import { Router } from 'express';
import { getAllHubs, getHubById, createHub } from '../controllers/hubController';
import { authenticate, requireRole } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', getAllHubs);
router.get('/:id', getHubById);
router.post('/', authenticate, requireRole(['ADMIN']), createHub);

export default router;
