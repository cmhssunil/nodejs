import express from 'express';
import { 
          createCustomer,
          getCustomers,
          getCustomerById,
          updateCustomer,
          deleteCustomer,
          loginCustomer,
          refreshCustomerToken,
          logoutCustomer
        } from '../controllers/customerController';

import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

// Customer Authentication Routes (no authentication required)
router.post('/login', loginCustomer);
router.post('/refresh-token', refreshCustomerToken);
router.post('/logout', logoutCustomer);

// Customer CRUD Routes (authentication required)
router.post('/', authenticate, createCustomer);
router.get("/", authenticate, getCustomers);
router.get("/:id", authenticate, getCustomerById);
router.put("/:id", authenticate, updateCustomer);
router.delete("/:id", authenticate, deleteCustomer);

export default router;
