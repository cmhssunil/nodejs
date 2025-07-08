import express from 'express';
import {
  createClinicalConsultation,
  getClinicalConsultations,
  getClinicalConsultationById,
  updateClinicalConsultation,
  deleteClinicalConsultation,
  reviewClinicalConsultation,
  getClinicalConsultationsByStatus,
  getClinicalConsultationsByIndividual
} from '../controllers/clinicalConsultationController';

import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

// Clinical Consultation CRUD Routes (authentication required)
router.post('/', authenticate, createClinicalConsultation);
router.get('/', authenticate, getClinicalConsultations);
router.get('/:id', authenticate, getClinicalConsultationById);
router.put('/:id', authenticate, updateClinicalConsultation);
router.delete('/:id', authenticate, deleteClinicalConsultation);

// Special Routes
router.patch('/:id/review', authenticate, reviewClinicalConsultation);
router.get('/status/:status', authenticate, getClinicalConsultationsByStatus);
router.get('/individual/:individual', authenticate, getClinicalConsultationsByIndividual);

export default router; 