import { Router } from 'express';
import { getForecast, getRouteOptimization } from '../controllers/aiController';

const router = Router();

// Scaffold placeholder AI routes
router.get('/forecast', getForecast);
router.post('/route-optimize', getRouteOptimization);

export default router;
