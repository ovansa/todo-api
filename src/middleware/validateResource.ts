import { AnyObjectSchema } from 'yup';
import { Request, Response, NextFunction } from 'express';

const validateResource =
  (schema: AnyObjectSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  };

export default validateResource;
