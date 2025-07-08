import { Request, Response } from "express";
import Customer from "../models/Customer";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const createCustomer = async (req: Request, res: Response) => {
  try {
    const { fname, lname, email, phone, password } = req.body;
    const customer = await Customer.create({ fname,lname, email, phone,password });
    res.status(201).json({
      success: true,
      message: "Customer created successfully",
      customer
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Failed to create customer: Internal server error" 
    });
  }
};


// ✅ Get All Customers
export const getCustomers = async (req: Request, res: Response) => {
    try {
        const customers = await Customer.findAll();
        return res.status(200).json({
            success: true,
            message: "Customers retrieved successfully",
            customers
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false,
            message: "Failed to fetch customers: Internal server error" 
        });
    }
};


// ✅ Get Single Customer by ID
export const getCustomerById = async (req: Request, res: Response) => {
  try {
      const { id } = req.params;
      const customer = await Customer.findByPk(id);

      if (!customer) {
          return res.status(404).json({ 
              success: false,
              message: "Customer not found: No customer exists with the provided ID" 
          });
      }
      return res.status(200).json({
          success: true,
          message: "Customer retrieved successfully",
          customer
      });
  } catch (error) {
      return res.status(500).json({ 
          success: false,
          message: "Failed to fetch customer: Internal server error" 
      });
  }
};

// ✅ Update a Customer
export const updateCustomer = async (req: Request, res: Response) => {
  try {
      const { id } = req.params;
      const { fname, lname, email, phone, password } = req.body;

      const customer = await Customer.findByPk(id);
      if (!customer) {
          return res.status(404).json({ 
              success: false,
              message: "Update failed: Customer not found" 
          });
      }

      await customer.update({ fname,lname, email, phone,password });
      return res.status(200).json({ 
          success: true,
          message: "Customer updated successfully", 
          customer 
      });
  } catch (error) {
      return res.status(500).json({ 
          success: false,
          message: "Failed to update customer: Internal server error" 
      });
  }
};


// ✅ Delete a Customer
export const deleteCustomer = async (req: Request, res: Response) => {
  try {
      const { id } = req.params;
      const customer = await Customer.findByPk(id);

      if (!customer) {
          return res.status(404).json({ 
              success: false,
              message: "Delete failed: Customer not found" 
          });
      }

      await customer.destroy();
      return res.status(200).json({ 
          success: true,
          message: "Customer deleted successfully" 
      });
  } catch (error) {
      return res.status(500).json({ 
          success: false,
          message: "Failed to delete customer: Internal server error" 
      });
  }
};

// ✅ Customer Login
export const loginCustomer = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Login failed: Email and password are required" 
      });
    }

    // Find customer by email
    const customer = await Customer.findOne({ where: { email } });

    if (!customer) {
      return res.status(401).json({ 
        success: false,
        message: "Login failed: Invalid email or password" 
      });
    }

    // Check if customer is authorized
    if (!customer.authorized) {
      return res.status(403).json({ 
        success: false,
        message: "Login failed: Your account is not authorized. Please contact administrator." 
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, customer.password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false,
        message: "Login failed: Invalid email or password" 
      });
    }

    // Update login count and last login datetime
    await customer.update({
      logincount: customer.logincount + 1,
      lastlogindatetime: new Date()
    });

    // Generate JWT token
    const accessToken = jwt.sign(
      { 
        id: customer.id, 
        email: customer.email,
        type: 'customer' 
      }, 
      process.env.JWT_SECRET!, 
      { expiresIn: "24h" }
    );

    // Generate refresh token
    const refreshToken = jwt.sign(
      { 
        id: customer.id, 
        email: customer.email,
        type: 'customer' 
      },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: "7d" }
    );

    // Set refresh token in httpOnly cookie
    res.cookie("customerRefreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "strict",
      path: "/api/customers/refresh-token",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Return customer data (excluding password) and access token
    const customerData = {
      id: customer.id,
      fname: customer.fname,
      lname: customer.lname,
      email: customer.email,
      phone: customer.phone,
      logincount: customer.logincount,
      lastlogindatetime: customer.lastlogindatetime,
      authorized: customer.authorized,
      forcepasswordchange: customer.forcepasswordchange
    };

    res.status(200).json({ 
      success: true,
      message: "Login successful! Welcome back, " + customer.fname,
      customer: customerData,
      accessToken 
    });

  } catch (error) {
    console.error("Customer login error:", error);
    res.status(500).json({ 
      success: false,
      message: "Login failed: Internal server error. Please try again later." 
    });
  }
};

// ✅ Customer Refresh Token
export const refreshCustomerToken = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.customerRefreshToken;

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: "Token refresh failed: Refresh token missing" 
      });
    }

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!, (err: jwt.VerifyErrors | null, decoded: string | JwtPayload | undefined) => {
      if (err) {
        return res.status(403).json({ 
          success: false,
          message: "Token refresh failed: Invalid refresh token" 
        });
      }
      
      const payload = decoded as JwtPayload;
      
      // Verify customer still exists in database
      Customer.findByPk(payload.id).then(customer => {
        if (!customer) {
          return res.status(403).json({ 
            success: false,
            message: "Token refresh failed: Customer account no longer exists" 
          });
        }

        if (!customer.authorized) {
          return res.status(403).json({ 
            success: false,
            message: "Token refresh failed: Customer account is not authorized" 
          });
        }
        
        const newAccessToken = jwt.sign(
          { 
            id: payload.id, 
            email: payload.email,
            type: 'customer' 
          },
          process.env.JWT_SECRET!,
          { expiresIn: "24h" }
        );
      
        res.status(200).json({ 
          success: true,
          message: "Token refreshed successfully",
          accessToken: newAccessToken 
        });
      }).catch(() => {
        res.status(403).json({ 
          success: false,
          message: "Token refresh failed: Customer verification failed" 
        });
      });
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Token refresh failed: Internal server error" 
    });
  }
};

// ✅ Customer Logout
export const logoutCustomer = (req: Request, res: Response) => {
  try {
    res.clearCookie("customerRefreshToken", {
      path: "/api/customers/refresh-token",
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "strict",
    });

    res.status(200).json({ 
      success: true,
      message: "Logout successful: You have been logged out successfully" 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Logout failed: Internal server error" 
    });
  }
};