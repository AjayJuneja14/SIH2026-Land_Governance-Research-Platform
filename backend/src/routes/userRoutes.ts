import { Router } from 'express';
import { getAllUsers, getUserById, updateUserProfile } from '../controllers/userController';
import { authenticate, requireRole } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', authenticate, requireRole(['ADMIN']), getAllUsers);
router.get('/:id', getUserById);
router.put('/profile', authenticate, updateUserProfile);

export default router;
