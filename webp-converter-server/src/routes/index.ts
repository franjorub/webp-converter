import { Router } from 'express';
import imageRoutes from './imageRoutes';
import healthRoutes from './healthRoutes';

const router = Router();

router.use('/images', imageRoutes);
router.use('/status', healthRoutes);

export default router;
