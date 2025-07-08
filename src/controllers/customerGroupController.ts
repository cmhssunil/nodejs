import { Request, Response } from 'express';
import CustomerGroup from '../models/CustomerGroup';
import Group from "../models/Group";
import Customer from "../models/Customer";


export const assignCustomerToGroup = async (req: Request, res: Response) => {
  try{
    const { customer_id, group_id } = req.body;
    await CustomerGroup.create({ customer_id, group_id });
    res.status(201).json({ message: 'Customer assigned to group successfully' });
  } catch (error) {
    res.status(500).json({ message: "Error Assign customer to group", error });
  }

};

// ✅ Get Single Customer by ID
export const getGroupsByCustomerId = async (req: Request, res: Response) => {
  const { customer_id } = req.params;

  try {
    const groups = await Group.findAll({
      
      attributes: ["id", "groupname"],
      include: [
        {
          model: Customer,
          through: { attributes: [] }, // This prevents extra join table data
          where: { id: customer_id },
          attributes: [],
        },
      ],
    });

    if (!groups.length) {
      return res.status(404).json({ message: "No groups found for this customer" });
    }

    res.json(groups);
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.status(500).json({ message: "Error fetching groups", error });
  }
};


