import { Request, Response } from "express";
import ClinicalConsultation from "../models/ClinicalConsultation";

// ✅ Create Clinical Consultation
export const createClinicalConsultation = async (req: Request, res: Response) => {
  try {
    const {
      individual,
      consultation_date,
      consultation_time,
      location,
      submitted_by,
      observations,
      description,
      status = 'pending'
    } = req.body;

    // Validate required fields
    if (!individual || !consultation_date || !consultation_time || !location || !submitted_by || !description) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: individual, consultation_date, consultation_time, location, submitted_by, and description are required"
      });
    }

    const consultation = await ClinicalConsultation.create({
      individual,
      consultation_date,
      consultation_time,
      location,
      submitted_by,
      observations,
      description,
      status,
      submitted_at: new Date()
    });

    res.status(201).json({
      success: true,
      message: "Clinical consultation created successfully",
      consultation
    });
  } catch (error) {
    console.error("Error creating clinical consultation:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create clinical consultation: Internal server error"
    });
  }
};

// ✅ Get All Clinical Consultations
export const getClinicalConsultations = async (req: Request, res: Response) => {
  try {
    const consultations = await ClinicalConsultation.findAll({
      order: [['created_at', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      message: "Clinical consultations retrieved successfully",
      consultations
    });
  } catch (error) {
    console.error("Error fetching clinical consultations:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch clinical consultations: Internal server error"
    });
  }
};

// ✅ Get Clinical Consultation by ID
export const getClinicalConsultationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const consultation = await ClinicalConsultation.findByPk(id);

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: "Clinical consultation not found: No consultation exists with the provided ID"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Clinical consultation retrieved successfully",
      consultation
    });
  } catch (error) {
    console.error("Error fetching clinical consultation:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch clinical consultation: Internal server error"
    });
  }
};

// ✅ Update Clinical Consultation
export const updateClinicalConsultation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      individual,
      consultation_date,
      consultation_time,
      location,
      observations,
      description,
      status,
      notes
    } = req.body;

    const consultation = await ClinicalConsultation.findByPk(id);
    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: "Update failed: Clinical consultation not found"
      });
    }

    // Update fields
    const updateData: any = {};
    if (individual) updateData.individual = individual;
    if (consultation_date) updateData.consultation_date = consultation_date;
    if (consultation_time) updateData.consultation_time = consultation_time;
    if (location) updateData.location = location;
    if (observations !== undefined) updateData.observations = observations;
    if (description) updateData.description = description;
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    await consultation.update(updateData);

    return res.status(200).json({
      success: true,
      message: "Clinical consultation updated successfully",
      consultation
    });
  } catch (error) {
    console.error("Error updating clinical consultation:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update clinical consultation: Internal server error"
    });
  }
};

// ✅ Delete Clinical Consultation
export const deleteClinicalConsultation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const consultation = await ClinicalConsultation.findByPk(id);

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: "Delete failed: Clinical consultation not found"
      });
    }

    await consultation.destroy();
    return res.status(200).json({
      success: true,
      message: "Clinical consultation deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting clinical consultation:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete clinical consultation: Internal server error"
    });
  }
};

// ✅ Review Clinical Consultation
export const reviewClinicalConsultation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, notes, reviewed_by } = req.body;

    const consultation = await ClinicalConsultation.findByPk(id);
    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: "Review failed: Clinical consultation not found"
      });
    }

    // Update review information
    const updateData: any = {
      status: status || consultation.status,
      reviewed_at: new Date()
    };

    if (notes !== undefined) updateData.notes = notes;
    if (reviewed_by) updateData.reviewed_by = reviewed_by;

    await consultation.update(updateData);

    return res.status(200).json({
      success: true,
      message: "Clinical consultation reviewed successfully",
      consultation
    });
  } catch (error) {
    console.error("Error reviewing clinical consultation:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to review clinical consultation: Internal server error"
    });
  }
};

// ✅ Get Clinical Consultations by Status
export const getClinicalConsultationsByStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.params;
    
    const consultations = await ClinicalConsultation.findAll({
      where: { status },
      order: [['created_at', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      message: `Clinical consultations with status '${status}' retrieved successfully`,
      consultations
    });
  } catch (error) {
    console.error("Error fetching clinical consultations by status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch clinical consultations by status: Internal server error"
    });
  }
};

// ✅ Get Clinical Consultations by Individual
export const getClinicalConsultationsByIndividual = async (req: Request, res: Response) => {
  try {
    const { individual } = req.params;
    
    const consultations = await ClinicalConsultation.findAll({
      where: { individual },
      order: [['consultation_date', 'DESC'], ['consultation_time', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      message: `Clinical consultations for '${individual}' retrieved successfully`,
      consultations
    });
  } catch (error) {
    console.error("Error fetching clinical consultations by individual:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch clinical consultations by individual: Internal server error"
    });
  }
}; 