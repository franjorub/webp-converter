// src/routes/healthRoutes.ts
import { Router } from 'express';
import { healthCheck } from '../controllers/healthController';

const router = Router();

// Ruta GET para healthcheck
router.get('/', healthCheck);

export default router;
