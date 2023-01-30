import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
const secret = process.env.JWT_SECRET as string;
import { userInstance } from '../model/userModel';

export async function adminAuth(req: Request | any, res: Response, next: NextFunction) {
  try {
    console.log(req.headers.authorization);

    const authorization: string = req.headers.authorization.split(' ')[1];
    if (!authorization) {
      res.status(401).json({
        Error: 'Kindly sign in as a user',
      });
    }

    const token = authorization;
    let verified = jwt.verify(token, secret);

    if (!verified) {
      return res.status(401).json({
        Error: 'User not verified, you cant access this route',
      });
    }

    const { id } = verified as { [key: string]: string };

    const user = await userInstance.findById(id);

    if (!user) {
      return res.status(404).json({
        Error: 'User not verified',
      });
    }

    if (user.role !== 'admin') {
      return res.status(401).json({
        Error: 'You are not authorized to access this route',
      });
    }

    req.user = verified;
    next();
  } catch (error) {
    console.log(error);

    res.status(403).json({
      Error: 'User not logged in',
    });
  }
}
