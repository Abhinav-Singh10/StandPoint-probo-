import { NextFunction, Request, Response } from "express";
import { verify, JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../server";

// interface authRequest extends Request {
//     user?: string | JwtPayload | undefined
// }
interface decodedToken extends JwtPayload {
  userId: number;
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies.authToken;

  if (!token) {
    res.status(401).json({
      message: "No token provided",
    });
  }

  try {
    const decoded = verify(token, JWT_SECRET) as decodedToken;
    req.userId = decoded.userId;
    console.log("Auth Successful");

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}
