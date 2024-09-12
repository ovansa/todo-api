import { Request, Response, NextFunction } from 'express';
import { AnyObjectSchema } from 'yup';

const validateResource =
  (schema: AnyObjectSchema) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(400).json({ success: false, message: error.message });
      } else {
        return res.status(400).json({ success: false, message: 'An unknown error occurred.' });
      }
    }
  };

export default validateResource;
