import express from 'express';
import { exportCSV, exportExcel } from '../controllers/export.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

router.get('/csv', exportCSV);
router.get('/excel', exportExcel);

export default router;
