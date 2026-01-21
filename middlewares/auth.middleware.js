import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

// authentication middleware
export const authenticate = async (req, res, next) => {
   const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }
  
  
 const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("_id role isAdmin");

      if (!user) {
        return res.status(401).json({ message: "Invalid token" });
      }

      req.user = { _id: user._id, isAdmin: user.isAdmin, role: user.role };
      
      next()
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  }

// --- 2️⃣ Role-specific access control ---
export const allowAdmin = (req, res, next) => {
  if (req.user.isAdmin || req.user.role.includes("admin")) return next();
  return res.status(403).json({ message: "Admin access required" });
};

export const allowInstructor = (req, res, next) => {
  if (req.user.role.includes("instructor")) return next();
  return res.status(403).json({ message: "Instructor access required" });
};

export const allowStudent = (req, res, next) => {
  if (req.user.role.includes("user")) return next();
  return res.status(403).json({ message: "Student access required" });
};
