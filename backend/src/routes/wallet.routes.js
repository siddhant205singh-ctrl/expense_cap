import express from 'express';
import { createWallet, getWallets, getWallet, updateWallet, deleteWallet, transferBetweenWallets } from '../controllers/wallet.controller.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createWalletSchema, updateWalletSchema } from '../validators/wallet.validators.js';

const router = express.Router();
router.use(protect);

router.post('/transfer', transferBetweenWallets);

router.route('/')
  .get(getWallets)
  .post(validate(createWalletSchema), createWallet);

router.route('/:id')
  .get(getWallet)
  .patch(validate(updateWalletSchema), updateWallet)
  .delete(deleteWallet);

export default router;
