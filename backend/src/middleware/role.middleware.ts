import { Request, Response, NextFunction } from "express";

export const requireRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.headers["x-role"];

    if (userRole !== role) {
      return res.status(403).json({
        message: `Access denied. Required role: ${role}`,
      });
    }

    next();
  };
};
