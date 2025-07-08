import express from 'express';
import { assignCustomerToGroup, getGroupsByCustomerId } from '../controllers/customerGroupController';

import { authenticate } from '../middleware/authMiddleware';


const router = express.Router();
router.post('/',authenticate, assignCustomerToGroup);
router.get("/:customer_id", authenticate, getGroupsByCustomerId);

export default router;
