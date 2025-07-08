// middlewares/authenticate.ts
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// Extend Express Request interface for better type safety
declare global {
  namespace Express {
    interface Request {
      userId?: number;
      userType?: string;
      customerId?: number;
      customerEmail?: string;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    
    // Handle both admin users and customers
    if (decoded.type === 'customer') {
      req.customerId = decoded.id;
      req.customerEmail = decoded.email;
    } else {
      req.userId = decoded.id;
      req.userType = decoded.type;
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

// Middleware specifically for admin users
export const authenticateAdmin = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    
    if (decoded.type !== 'super_admin' && decoded.type !== 'sub_admin') {
      return res.status(403).json({ message: "Access denied: Admin privileges required" });
    }

    req.userId = decoded.id;
    req.userType = decoded.type;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

// Middleware specifically for customers
export const authenticateCustomer = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    
    if (decoded.type !== 'customer') {
      return res.status(403).json({ message: "Access denied: Customer privileges required" });
    }

    req.customerId = decoded.id;
    req.customerEmail = decoded.email;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
