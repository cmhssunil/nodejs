import { Request, Response } from "express";
import Group from "../models/Group";

// ✅ Create a Group
export const createGroup = async (req: Request, res: Response) => {
    try {
        const { groupName, description, type } = req.body;
        if (!groupName || !type) {
            return res.status(400).json({ message: "Group name and type are required" });
        }

        const group = await Group.create({ groupName, description, type });
        return res.status(201).json({ message: "Group created successfully", group });
    } catch (error) {
        return res.status(500).json({ message: "Error creating group", error });
    }
};

// ✅ Get All Groups
export const getGroups = async (req: Request, res: Response) => {
    try {
        const groups = await Group.findAll();
        return res.status(200).json(groups);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching groups", error });
    }
};

// ✅ Get Single Group by ID
export const getGroupById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const group = await Group.findByPk(id);

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }
        return res.status(200).json(group);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching group", error });
    }
};

// ✅ Update a Group
export const updateGroup = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { groupName, description, type } = req.body;

        const group = await Group.findByPk(id);
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        await group.update({ groupName, description, type });
        return res.status(200).json({ message: "Group updated successfully", group });
    } catch (error) {
        return res.status(500).json({ message: "Error updating group", error });
    }
};

// ✅ Delete a Group
export const deleteGroup = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const group = await Group.findByPk(id);

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        await group.destroy();
        return res.status(200).json({ message: "Group deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error deleting group", error });
    }
};
