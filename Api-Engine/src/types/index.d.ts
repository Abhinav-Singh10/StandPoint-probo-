import * as express from "express";
import { JwtPayload } from "jsonwebtoken";

interface decodedToken extends JwtPayload {
    userId: number
}

declare global {
  namespace Express {
    interface Request {
      user: string | decodedToken| undefined; 
    }
  }
}