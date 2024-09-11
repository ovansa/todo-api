import { Request, Response } from 'express';

export const healthCheck = (req: Request, res: Response) => {
  return res.status(200).json({ success: true, message: 'Salaamun Alaykum!' });
};
